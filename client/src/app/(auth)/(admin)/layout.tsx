import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="w-full h-screen flex">
            <AdminSidebar />
            <div className="w-[94%] bg-[#E7EEF4]">
                <AdminHeader/>
                <div>{children}</div>
            </div>
        </div>
      </body>
    </html>
  );
}
