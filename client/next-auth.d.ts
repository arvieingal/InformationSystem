import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
      role?: "Admin" | "Viewer" | "Editor";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}