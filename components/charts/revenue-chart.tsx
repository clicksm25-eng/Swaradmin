"use client";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Booking } from "@/lib/types";
import { parseAmount } from "@/lib/utils";

interface Props {
  bookings: Booking[];
}

export default function RevenueChart({ bookings }: Props) {
  const data = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days[key] = 0;
    }
    bookings
      .filter((b) => b.status !== "cancelled")
      .forEach((b) => {
        if (days[b.date] !== undefined) {
          days[b.date] += parseAmount(b.deposit);
        }
      });
    return Object.entries(days).map(([date, revenue]) => ({
      date: date.slice(5),
      revenue,
    }));
  }, [bookings]);

  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-bold text-lg mb-4">إيرادات آخر 30 يوم</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,119,182,0.1)" />
          <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fontFamily: "Tajawal" }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: "#0F2236", border: "1px solid rgba(0,119,182,0.3)", borderRadius: 8, fontFamily: "Tajawal" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => [Number(v).toLocaleString("ar-SA") + " ريال", "الإيرادات"]}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#F4A400" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
