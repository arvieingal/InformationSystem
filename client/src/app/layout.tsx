import type { Metadata } from "next";
import "./globals.css";
import ProvidersWrappers from "@/components/ProvidersWrappers";

export const metadata: Metadata = {
  title: "Brgy.Luz Information System",
  description: "Brgy.Luz Information System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProvidersWrappers>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ProvidersWrappers>
  );
}
