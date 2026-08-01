import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  // @ts-ignore - Prisma v7 types might not perfectly align with NextAuth v4 adapter yet
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // ─── Dev-only seed mode ──────────────────────────────────────────────
        // Set DEV_SEED_MODE=true in .env.local ONLY. Never set in production.
        if (process.env.DEV_SEED_MODE === 'true' && process.env.NODE_ENV !== 'production') {
          let user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split('@')[0] || 'Demo User',
                workspaces: {
                  create: {
                    role: 'OWNER',
                    workspace: { create: { name: 'My Workspace', tier: 'PRO' } },
                  },
                },
              },
            });
          }
          return { id: user.id, email: user.email, name: user.name };
        }

        // ─── Production path ─────────────────────────────────────────────────
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash) return null;

        const bcrypt = await import('bcryptjs');
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        // Auto-provision a workspace if this user has none
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { workspaces: true }
        });

        if (dbUser && dbUser.workspaces.length === 0) {
          const newWorkspace = await prisma.workspace.create({
            data: {
              name: `${user.name || "My"} Workspace`,
              tier: "FREE"
            }
          });
          
          await prisma.workspaceMember.create({
            data: {
              userId: dbUser.id,
              workspaceId: newWorkspace.id,
              role: "OWNER"
            }
          });

          // Provision FREE plan subscription
          let freePlan = await prisma.plan.findUnique({ where: { name: 'FREE' } });
          if (!freePlan) {
            // Lazy-create the plan record if not seeded yet
            freePlan = await prisma.plan.create({
              data: {
                name: 'FREE', displayName: 'Free',
                monthlyCredits: 20, rolloverCap: 20,
                maxCampaigns: 1, maxMailboxes: 0, maxTeamMembers: 1,
                canInviteMembers: false, monthlyPrice: 0, annualPrice: 0,
              }
            });
          }

          const now = new Date();
          const nextMonth = new Date(now);
          nextMonth.setMonth(nextMonth.getMonth() + 1);

          await prisma.subscription.create({
            data: {
              workspaceId: newWorkspace.id,
              planId: freePlan.id,
              status: 'ACTIVE',
              interval: 'monthly',
              currentPeriodStart: now,
              currentPeriodEnd: nextMonth,
            }
          });

          // Grant initial FREE credits
          const { grantCredits } = await import('./ledger');
          await grantCredits(
            newWorkspace.id, 20,
            `signup_initial_${newWorkspace.id}`,
            'Initial FREE plan credits',
            'SUBSCRIPTION_ACTIVATION',
          );
        }
      }
      return true;
    },
    async session({ token, session }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};
