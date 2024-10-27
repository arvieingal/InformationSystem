"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    {
      session && router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex justify-center items-center">
      {session ? (
        // Removed the sign-out button
        <div>Welcome {session.user?.name}</div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
