"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { getBookings } from "@/lib/api";
import { parseAmount, formatCurrency } from "@/lib/utils";
import Sidebar from "@/components/layout/sidebar";
import ClientPanel from "@/components/ui/client-panel";
import { Loader2, Search, Users } from "lucide-react";

export default function ClientsPage() {
  const { data: bookings = [], isLoading } = useSWR("bookings", getBookings, {
    revalidateOnFocus: false,
  });

  const [search, setSearch] = useState("");
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  const clients = useMemo(() => {
    const map: Record<string, typeof bookings> = {};
    bookings.forEach((b) => {
      if (!map[b.phone]) map[b.phone] = [];
      map[b.phone].push(b);
    });
    return Object.entries(map).map(([phone, bks]) => {
      const totalSpent = bks
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + parseAmount(b.deposit), 0);
      const lastTrip = [...bks].sort((a, b) => b.date.localeCompare(a.date))[0];
      const statusCounts: Record<string, number> = {};
      bks.forEach((b) => { statusCounts[b.status] = (statusCounts[b.status] || 0) + 1; });
      const topStatus = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      return {
        name: bks[0].name,
        phone,
        trips: bks.length,
        totalSpent,
        lastTrip: lastTrip?.date || "",
        topStatus,
        bookings: bks,
      };
    });
  }, [bookings]);

  const filtered = useMemo(() => {
    if (!search) return clients;
    return clients.filter(
      (c) => c.name.includes(search) || c.phone.includes(search)
    );
  }, [clients, search]);

  const selectedClient = selectedPhone
    ? clients.find((c) => c.phone === selectedPhone)
    : null;

  const pending = bookings.filter((b) => b.status === "pending").length;

  const statusLabels: Record<string, string> = {
    pending: "انتظار",
    confirmed: "مؤكد",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar pendingCount={pending} lastUpdated={new Date()} />
      <main className="flex-1 lg:mr-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-white font-bold text-2xl lg:text-3xl">العملاء</h1>
          <p className="text-slate-400 mt-1">{clients.length.toLocaleString("ar-SA")} عميل فريد</p>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الجوال..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-[rgba(0,119,182,0.2)] rounded-xl py-2 pr-9 pl-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#0077B6] transition"
            />
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={32} className="animate-spin text-[#0077B6]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-white/5 border-b border-[rgba(0,119,182,0.2)]">
                    {["الاسم", "الجوال", "عدد الرحلات", "إجمالي المدفوع", "آخر رحلة", "الحالة الأكثر"].map((h) => (
                      <th key={h} className="text-right text-slate-400 text-xs font-medium py-4 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.phone}
                      onClick={() => setSelectedPhone(c.phone)}
                      className="border-b border-[rgba(0,119,182,0.08)] hover:bg-white/5 transition cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0077B6]/20 border border-[#0077B6]/30 flex items-center justify-center text-[#0077B6] font-bold text-sm flex-shrink-0">
                            {c.name[0]}
                          </div>
                          <span className="text-white font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 text-sm" dir="ltr">{c.phone}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-[#0077B6]" />
                          <span className="text-white font-medium">{c.trips.toLocaleString("ar-SA")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#F4A400] font-medium">{formatCurrency(c.totalSpent)}</td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{c.lastTrip}</td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{statusLabels[c.topStatus] || c.topStatus}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-slate-500 py-12">لا يوجد عملاء</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {selectedClient && (
        <ClientPanel
          bookings={selectedClient.bookings}
          onClose={() => setSelectedPhone(null)}
        />
      )}
    </div>
  );
}
