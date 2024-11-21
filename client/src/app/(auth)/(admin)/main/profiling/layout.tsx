import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfilingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <div className="w-screen flex h-screen">
          <div className="w-[6%]">
            <AdminSidebar />
          </div>
          <div className="w-[94%] bg-[#E7EEF4]">
            <div className="h-[11%]"><AdminHeader /></div>
            <div className="h-[89%]">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
