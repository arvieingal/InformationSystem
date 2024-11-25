import HealthHeader from "@/components/HealthHeader";
import HealthSidebar from "@/components/HealthSidebar";

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
            <HealthSidebar />
          </div>
          <div className="w-[94%] bg-[#E7EEF4] overflow-y-auto">
            <div className="h-[11%]"><HealthHeader /></div>
            <div className="h-[89%]">{children}</div>
          </div>
        </div>
      </body>
      </html>
    );
  }
  