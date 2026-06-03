"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Booking } from "@/lib/types";
import { parsePackageName } from "@/lib/utils";

const COLORS = ["#0077B6", "#F4A400", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"];

interface Props {
  bookings: Booking[];
}

export default function PackagesPie({ bookings }: Props) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const name = parsePackageName(b.package);
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-bold text-lg mb-4">توزيع الباقات</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#0F2236", border: "1px solid rgba(0,119,182,0.3)", borderRadius: 8, fontFamily: "Tajawal" }}
            itemStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ fontFamily: "Tajawal", fontSize: 12, color: "#94a3b8" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
