import type { Metadata } from "next";
import "./globals.css";
import ClientSessionProvider from "@/components/providers/ClientSessionProvider";

export const metadata: Metadata = {
  title: "Digiart Creation",
  description: "Digiart Creation dashboard",
  icons: {
    icon: "/digiart-logo.jpg",
    shortcut: "/digiart-logo.jpg",
    apple: "/digiart-logo.jpg",
  },
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
