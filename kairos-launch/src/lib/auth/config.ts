import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Providers will be added in Phase 2
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : null,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        // Add any additional session data here
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      // Log sign-in events for audit
      console.log("User signed in:", { userId: user.id, provider: account?.provider });
    },
    async signOut({ session }) {
      // Log sign-out events for audit
      console.log("User signed out:", { userId: session?.user?.id });
    },
  },
};

