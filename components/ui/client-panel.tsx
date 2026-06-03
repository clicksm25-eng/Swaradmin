"use client";
import { Booking } from "@/lib/types";
import { parseAmount, parsePackageName, formatDate, formatCurrency } from "@/lib/utils";
import StatusBadge from "./status-badge";
import { X } from "lucide-react";

interface Props {
  bookings: Booking[];
  onClose: () => void;
}

export default function ClientPanel({ bookings, onClose }: Props) {
  if (bookings.length === 0) return null;
  const client = bookings[0];
  const totalSpent = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + parseAmount(b.deposit), 0);

  const packageCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    const p = parsePackageName(b.package);
    packageCounts[p] = (packageCounts[p] || 0) + 1;
  });
  const favoritePackage = Object.entries(packageCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-[#0F2236] border-r border-[rgba(0,119,182,0.2)] overflow-y-auto">
        <div className="p-6 border-b border-[rgba(0,119,182,0.2)] flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl">{client.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{client.phone}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-[#0077B6]">{bookings.length}</p>
            <p className="text-slate-400 text-sm mt-1">رحلة</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xl font-bold text-[#F4A400]">{formatCurrency(totalSpent)}</p>
            <p className="text-slate-400 text-sm mt-1">إجمالي المدفوع</p>
          </div>
        </div>

        {favoritePackage && (
          <div className="px-6 pb-4">
            <div className="glass-card p-4">
              <p className="text-slate-400 text-xs mb-1">الباقة المفضلة</p>
              <p className="text-white font-medium">{favoritePackage}</p>
            </div>
          </div>
        )}

        <div className="px-6 pb-6">
          <h3 className="text-white font-bold mb-3">سجل الرحلات</h3>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{parsePackageName(b.package)}</p>
                    <p className="text-slate-400 text-xs mt-1">{formatDate(b.date)} · {b.persons} أشخاص</p>
                    <p className="text-[#F4A400] text-xs mt-1">{b.deposit}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
