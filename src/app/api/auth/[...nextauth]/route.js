import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // Name of the provider
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          // Replace this with your own logic to validate the user
          const response = await fetch("https://your-api-endpoint/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // Check if the response is okay
          if (!response.ok) {
            throw new Error("Invalid credentials"); // Throw an error for non-2xx status codes
          }

          const user = await response.json();

          // If no error and we have a user, return it
          if (user && user.id) {
            return user; // Return user object
          } else {
            throw new Error("User not found"); // Throw an error if user not found
          }
        } catch (error) {
          // Log the error for debugging purposes
          console.error("Authentication Error:", error);
          // Return null to indicate login failure
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT for session handling
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Add user ID to the session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Set your secret key
};

export default NextAuth(authOptions);
