import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Analytics from "@/components/layout/Analytics";

export const metadata: Metadata = {
  title: "MoveIn | Pune's #1 Student Housing Platform",
  description: "Find verified PGs, Hostels, and Co-Living spaces near your college in Pune. Verified stays. Real distances. Zero scams.",
};

import MainLayout from "@/components/layout/MainLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-sand text-brand-ink font-body">
        <AuthProvider>
          <MainLayout>
            <Analytics />
            {children}
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
