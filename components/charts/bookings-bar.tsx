"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Booking } from "@/lib/types";

interface Props {
  bookings: Booking[];
}

export default function BookingsBar({ bookings }: Props) {
  const data = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days[key] = 0;
    }
    bookings.forEach((b) => {
      if (days[b.date] !== undefined) days[b.date]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: date.slice(5),
      count,
    }));
  }, [bookings]);

  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-bold text-lg mb-4">حجوزات آخر 14 يوم</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,119,182,0.1)" />
          <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fontFamily: "Tajawal" }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#0F2236", border: "1px solid rgba(0,119,182,0.3)", borderRadius: 8, fontFamily: "Tajawal" }}
            labelStyle={{ color: "#94a3b8" }}
            itemStyle={{ color: "#0077B6" }}
          />
          <Bar dataKey="count" fill="#0077B6" radius={[6, 6, 0, 0]} name="الحجوزات" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
