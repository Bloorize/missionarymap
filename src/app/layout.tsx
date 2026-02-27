import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "MissionMap Live",
  description: "Real-time mission call guessing game with host livestreaming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-slate-50 text-slate-950 antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
