"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { getBookings, updateStatus } from "@/lib/api";
import { Booking } from "@/lib/types";
import Sidebar from "@/components/layout/sidebar";
import StatusBadge from "@/components/ui/status-badge";
import { toast } from "sonner";
import { Search, Loader2, RefreshCw, AlertCircle } from "lucide-react";

type FilterTab = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const tabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "⏳ انتظار" },
  { key: "confirmed", label: "✅ مؤكدة" },
  { key: "completed", label: "🏁 مكتملة" },
  { key: "cancelled", label: "❌ ملغية" },
];

export default function BookingsPage() {
  const { data: bookings = [], error, isLoading, mutate } = useSWR(
    "bookings",
    getBookings,
    { refreshInterval: 30000, revalidateOnFocus: false }
  );

  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const lastUpdated = new Date();

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (tab !== "all" && b.status !== tab) return false;
      if (search && !b.name.includes(search) && !b.phone.includes(search)) return false;
      if (dateFrom && b.date < dateFrom) return false;
      if (dateTo && b.date > dateTo) return false;
      return true;
    });
  }, [bookings, tab, search, dateFrom, dateTo]);

  const handleUpdate = async (id: string, status: string, label: string) => {
    setUpdatingId(id);
    // Optimistic update
    mutate(
      bookings.map((b) => (b.id === id ? { ...b, status: status as Booking["status"] } : b)),
      false
    );
    try {
      await updateStatus(id, status);
      toast.success(`تم تحديث الحالة إلى: ${label}`);
    } catch {
      toast.error("فشل تحديث الحالة");
    } finally {
      setUpdatingId(null);
      mutate();
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar pendingCount={pending} lastUpdated={lastUpdated} />
      <main className="flex-1 lg:mr-64 p-4 lg:p-8 pt-20 lg:pt-8 min-w-0 overflow-x-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-bold text-2xl lg:text-3xl">الحجوزات</h1>
            <p className="text-slate-400 mt-1">{bookings.length.toLocaleString("ar-SA")} حجز إجمالاً</p>
          </div>
          <button
            onClick={() => mutate()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(0,119,182,0.15)] text-[#0077B6] hover:bg-[rgba(0,119,182,0.25)] transition text-sm"
          >
            <RefreshCw size={16} />
            تحديث
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            تعذّر الاتصال بالموقع
          </div>
        )}

        {/* Filters */}
        <div className="glass-card p-4 mb-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  tab === t.key
                    ? "bg-[#0077B6] text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {t.label}
                {t.key === "pending" && pending > 0 && (
                  <span className="mr-2 bg-[#F4A400] text-black text-xs rounded-full px-1.5 py-0.5">
                    {pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search & Date */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الجوال..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-[rgba(0,119,182,0.2)] rounded-xl py-2 pr-9 pl-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#0077B6] transition"
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-white/5 border border-[rgba(0,119,182,0.2)] rounded-xl py-2 px-3 text-slate-300 text-sm focus:outline-none focus:border-[#0077B6] transition"
              />
              <span className="text-slate-500 text-sm">إلى</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-white/5 border border-[rgba(0,119,182,0.2)] rounded-xl py-2 px-3 text-slate-300 text-sm focus:outline-none focus:border-[#0077B6] transition"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={32} className="animate-spin text-[#0077B6]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-white/5 border-b border-[rgba(0,119,182,0.2)]">
                    {["#", "الاسم", "الجوال", "الباقة", "تاريخ الرحلة", "الأشخاص", "المبلغ", "الدفع", "وقت الحجز", "الحالة", "إجراءات"].map((h) => (
                      <th key={h} className="text-right text-slate-400 text-xs font-medium py-4 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id} className="border-b border-[rgba(0,119,182,0.08)] hover:bg-white/5 transition">
                      <td className="py-4 px-4 text-slate-500 text-sm">{i + 1}</td>
                      <td className="py-4 px-4 text-white font-medium whitespace-nowrap">{b.name}</td>
                      <td className="py-4 px-4 text-slate-300 text-sm whitespace-nowrap" dir="ltr">{b.phone}</td>
                      <td className="py-4 px-4 text-slate-300 text-sm max-w-[180px] truncate">{b.package.split("|")[0].trim()}</td>
                      <td className="py-4 px-4 text-slate-300 text-sm whitespace-nowrap">{b.date}</td>
                      <td className="py-4 px-4 text-slate-300 text-sm text-center">{b.persons}</td>
                      <td className="py-4 px-4 text-[#F4A400] text-sm whitespace-nowrap">{b.deposit}</td>
                      <td className="py-4 px-4 text-slate-400 text-xs whitespace-nowrap max-w-[120px] truncate">{b.pay_type}</td>
                      <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap">{b.time?.slice(0, 16)}</td>
                      <td className="py-4 px-4"><StatusBadge status={b.status} /></td>
                      <td className="py-4 px-4">
                        {updatingId === b.id ? (
                          <Loader2 size={16} className="animate-spin text-[#0077B6]" />
                        ) : b.status === "pending" ? (
                          <button
                            onClick={() => handleUpdate(b.id, "confirmed", "مؤكد")}
                            className="px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-xs hover:bg-green-600/30 transition whitespace-nowrap"
                          >
                            ✅ تأكيد
                          </button>
                        ) : b.status === "confirmed" ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleUpdate(b.id, "completed", "مكتمل")}
                              className="px-2 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-xs hover:bg-blue-600/30 transition whitespace-nowrap"
                            >
                              🏁 إنهاء
                            </button>
                            <button
                              onClick={() => handleUpdate(b.id, "cancelled", "ملغي")}
                              className="px-2 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-xs hover:bg-red-600/30 transition whitespace-nowrap"
                            >
                              ❌
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={11} className="text-center text-slate-500 py-12">لا توجد حجوزات مطابقة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
