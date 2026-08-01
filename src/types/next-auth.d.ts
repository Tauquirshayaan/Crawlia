/**
 * NextAuth type augmentation.
 *
 * Adds `id` to the `Session.user` type so we don't need
 * `(session?.user as any)?.id` scattered across 12+ files.
 *
 * Place this file anywhere in src/ — TypeScript picks it up automatically
 * because it's included in the tsconfig rootDir.
 */

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
