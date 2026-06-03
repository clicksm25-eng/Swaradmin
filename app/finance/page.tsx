"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { getBookings } from "@/lib/api";
import { parseAmount, formatCurrency, parsePackageName } from "@/lib/utils";
import Sidebar from "@/components/layout/sidebar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2, Copy, Check, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

const IBAN = "SA4180000993608016031469";
const COLORS = ["#0077B6", "#F4A400", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"];

function getWeekStart() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}
function getMonthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export default function FinancePage() {
  const { data: bookings = [], isLoading } = useSWR("bookings", getBookings, {
    revalidateOnFocus: false,
  });
  const [copied, setCopied] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const weekStart = getWeekStart();
  const monthStart = getMonthStart();

  const validBookings = bookings.filter((b) => b.status !== "cancelled");

  const todayRev = validBookings.filter((b) => b.date === today).reduce((s, b) => s + parseAmount(b.deposit), 0);
  const weekRev = validBookings.filter((b) => b.date >= weekStart).reduce((s, b) => s + parseAmount(b.deposit), 0);
  const monthRev = validBookings.filter((b) => b.date >= monthStart).reduce((s, b) => s + parseAmount(b.deposit), 0);
  const totalRev = validBookings.reduce((s, b) => s + parseAmount(b.deposit), 0);

  const pkgRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    validBookings.forEach((b) => {
      const name = parsePackageName(b.package);
      map[name] = (map[name] || 0) + parseAmount(b.deposit);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  const pending = bookings.filter((b) => b.status === "pending").length;

  const copyIBAN = async () => {
    await navigator.clipboard.writeText(IBAN);
    setCopied(true);
    toast.success("تم نسخ رقم الآيبان");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar pendingCount={pending} lastUpdated={new Date()} />
      <main className="flex-1 lg:mr-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-white font-bold text-2xl lg:text-3xl">المالية</h1>
          <p className="text-slate-400 mt-1">تقرير الإيرادات والمدفوعات</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={32} className="animate-spin text-[#0077B6]" />
          </div>
        ) : (
          <>
            {/* Revenue Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "اليوم", value: todayRev, icon: <Calendar size={20} className="text-white" />, bg: "bg-[#0077B6]" },
                { label: "هذا الأسبوع", value: weekRev, icon: <TrendingUp size={20} className="text-white" />, bg: "bg-purple-600" },
                { label: "هذا الشهر", value: monthRev, icon: <DollarSign size={20} className="text-black" />, bg: "bg-[#F4A400]" },
                { label: "الإجمالي الكلي", value: totalRev, icon: <TrendingUp size={20} className="text-white" />, bg: "bg-green-600" },
              ].map((card) => (
                <div key={card.label} className="glass-card p-5 flex items-center gap-4">
                  <div className={`${card.bg} rounded-2xl p-3 flex-shrink-0`}>{card.icon}</div>
                  <div>
                    <p className="text-slate-400 text-sm">{card.label}</p>
                    <p className="text-white font-bold text-lg mt-1">{formatCurrency(card.value)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart & Bank Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-5">
                <h3 className="text-white font-bold text-lg mb-4">إيرادات حسب نوع الباقة</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pkgRevenue} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {pkgRevenue.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#0F2236", border: "1px solid rgba(0,119,182,0.3)", borderRadius: 8, fontFamily: "Tajawal" }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(v: any) => [formatCurrency(Number(v)), "الإيرادات"]}
                    />
                    <Legend wrapperStyle={{ fontFamily: "Tajawal", fontSize: 12, color: "#94a3b8" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bank Info */}
              <div className="glass-card p-6 flex flex-col justify-center">
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                  🏦 معلومات التحويل البنكي
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-400 text-xs mb-1">البنك</p>
                    <p className="text-white font-medium">مصرف الراجحي</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-400 text-xs mb-1">اسم المستفيد</p>
                    <p className="text-white font-medium">مؤسسة سوار البحر للتجارة</p>
                  </div>
                  <div
                    className="bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-[rgba(0,119,182,0.15)] transition border border-transparent hover:border-[#0077B6]/30"
                    onClick={copyIBAN}
                  >
                    <p className="text-slate-400 text-xs mb-2">رقم الآيبان — انقر للنسخ</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[#0077B6] font-bold tracking-wider" dir="ltr">{IBAN}</p>
                      {copied ? (
                        <Check size={18} className="text-green-400 flex-shrink-0" />
                      ) : (
                        <Copy size={18} className="text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-[rgba(0,119,182,0.2)]">
                <h3 className="text-white font-bold text-lg">تفاصيل المدفوعات</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-[rgba(0,119,182,0.2)]">
                      {["تاريخ الرحلة", "الاسم", "الباقة", "المبلغ الكلي", "المدفوع", "نوع الدفع"].map((h) => (
                        <th key={h} className="text-right text-slate-400 text-xs font-medium py-4 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {validBookings
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((b) => (
                        <tr key={b.id} className="border-b border-[rgba(0,119,182,0.08)] hover:bg-white/5 transition">
                          <td className="py-3 px-4 text-slate-300 text-sm">{b.date}</td>
                          <td className="py-3 px-4 text-white font-medium">{b.name}</td>
                          <td className="py-3 px-4 text-slate-300 text-sm max-w-[180px] truncate">{parsePackageName(b.package)}</td>
                          <td className="py-3 px-4 text-white text-sm">{b.total}</td>
                          <td className="py-3 px-4 text-[#F4A400] font-medium text-sm">{b.deposit}</td>
                          <td className="py-3 px-4 text-slate-400 text-xs">{b.pay_type}</td>
                        </tr>
                      ))}
                    {validBookings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-slate-500 py-12">لا توجد بيانات مالية</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
