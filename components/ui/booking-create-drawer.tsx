"use client";
import { useState } from "react";
import { createBooking, NewBookingInput } from "@/lib/api";
import { toast } from "sonner";
import {
  X, User, Phone, Calendar, Users, FileText, Package,
  CreditCard, Save, Loader2, Plus, Wallet
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const PACKAGES = [
  "🍸 رحلة السباحة والاستجمام",
  "🎣 رحلة صيد الأسماك | 6 ساعات",
  "🎣 رحلة صيد الأسماك | 8 ساعات",
  "🎣 رحلة صيد الأسماك | 10 ساعات",
  "🕐 رحلة بالساعة | نصف ساعة",
  "🕐 رحلة بالساعة | ساعة كاملة",
  "🕐 رحلة بالساعة | ساعتان",
  "🎉 حفلة بحرية | برونز",
  "🎉 حفلة بحرية | فضية",
  "🎉 حفلة بحرية | ذهبية",
  "🐬 رحلة مشاهدة الدلافين",
  "👑 رحلة الصيد الملكية VIP",
];

const PAY_TYPES = [
  "💯 المبلغ كاملاً",
  "💰 دفع مقدم (50%)",
  "💵 الدفع عند الوصول",
];

const empty: NewBookingInput = {
  name: "", phone: "", date: "", persons: "1",
  package: PACKAGES[0], total: "", deposit: "",
  pay_type: PAY_TYPES[0], notes: "", status: "pending",
};

export default function BookingCreateDrawer({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState<NewBookingInput>(empty);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof NewBookingInput>(k: K, v: NewBookingInput[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim())  return toast.error("الرجاء إدخال اسم العميل");
    if (!form.phone.trim()) return toast.error("الرجاء إدخال رقم الجوال");
    if (!form.date)         return toast.error("الرجاء اختيار تاريخ الرحلة");
    if (!form.total.trim()) return toast.error("الرجاء إدخال المبلغ الكلي");

    setSaving(true);
    try {
      const payload: NewBookingInput = {
        ...form,
        total:   form.total.includes("ريال")   ? form.total   : `${form.total} ريال`,
        deposit: form.deposit.trim()
          ? (form.deposit.includes("ريال") ? form.deposit : `${form.deposit} ريال`)
          : (form.total.includes("ريال") ? form.total : `${form.total} ريال`),
      };
      await createBooking(payload);
      toast.success("✅ تم إنشاء الحجز بنجاح");
      setForm(empty);
      onCreated();
      onClose();
    } catch {
      toast.error("فشل إنشاء الحجز");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

      <div
        className="fixed top-0 left-0 h-full w-full max-w-lg z-50 flex flex-col"
        style={{
          background: "linear-gradient(180deg, #0c1e30 0%, #0a1825 100%)",
          borderRight: "1px solid rgba(0,119,182,0.3)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b border-[rgba(0,119,182,0.2)]"
          style={{ background: "linear-gradient(135deg, rgba(244,164,0,0.15) 0%, rgba(0,119,182,0.05) 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #F4A400, #c98800)" }}
            >
              <Plus size={20} className="text-black" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">حجز جديد</h2>
              <p className="text-slate-400 text-xs mt-0.5">إضافة حجز يدوي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <Field icon={<User size={15} />} label="اسم العميل *">
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              className="drawer-input" placeholder="مثال: أحمد محمد" />
          </Field>

          <Field icon={<Phone size={15} />} label="رقم الجوال *">
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
              className="drawer-input" dir="ltr" placeholder="05xxxxxxxx" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field icon={<Calendar size={15} />} label="تاريخ الرحلة *">
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
                className="drawer-input" />
            </Field>
            <Field icon={<Users size={15} />} label="عدد الأشخاص">
              <input type="number" min="1" max="50" value={form.persons}
                onChange={(e) => set("persons", e.target.value)} className="drawer-input" />
            </Field>
          </div>

          <Field icon={<Package size={15} />} label="الباقة">
            <select value={form.package} onChange={(e) => set("package", e.target.value)}
              className="drawer-input">
              {PACKAGES.map((p) => (
                <option key={p} value={p} style={{ background: "#0c1e30" }}>{p}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field icon={<CreditCard size={15} />} label="المبلغ الكلي *">
              <input value={form.total} onChange={(e) => set("total", e.target.value)}
                className="drawer-input" placeholder="مثال: 1400" />
            </Field>
            <Field icon={<Wallet size={15} />} label="المدفوع">
              <input value={form.deposit} onChange={(e) => set("deposit", e.target.value)}
                className="drawer-input" placeholder="مثال: 700" />
            </Field>
          </div>

          <Field icon={<CreditCard size={15} />} label="طريقة الدفع">
            <select value={form.pay_type} onChange={(e) => set("pay_type", e.target.value)}
              className="drawer-input">
              {PAY_TYPES.map((p) => (
                <option key={p} value={p} style={{ background: "#0c1e30" }}>{p}</option>
              ))}
            </select>
          </Field>

          <div>
            <label className="text-slate-400 text-xs font-medium mb-2 block">الحالة الابتدائية</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "pending",   l: "⏳ انتظار",  c: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
                { v: "confirmed", l: "✅ مؤكد",    c: "text-green-400 bg-green-400/10 border-green-400/30" },
              ].map((s) => (
                <button key={s.v} onClick={() => set("status", s.v)}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form.status === s.v
                      ? s.c + " ring-1 ring-current"
                      : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {s.l}
                </button>
              ))}
            </div>
          </div>

          <Field icon={<FileText size={15} />} label="ملاحظات">
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
              rows={3} className="drawer-input resize-none" placeholder="ملاحظات إضافية..." />
          </Field>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[rgba(0,119,182,0.2)] flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-black transition-all"
            style={{ background: "linear-gradient(135deg, #F4A400, #c98800)" }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "جاري الحفظ..." : "إضافة الحجز"}
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition font-medium">
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
        <span className="text-[#F4A400]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
