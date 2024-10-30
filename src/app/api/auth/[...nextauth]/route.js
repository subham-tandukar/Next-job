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
          const response = await fetch(
            "https://genesisapi.popmanteau.com/api/v1/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const responseData = await response.json();
          if (response.status === 500) {
            // Handle server error with a custom message
            throw new Error("Internal Server Error. Please try again later.");
          }

          // Check if the API response contains an error message
          if (!response.ok || responseData.error) {
            throw new Error(
              responseData.errors?.message || "An unknown error occurred."
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
      if (user) {
        token.user = user.response;
      }
      return token;
    },
    async session({ session, token }) {
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
