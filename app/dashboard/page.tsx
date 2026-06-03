"use client";
import useSWR from "swr";
import { getBookings } from "@/lib/api";
import { parseAmount, getTodayDate, formatCurrency } from "@/lib/utils";
import Sidebar from "@/components/layout/sidebar";
import StatCard from "@/components/ui/stat-card";
import CalendarStrip from "@/components/ui/calendar-strip";
import BookingsBar from "@/components/charts/bookings-bar";
import PackagesPie from "@/components/charts/packages-pie";
import RevenueChart from "@/components/charts/revenue-chart";
import StatusBadge from "@/components/ui/status-badge";
import { Calendar, Clock, CheckCircle, Users, TrendingUp, DollarSign, AlertCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: bookings = [], error, isLoading, isValidating } = useSWR(
    "bookings",
    getBookings,
    { refreshInterval: 60000, revalidateOnFocus: false }
  );

  const today = getTodayDate();
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const todayBookings = bookings.filter((b) => b.date === today).length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + parseAmount(b.deposit), 0);
  const confirmRate = bookings.length > 0 ? Math.round((confirmed / bookings.length) * 100) : 0;
  const latest5 = [...bookings].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);
  const lastUpdated = new Date();

  return (
    <div className="flex min-h-screen">
      <Sidebar pendingCount={pending} lastUpdated={lastUpdated} />

      <main className="flex-1 lg:mr-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-bold text-2xl lg:text-3xl">لوحة التحكم</h1>
            <p className="text-slate-400 mt-1">مرحباً بك في سوار البحر</p>
          </div>
          {isValidating && !isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 size={14} className="animate-spin" />
              <span>تحديث...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <span>تعذّر الاتصال بالموقع، يرجى المحاولة مرة أخرى</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={40} className="animate-spin text-[#0077B6]" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="إجمالي الحجوزات"
                value={bookings.length.toLocaleString("ar-SA")}
                icon={<Calendar size={22} className="text-white" />}
                iconBg="bg-[#0077B6]"
              />
              <StatCard
                title="بانتظار التأكيد"
                value={pending.toLocaleString("ar-SA")}
                icon={<Clock size={22} className="text-black" />}
                iconBg="bg-[#F4A400]"
              />
              <StatCard
                title="حجوزات مؤكدة"
                value={confirmed.toLocaleString("ar-SA")}
                icon={<CheckCircle size={22} className="text-white" />}
                iconBg="bg-green-600"
              />
              <StatCard
                title="رحلات اليوم"
                value={todayBookings.toLocaleString("ar-SA")}
                icon={<Users size={22} className="text-white" />}
                iconBg="bg-purple-600"
              />
              <StatCard
                title="إجمالي الإيرادات"
                value={formatCurrency(totalRevenue)}
                icon={<DollarSign size={22} className="text-black" />}
                iconBg="gold-gradient"
              />
              <StatCard
                title="معدل التأكيد"
                value={confirmRate.toLocaleString("ar-SA") + "%"}
                icon={<TrendingUp size={22} className="text-white" />}
                iconBg="bg-teal-600"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <BookingsBar bookings={bookings} />
              <PackagesPie bookings={bookings} />
            </div>

            <div className="mb-8">
              <RevenueChart bookings={bookings} />
            </div>

            {/* Calendar Strip */}
            <div className="mb-8">
              <CalendarStrip bookings={bookings} />
            </div>

            {/* Latest Bookings */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold text-lg mb-4">آخر الحجوزات</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(0,119,182,0.2)]">
                      {["الاسم", "الباقة", "تاريخ الرحلة", "المبلغ", "الحالة"].map((h) => (
                        <th key={h} className="text-right text-slate-400 text-sm font-medium py-3 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {latest5.map((b) => (
                      <tr key={b.id} className="border-b border-[rgba(0,119,182,0.1)] hover:bg-white/5 transition">
                        <td className="py-3 px-4 text-white font-medium">{b.name}</td>
                        <td className="py-3 px-4 text-slate-300 text-sm max-w-[200px] truncate">{b.package.split("|")[0]}</td>
                        <td className="py-3 px-4 text-slate-300 text-sm">{b.date}</td>
                        <td className="py-3 px-4 text-[#F4A400] text-sm">{b.deposit}</td>
                        <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                    {latest5.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-slate-500 py-8">لا توجد حجوزات</td>
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
