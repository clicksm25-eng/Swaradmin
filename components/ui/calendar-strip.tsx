"use client";
import { useMemo } from "react";
import { Booking } from "@/lib/types";
import { getTodayDate } from "@/lib/utils";

interface CalendarStripProps {
  bookings: Booking[];
}

const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export default function CalendarStrip({ bookings }: CalendarStripProps) {
  const today = getTodayDate();

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const dayBookings = bookings.filter((b) => b.date === dateStr && b.status !== "cancelled");
      const totalPersons = dayBookings.reduce((sum, b) => sum + (parseInt(b.persons) || 0), 0);
      result.push({
        dateStr,
        dayName: DAY_NAMES[d.getDay()],
        dayNum: d.getDate(),
        count: dayBookings.length,
        persons: totalPersons,
        capacity: Math.min(totalPersons / 10, 1),
      });
    }
    return result;
  }, [bookings]);

  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-bold text-lg mb-4">جدول الرحلات — 30 يوماً</h3>
      <div className="flex gap-3 overflow-x-auto pb-3" style={{ direction: "ltr" }}>
        {days.map((day) => {
          const isToday = day.dateStr === today;
          const color =
            day.count === 0
              ? "border-green-500/30 bg-green-500/5"
              : day.capacity >= 0.8
              ? "border-red-500/30 bg-red-500/10"
              : "border-yellow-500/30 bg-yellow-500/10";

          return (
            <div
              key={day.dateStr}
              className={`flex-shrink-0 w-20 rounded-xl border ${color} p-3 text-center transition-all ${
                isToday ? "ring-2 ring-[#0077B6]" : ""
              }`}
            >
              <p className="text-slate-400 text-xs">{day.dayName}</p>
              <p className={`font-bold text-lg ${isToday ? "text-[#0077B6]" : "text-white"}`}>
                {day.dayNum}
              </p>
              <p className="text-slate-300 text-sm font-medium">{day.count}</p>
              <p className="text-slate-500 text-xs">رحلة</p>
              <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    day.capacity >= 0.8 ? "bg-red-500" : day.capacity > 0 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${day.capacity * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
