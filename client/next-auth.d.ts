import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      firstname?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}