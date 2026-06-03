"use client";
import { useState, useEffect } from "react";
import { Booking } from "@/lib/types";
import { updateBooking, updateStatus } from "@/lib/api";
import { toast } from "sonner";
import {
  X, User, Phone, Calendar, Users, FileText, Package,
  CreditCard, Save, Clock, Hash, Loader2
} from "lucide-react";

interface Props {
  booking: Booking | null;
  onClose: () => void;
  onSaved: () => void;
}

const statusOptions = [
  { value: "pending",   label: "⏳ انتظار",  color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  { value: "confirmed", label: "✅ مؤكد",    color: "text-green-400 bg-green-400/10 border-green-400/30" },
  { value: "completed", label: "🏁 مكتمل",  color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  { value: "cancelled", label: "❌ ملغي",   color: "text-red-400 bg-red-400/10 border-red-400/30" },
];

export default function BookingEditDrawer({ booking, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Partial<Booking>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (booking) setForm({ ...booking });
  }, [booking]);

  const set = (k: keyof Booking, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!booking) return;
    setSaving(true);
    try {
      const changed: Partial<Pick<Booking, 'name' | 'phone' | 'date' | 'persons' | 'notes' | 'status'>> = {};
      if (form.name !== booking.name) changed.name = form.name;
      if (form.phone !== booking.phone) changed.phone = form.phone;
      if (form.date !== booking.date) changed.date = form.date;
      if (form.persons !== booking.persons) changed.persons = form.persons;
      if (form.notes !== booking.notes) changed.notes = form.notes;
      if (form.status !== booking.status) changed.status = form.status;

      if (Object.keys(changed).length === 0) {
        toast.info("لم يتم تغيير أي بيانات");
        setSaving(false);
        return;
      }

      if (changed.status && Object.keys(changed).length === 1) {
        await updateStatus(booking.id, changed.status);
      } else {
        await updateBooking(booking.id, changed);
      }

      toast.success("✅ تم حفظ التعديلات بنجاح");
      onSaved();
      onClose();
    } catch {
      toast.error("فشل حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  if (!booking) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-full max-w-lg z-50 flex flex-col"
        style={{ background: "linear-gradient(180deg, #0c1e30 0%, #0a1825 100%)", borderRight: "1px solid rgba(0,119,182,0.3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(0,119,182,0.2)]"
          style={{ background: "linear-gradient(135deg, rgba(0,119,182,0.15) 0%, rgba(0,119,182,0.05) 100%)" }}
        >
          <div>
            <h2 className="text-white font-bold text-xl">تعديل الحجز</h2>
            <p className="text-slate-400 text-sm mt-0.5 font-mono">{booking.id}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Status selector */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-2 block">الحالة</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => set("status", s.value)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                    form.status === s.value
                      ? s.color + " ring-2 ring-offset-1 ring-offset-[#0c1e30]"
                      : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[rgba(0,119,182,0.1)]" />

          {/* Name */}
          <Field icon={<User size={15} />} label="اسم العميل">
            <input
              value={form.name || ""}
              onChange={(e) => set("name", e.target.value)}
              className="drawer-input"
              placeholder="اسم العميل"
            />
          </Field>

          {/* Phone */}
          <Field icon={<Phone size={15} />} label="رقم الجوال">
            <input
              value={form.phone || ""}
              onChange={(e) => set("phone", e.target.value)}
              className="drawer-input"
              dir="ltr"
              placeholder="05xxxxxxxx"
            />
          </Field>

          {/* Date */}
          <Field icon={<Calendar size={15} />} label="تاريخ الرحلة">
            <input
              type="date"
              value={form.date || ""}
              onChange={(e) => set("date", e.target.value)}
              className="drawer-input"
            />
          </Field>

          {/* Persons */}
          <Field icon={<Users size={15} />} label="عدد الأشخاص">
            <input
              type="number"
              min="1"
              max="50"
              value={form.persons || ""}
              onChange={(e) => set("persons", e.target.value)}
              className="drawer-input"
            />
          </Field>

          {/* Notes */}
          <Field icon={<FileText size={15} />} label="ملاحظات">
            <textarea
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              className="drawer-input resize-none"
              placeholder="لا توجد ملاحظات"
            />
          </Field>

          {/* Divider */}
          <div className="border-t border-[rgba(0,119,182,0.1)]" />

          {/* Read-only info */}
          <div className="space-y-3">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">معلومات الحجز</p>
            <ReadOnly icon={<Package size={14} />} label="الباقة" value={booking.package.split("|")[0].trim()} />
            <ReadOnly icon={<CreditCard size={14} />} label="المبلغ الكلي" value={booking.total} />
            <ReadOnly icon={<CreditCard size={14} />} label="المدفوع" value={booking.deposit} />
            <ReadOnly icon={<Hash size={14} />} label="طريقة الدفع" value={booking.pay_type} />
            <ReadOnly icon={<Clock size={14} />} label="وقت الحجز" value={booking.time?.slice(0, 16)} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[rgba(0,119,182,0.2)] flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #0077B6, #005f92)" }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition font-medium"
          >
            إلغاء
          </button>
        </div>
      </div>
    </>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
        <span className="text-[#0077B6]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function ReadOnly({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/3 border border-white/5">
      <div className="flex items-center gap-2 text-slate-500 text-xs">
        <span className="text-slate-600">{icon}</span>
        {label}
      </div>
      <span className="text-slate-300 text-sm font-medium">{value}</span>
    </div>
  );
}
