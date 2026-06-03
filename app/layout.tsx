import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "سوار البحر — لوحة التحكم",
  description: "لوحة تحكم إدارية لسوار البحر",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen bg-[#0D1B2A] text-slate-200 font-tajawal">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
