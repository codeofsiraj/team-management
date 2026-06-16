import type { Metadata } from "next";
import "./globals.css";
import ClientSessionProvider from "@/components/providers/ClientSessionProvider";

export const metadata: Metadata = {
  title: "Team Management System",
  description: "Project Foundation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}