import { signOut } from "next-auth/react";
import React from "react";

interface SignOutButtonProps {
  userName: string | null | undefined;
}

export default function SignOutButton({ userName }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Welcome {userName}
      <br />
      Sign Out
    </button>
  );
}
