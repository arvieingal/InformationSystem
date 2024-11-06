import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <div className="w-full">
        <AdminHeader />
      </div> */}
      
      <div className="w-full h-full">
        {children}
      </div>
    </>
  );
}