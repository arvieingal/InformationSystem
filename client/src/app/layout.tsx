import type { Metadata } from "next";
import "./globals.css";
import ProvidersWrappers from "@/components/ProvidersWrappers";
import IdleTimer from "@/components/IdleTimer";

export const metadata: Metadata = {
  title: "Brgy.Luz Information System",
  description: "Brgy.Luz Information System",
  icons: {
    icon: ["/favicon.ico?v=4", "/svg/logo.svg"],
    apple: ["/apple-touch-icon.png?v=4", "/svg/logo.svg"],
    shortcut: ["/apple-touch-icon.png", "/svg/logo.svg"],
  },
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
          <IdleTimer />
          {children}
        </body>
      </html>
    </ProvidersWrappers>
  );
}
