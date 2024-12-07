import "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      user_id?: number;
      username?: string;
      role?: "Admin" | "Viewer" | "Editor";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}