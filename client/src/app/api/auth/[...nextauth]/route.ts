import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/axios";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const response = await api.get('/api/users');
          const users = response.data;

          console.log("users", users);

          const user = users.find((user: any) =>
            user.username === credentials.username &&
            user.password === credentials.password
          );

          console.log("find user", user);

          if (user) {
            return user;
          } else {
            return null;
          }

        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };