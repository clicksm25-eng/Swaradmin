import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "احجز رحلتك — سوار البحر",
  description: "احجز رحلتك البحرية الفاخرة في البحر الأحمر — سوار البحر",
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(circle at top, #112B45 0%, #0D1B2A 60%, #060f1c 100%)" }}>
      {children}
    </div>
  );
}
