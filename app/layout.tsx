import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const LOGO = "https://sewarmarine.com/wp-content/uploads/2024/07/%D8%B4%D8%B9%D8%A7%D8%B1_%D8%B3%D9%88%D8%A7%D8%B1-removebg-preview.png";

export const metadata: Metadata = {
  title: "سوار البحر — لوحة التحكم",
  description: "لوحة تحكم إدارية لسوار البحر",
  icons: {
    icon: [{ url: LOGO, type: "image/png" }],
    shortcut: [{ url: LOGO }],
    apple: [{ url: LOGO }],
  },
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
