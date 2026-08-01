/**
 * Auth context helper — single source of truth for authenticating API routes.
 *
 * Problem it solves:
 *   Every API route copy-pastes these 8 lines:
 *     const session = await getServerSession(authOptions);
 *     const userId = (session?.user as any)?.id || "1";   ← silent security hole
 *     const userWorkspace = await prisma.workspaceMember.findFirst(...)
 *     if (!userWorkspace) return 401/404...
 *
 * Usage:
 *   import { getAuthContext } from "@/lib/session";
 *   const { userId, workspaceId } = await getAuthContext();
 *   // throws AuthError if unauthenticated → caught by route handler
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { prisma } from './prisma';

export class AuthError extends Error {
  readonly status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export interface AuthContext {
  userId: string;
  workspaceId: string;
  /** Raw session — available if you need user.email etc. */
  userEmail: string;
}

/**
 * Resolves the authenticated user and their primary workspace.
 * Throws `AuthError` (401) if there is no valid session.
 * Throws `AuthError` (404) if the user has no workspace.
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    throw new AuthError('Unauthorized — no active session', 401);
  }

  const member = await prisma.workspaceMember.findFirst({
    where: { userId },
    select: { workspaceId: true },
  });

  if (!member) {
    throw new AuthError('Workspace not found for this user', 404);
  }

  return {
    userId,
    workspaceId: member.workspaceId,
    userEmail: session!.user!.email ?? '',
  };
}

/**
 * Wraps a route handler and automatically converts AuthError to a JSON response.
 * Use this to avoid try/catch boilerplate in every route.
 *
 * @example
 * export const GET = withAuth(async (req, ctx) => {
 *   return NextResponse.json({ workspaceId: ctx.workspaceId });
 * });
 */
import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (req: NextRequest, ctx: AuthContext) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const ctx = await getAuthContext();
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof AuthError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      console.error('[withAuth] Unexpected error:', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
