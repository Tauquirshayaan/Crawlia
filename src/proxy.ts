import { withAuth } from "next-auth/middleware";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Return true if the user is logged in
      return !!token;
    },
  },
});

export const config = {
  // Protect all /dashboard and /api routes (except /api/auth)
  matcher: [
    "/dashboard/:path*",
    "/api/campaigns/:path*",
    "/api/leads/:path*",
    "/api/analyze/:path*",
    // Specifically exclude cron endpoints as they use CRON_SECRET
    // "/api/cron/:path*" <- next.js matcher regex syntax is tricky to exclude conditionally inside matcher array.
    // Instead we will match specific API routes we know need protecting, rather than all of /api/
  ],
};
