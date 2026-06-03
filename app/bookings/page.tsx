"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { getBookings, updateStatus } from "@/lib/api";
import { Booking } from "@/lib/types";
import Sidebar from "@/components/layout/sidebar";
import StatusBadge from "@/components/ui/status-badge";
import BookingEditDrawer from "@/components/ui/booking-edit-drawer";
import { toast } from "sonner";
import {
  Search, Loader2, RefreshCw, AlertCircle,
  Pencil, CheckCircle, XCircle, Flag,
  CalendarDays, Users, Clock
} from "lucide-react";

type FilterTab = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const tabs: { key: FilterTab; label: string; icon: string }[] = [
  { key: "all",       label: "الكل",      icon: "📋" },
  { key: "pending",   label: "انتظار",    icon: "⏳" },
  { key: "confirmed", label: "مؤكدة",     icon: "✅" },
  { key: "completed", label: "مكتملة",    icon: "🏁" },
  { key: "cancelled", label: "ملغية",     icon: "❌" },
];

export default function BookingsPage() {
  const { data: bookings = [], error, isLoading, mutate } = useSWR(
    "bookings",
    getBookings,
    { refreshInterval: 30000, revalidateOnFocus: false }
  );

  const [tab, setTab]           = useState<FilterTab>("all");
  const [search, setSearch]     = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);

  const pending   = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const lastUpdated = new Date();

  const tabCount: Record<FilterTab, number> = {
    all: bookings.length, pending, confirmed, completed, cancelled,
  };

  const filtered = useMemo(() => bookings.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (search && !b.name.includes(search) && !b.phone.includes(search)) return false;
    if (dateFrom && b.date < dateFrom) return false;
    if (dateTo   && b.date > dateTo)   return false;
    return true;
  }), [bookings, tab, search, dateFrom, dateTo]);

  const handleUpdate = async (id: string, status: string, label: string) => {
    setUpdatingId(id);
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

      <main className="flex-1 lg:mr-64 p-4 lg:p-6 pt-20 lg:pt-6 min-w-0 overflow-x-hidden">

        {/* ── Page Header ── */}
        <div className="relative mb-8 p-6 rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(0,119,182,0.2) 0%, rgba(0,119,182,0.05) 60%, transparent 100%)", border: "1px solid rgba(0,119,182,0.25)" }}>
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #0077B6, transparent)", transform: "translate(-30%, -30%)" }} />
          <div className="relative flex items-start justify-between">
            <div>
              <h1 className="text-white font-extrabold text-3xl mb-1">الحجوزات</h1>
              <p className="text-slate-400 text-sm">
                إجمالي{" "}
                <span className="text-[#0077B6] font-bold">{bookings.length.toLocaleString("ar-SA")}</span>{" "}
                حجز مسجل
              </p>
            </div>
            <button
              onClick={() => mutate()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all text-white"
              style={{ background: "linear-gradient(135deg, #0077B6, #005f92)" }}
            >
              <RefreshCw size={15} />
              تحديث
            </button>
          </div>

          {/* Mini stats */}
          <div className="relative mt-4 grid grid-cols-4 gap-3">
            {[
              { label: "انتظار",  val: pending,   color: "#F4A400", icon: <Clock size={14}/> },
              { label: "مؤكد",    val: confirmed, color: "#4ade80", icon: <CheckCircle size={14}/> },
              { label: "مكتمل",  val: completed, color: "#60a5fa", icon: <Flag size={14}/> },
              { label: "ملغي",    val: cancelled, color: "#f87171", icon: <XCircle size={14}/> },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{s.val}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            تعذّر الاتصال بالموقع
          </div>
        )}

        {/* ── Filters ── */}
        <div className="glass-card p-4 mb-5 space-y-4">
          {/* Tab buttons */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map((t) => {
              const active = tab === t.key;
              const count = tabCount[t.key];
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "text-white shadow-lg"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}
                  style={active ? { background: "linear-gradient(135deg, #0077B6, #005f92)" } : {}}
                >
                  <span>{t.icon}</span>
                  {t.label}
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Date row */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الجوال..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-[rgba(0,119,182,0.2)] rounded-xl py-2.5 pr-10 pl-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#0077B6] transition"
              />
            </div>
            <div className="flex gap-2 items-center">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="bg-white/5 border border-[rgba(0,119,182,0.2)] rounded-xl py-2.5 px-3 text-slate-300 text-sm focus:outline-none focus:border-[#0077B6] transition" />
              <span className="text-slate-600 text-sm">→</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="bg-white/5 border border-[rgba(0,119,182,0.2)] rounded-xl py-2.5 px-3 text-slate-300 text-sm focus:outline-none focus:border-[#0077B6] transition" />
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-52 gap-3">
              <Loader2 size={36} className="animate-spin text-[#0077B6]" />
              <p className="text-slate-500 text-sm">جارٍ تحميل الحجوزات...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 960 }}>
                <thead>
                  <tr style={{ background: "rgba(0,119,182,0.06)", borderBottom: "1px solid rgba(0,119,182,0.15)" }}>
                    {[
                      "#", "الاسم", "الجوال", "الباقة",
                      "تاريخ الرحلة", "الأشخاص",
                      "المبلغ", "الدفع", "وقت الحجز",
                      "الحالة", "إجراءات",
                    ].map((h) => (
                      <th key={h} className="text-right text-slate-400 text-xs font-semibold py-4 px-4 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr
                      key={b.id}
                      className="booking-row border-b transition-all"
                      style={{ borderColor: "rgba(0,119,182,0.08)" }}
                    >
                      <td className="py-4 px-4">
                        <span className="text-slate-600 text-xs font-mono">{i + 1}</span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-white font-bold text-sm whitespace-nowrap">{b.name}</p>
                        <p className="text-slate-600 text-xs font-mono mt-0.5">{b.id}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-300 text-sm whitespace-nowrap" dir="ltr">
                        {b.phone}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-300 text-sm" style={{ maxWidth: 160, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {b.package.split("|")[0].trim()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-300 text-sm whitespace-nowrap flex items-center gap-1">
                          <CalendarDays size={12} className="text-[#0077B6]" />
                          {b.date}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1 text-slate-300 text-sm">
                          <Users size={12} className="text-[#0077B6]" />
                          {b.persons}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-sm whitespace-nowrap" style={{ color: "#F4A400" }}>
                          {b.deposit}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs whitespace-nowrap" style={{ maxWidth: 120 }}>
                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {b.pay_type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap">
                        {b.time?.slice(0, 16)}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="py-4 px-4">
                        {updatingId === b.id ? (
                          <Loader2 size={18} className="animate-spin text-[#0077B6]" />
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Edit button — always visible */}
                            <button
                              className="action-btn action-btn-edit"
                              onClick={() => setEditBooking(b)}
                            >
                              <Pencil size={12} />
                              تعديل
                            </button>

                            {b.status === "pending" && (
                              <button
                                className="action-btn action-btn-confirm"
                                onClick={() => handleUpdate(b.id, "confirmed", "مؤكد")}
                              >
                                <CheckCircle size={12} />
                                تأكيد
                              </button>
                            )}

                            {b.status === "confirmed" && (
                              <>
                                <button
                                  className="action-btn action-btn-complete"
                                  onClick={() => handleUpdate(b.id, "completed", "مكتمل")}
                                >
                                  <Flag size={12} />
                                  إنهاء الرحلة
                                </button>
                                <button
                                  className="action-btn action-btn-cancel"
                                  onClick={() => handleUpdate(b.id, "cancelled", "ملغي")}
                                >
                                  <XCircle size={12} />
                                  إلغاء
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={11}>
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(0,119,182,0.1)" }}>
                            <Search size={28} className="text-[#0077B6]" />
                          </div>
                          <p className="text-slate-400 font-medium">لا توجد حجوزات مطابقة</p>
                          <p className="text-slate-600 text-sm">جرّب تغيير فلتر البحث</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-[rgba(0,119,182,0.1)] flex items-center justify-between">
              <p className="text-slate-500 text-xs">
                عرض <span className="text-slate-300 font-medium">{filtered.length}</span> من{" "}
                <span className="text-slate-300 font-medium">{bookings.length}</span> حجز
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0077B6]" />
                <span className="text-slate-500 text-xs">يتجدد كل 30 ثانية</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Drawer */}
      {editBooking && (
        <BookingEditDrawer
          booking={editBooking}
          onClose={() => setEditBooking(null)}
          onSaved={() => mutate()}
        />
      )}
    </div>
  );
}
