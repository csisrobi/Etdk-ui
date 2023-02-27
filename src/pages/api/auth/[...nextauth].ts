/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkIfAdmin, checkIfUniqueEmail } from "@lib/queries";
import { getClient } from "@lib/sanity";
import NextAuth from "next-auth";
import { SessionStrategy } from "next-auth/core/types";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  callbacks: {
    signIn: async ({ user }: { user: any }) => {
      const participant = await getClient().fetch(
        checkIfUniqueEmail(user.email)
      );
      const admin = await getClient().fetch(checkIfAdmin(user.email));
      if (!participant.length && !admin.length) {
        return false;
      }
      if (participant.length) {
        user.role = "participant";
      } else {
        user.role = admin[0].role;
      }
      return true;
    },
    jwt: ({ token, user }: { token: any; user?: any }) => {
      if (user) {
        token.role = user.role;
        delete token.image;
      }
      return token;
    },
    session: ({ session, token }: { token: any; session: any }) => {
      if (token) {
        session.user.role = token.role;
        delete session.user.image;
      }
      return session;
    },
  },
};
export default NextAuth(authOptions);
