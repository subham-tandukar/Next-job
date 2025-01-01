import { base_url } from "@/utils/apiUrl";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const response = await fetch(`${base_url}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const responseData = await response.json();

          // Check if the API response contains an error message
          if (!response.ok) {
            throw new Error(
              responseData?.message || "An unknown error occurred."
            );
          }

          return responseData; // Return user object if successful
        } catch (error) {
          console.error("Authentication Error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Attach user data to the token
      if (user) {
        token.user = user.data;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token data in the session
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
