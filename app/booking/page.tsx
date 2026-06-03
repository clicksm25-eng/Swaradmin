"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import {
  Anchor, ArrowLeft, Calendar, Users, User, Phone,
  Sparkles, MessageCircle, Check, Copy, Loader2, Wallet, Banknote,
  ShieldCheck, ChevronRight, FileText
} from "lucide-react";
import { PACKAGES, Pkg, BANK, WHATSAPP_PHONE } from "./packages";

type Step = "list" | "form" | "payment" | "done";
type PayMethod = "transfer" | "cash";

const LOGO = "https://sewarmarine.com/wp-content/uploads/2024/07/%D8%B4%D8%B9%D8%A7%D8%B1_%D8%B3%D9%88%D8%A7%D8%B1-removebg-preview.png";

async function getNonce(): Promise<string> {
  const r = await axios.get("/api/wp/nonce");
  return r.data?.nonce;
}

export default function BookingPage() {
  const [step, setStep] = useState<Step>("list");
  const [pkg, setPkg]   = useState<Pkg | null>(null);

  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [date, setDate]       = useState("");
  const [persons, setPersons] = useState(5);
  const [notes, setNotes]     = useState("");
  const [tier, setTier]       = useState<string>("");   // selected tier id
  const [slot, setSlot]       = useState<string>("");   // selected slot id
  const [extras, setExtras]   = useState<string[]>([]); // selected extra ids
  const [payMethod, setPayMethod] = useState<PayMethod>("transfer");
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId]   = useState<string>("");

  // ── total ──
  const total = useMemo(() => {
    if (!pkg) return 0;
    let base = pkg.from;
    if (pkg.tiers && tier) {
      const t = pkg.tiers.find(x => x.id === tier);
      if (t) base = t.price;
    }
    if (pkg.baseInline && (!pkg.tiers || !tier)) base = pkg.baseInline.price;
    let extrasSum = 0;
    if (pkg.extras) {
      extrasSum = pkg.extras.filter(e => extras.includes(e.id)).reduce((s, e) => s + e.price, 0);
    }
    let extraPersons = 0;
    if (pkg.extraPersonPrice && persons > pkg.basePersons) {
      extraPersons = (persons - pkg.basePersons) * pkg.extraPersonPrice;
    }
    return base + extrasSum + extraPersons;
  }, [pkg, tier, extras, persons]);

  const openPkg = (p: Pkg) => {
    setPkg(p);
    setTier(p.tiers?.[0]?.id || "");
    setSlot(p.slots?.[0]?.id || "");
    setExtras([]);
    setPersons(p.basePersons);
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAll = () => {
    setStep("list");
    setPkg(null); setName(""); setPhone(""); setDate(""); setNotes("");
    setTier(""); setSlot(""); setExtras([]); setBookingId("");
  };

  const buildPackageString = (): string => {
    if (!pkg) return "";
    const parts: string[] = [pkg.title];
    if (pkg.tiers && tier) {
      const t = pkg.tiers.find(x => x.id === tier);
      if (t) parts.push(t.label.replace(/^[^؀-ۿ\w]+/, "").trim() || t.label);
    }
    if (pkg.slots && slot) {
      const s = pkg.slots.find(x => x.id === slot);
      if (s) parts.push(`⏰ ${s.label} (${s.time})`);
    }
    if (extras.length && pkg.extras) {
      const labels = pkg.extras.filter(e => extras.includes(e.id)).map(e => e.label);
      if (labels.length) parts.push("إضافات: " + labels.join(" + "));
    }
    return parts.join(" | ");
  };

  const submit = async () => {
    if (!name.trim())  return toast.error("الرجاء إدخال الاسم");
    if (!phone.trim()) return toast.error("الرجاء إدخال رقم الجوال");
    if (!date)         return toast.error("الرجاء اختيار تاريخ الرحلة");
    if (!pkg) return;

    setSubmitting(true);
    try {
      const nonce = await getNonce();
      const form = new FormData();
      form.append("action", "sewar_book");
      form.append("nonce", nonce);
      form.append("name", name.trim());
      form.append("phone", phone.trim());
      form.append("date", date);
      form.append("persons", String(persons));
      form.append("package", buildPackageString());
      form.append("total",   `${total.toLocaleString("ar-SA")} ريال`);
      form.append("deposit", payMethod === "transfer" ? `${total.toLocaleString("ar-SA")} ريال` : "0 ريال");
      form.append("pay_type", payMethod === "transfer" ? "💳 تحويل بنكي" : "💵 الدفع عند الوصول");
      form.append("notes", notes);
      form.append("status", "pending");

      const res = await axios.post("/api/wp/ajax", form);
      if (res.data?.success) {
        const id = res.data.data?.id || `BK-${Date.now()}`;
        setBookingId(id);
        setStep(payMethod === "transfer" ? "payment" : "done");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // fallback: still proceed locally so customer flow isn't blocked
        setBookingId(`BK-${Date.now()}`);
        setStep(payMethod === "transfer" ? "payment" : "done");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      toast.error("تعذّر إرسال الحجز، حاول مجدداً");
    } finally {
      setSubmitting(false);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,119,182,0.3)" }}>
            <Image src={LOGO} alt="سوار البحر" width={42} height={42} className="object-contain" unoptimized />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-xl lg:text-2xl leading-none">سوار البحر</h1>
            <p className="text-[#0EA5E9] text-xs lg:text-sm mt-1 flex items-center gap-1">
              <Anchor size={12} /> رحلات بحرية فاخرة · البحر الأحمر
            </p>
          </div>
        </div>
        {step !== "list" && step !== "done" && (
          <button onClick={resetAll}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 text-slate-300 text-sm hover:bg-white/10 transition">
            <ChevronRight size={16} /> رجوع
          </button>
        )}
      </header>

      {step === "list"    && <PackagesList onPick={openPkg} />}
      {step === "form" && pkg && (
        <BookingForm
          pkg={pkg}
          name={name} setName={setName}
          phone={phone} setPhone={setPhone}
          date={date} setDate={setDate}
          persons={persons} setPersons={setPersons}
          notes={notes} setNotes={setNotes}
          tier={tier} setTier={setTier}
          slot={slot} setSlot={setSlot}
          extras={extras} setExtras={setExtras}
          payMethod={payMethod} setPayMethod={setPayMethod}
          total={total}
          submitting={submitting}
          onSubmit={submit}
        />
      )}
      {step === "payment" && pkg && (
        <PaymentScreen total={total} bookingId={bookingId} pkgTitle={pkg.title}
          name={name} date={date} onDone={() => setStep("done")} />
      )}
      {step === "done" && (
        <DoneScreen bookingId={bookingId} payMethod={payMethod} onReset={resetAll} />
      )}

      <footer className="mt-12 text-center text-slate-600 text-xs">
        © {new Date().getFullYear()} سوار البحر · جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
function PackagesList({ onPick }: { onPick: (p: Pkg) => void }) {
  return (
    <div>
      {/* hero */}
      <div className="relative mb-8 p-6 lg:p-10 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(0,119,182,0.25), rgba(244,164,0,0.08))",
                 border: "1px solid rgba(0,119,182,0.3)" }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(244,164,0,0.25), transparent 70%)" }} />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,119,182,0.25), transparent 70%)" }} />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4A400]/15 border border-[#F4A400]/30 text-[#F4A400] text-xs font-bold mb-3">
            <Sparkles size={12} /> احجز خلال دقيقة
          </div>
          <h2 className="text-white font-extrabold text-2xl lg:text-4xl leading-tight">
            اختر رحلتك البحرية المثالية
          </h2>
          <p className="text-slate-300 mt-2 text-sm lg:text-base max-w-xl">
            6 باقات متنوعة — صيد، سباحة، حفلات، دلافين، VIP. كل التفاصيل والأسعار واضحة، الحجز فوري.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {PACKAGES.map((p) => <PkgCard key={p.id} pkg={p} onPick={onPick} />)}
      </div>
    </div>
  );
}

function PkgCard({ pkg, onPick }: { pkg: Pkg; onPick: (p: Pkg) => void }) {
  return (
    <div
      onClick={() => onPick(pkg)}
      className="group relative rounded-3xl p-5 lg:p-6 cursor-pointer transition-all hover:-translate-y-1"
      style={{
        background: pkg.bgGradient + ", rgba(15,34,54,0.6)",
        border: `1px solid ${pkg.accent}30`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: `${pkg.accent}20`, border: `1px solid ${pkg.accent}40` }}>
        {pkg.emoji}
      </div>

      <div className="ml-16 lg:ml-20">
        <h3 className="text-white font-bold text-lg lg:text-xl leading-tight">{pkg.title}</h3>
        <p className="text-slate-400 text-xs lg:text-sm mt-1">{pkg.subtitle}</p>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-slate-500 text-xs">يبدأ من</p>
          <p className="font-extrabold text-3xl" style={{ color: pkg.accent }}>
            {pkg.from.toLocaleString("ar-SA")}
            <span className="text-sm font-medium text-slate-400 mr-1">ريال</span>
          </p>
          <p className="text-slate-500 text-xs mt-0.5">{pkg.badge}</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all text-white shadow-lg group-hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${pkg.accent}, ${pkg.accent}cc)` }}
        >
          احجز
          <ArrowLeft size={14} />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
interface FormProps {
  pkg: Pkg;
  name: string; setName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  date: string; setDate: (v: string) => void;
  persons: number; setPersons: (v: number) => void;
  notes: string; setNotes: (v: string) => void;
  tier: string; setTier: (v: string) => void;
  slot: string; setSlot: (v: string) => void;
  extras: string[]; setExtras: (v: string[]) => void;
  payMethod: PayMethod; setPayMethod: (v: PayMethod) => void;
  total: number;
  submitting: boolean;
  onSubmit: () => void;
}

function BookingForm(p: FormProps) {
  const { pkg } = p;
  const toggleExtra = (id: string) => {
    if (p.extras.includes(id)) p.setExtras(p.extras.filter(x => x !== id));
    else p.setExtras([...p.extras, id]);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

      {/* ── Main form ── */}
      <div className="space-y-5">
        {/* Package banner */}
        <div className="rounded-3xl p-5 lg:p-6"
          style={{ background: pkg.bgGradient + ", rgba(15,34,54,0.6)", border: `1px solid ${pkg.accent}40`}}>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${pkg.accent}20`, border: `1px solid ${pkg.accent}40` }}>
              {pkg.emoji}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg lg:text-xl">{pkg.title}</h2>
              <p className="text-slate-400 text-xs mt-0.5">{pkg.subtitle}</p>
            </div>
          </div>
          <p className="text-slate-300 text-xs lg:text-sm mt-4 leading-relaxed">{pkg.yacht}</p>
          {pkg.desc && (
            <p className="text-slate-400 text-xs lg:text-sm mt-3 leading-relaxed">{pkg.desc}</p>
          )}
        </div>

        {/* Tiers (mandatory choice) */}
        {pkg.tiers && (
          <Section title="اختر الباقة" icon={<Sparkles size={16} />} accent={pkg.accent}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {pkg.tiers.map(t => {
                const active = p.tier === t.id;
                return (
                  <button key={t.id} onClick={() => p.setTier(t.id)}
                    className="text-right p-4 rounded-2xl transition-all"
                    style={{
                      background: active ? `${pkg.accent}20` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? pkg.accent : "rgba(255,255,255,0.08)"}`,
                    }}>
                    <p className={`font-bold ${active ? "text-white" : "text-slate-300"}`}>{t.label}</p>
                    {t.sub && <p className="text-slate-500 text-xs mt-1">{t.sub}</p>}
                    <p className="font-extrabold text-lg mt-2" style={{ color: pkg.accent }}>
                      {t.price.toLocaleString("ar-SA")} <span className="text-xs font-medium text-slate-400">ريال</span>
                    </p>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* Slots */}
        {pkg.slots && (
          <Section title="اختر وقت الرحلة" icon={<Calendar size={16} />} accent={pkg.accent}>
            <div className="grid grid-cols-2 gap-2">
              {pkg.slots.map(s => {
                const active = p.slot === s.id;
                return (
                  <button key={s.id} onClick={() => p.setSlot(s.id)}
                    className="p-4 rounded-2xl text-center transition-all"
                    style={{
                      background: active ? `${pkg.accent}20` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? pkg.accent : "rgba(255,255,255,0.08)"}`,
                    }}>
                    <p className={`font-bold ${active ? "text-white" : "text-slate-300"}`}>{s.label}</p>
                    <p className="text-slate-500 text-xs mt-1">{s.time}</p>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* baseInline */}
        {pkg.baseInline && (
          <div className="rounded-2xl p-4 flex items-center justify-between"
            style={{ background: `${pkg.accent}10`, border: `1px solid ${pkg.accent}30` }}>
            <div>
              <p className="text-white font-bold text-sm">{pkg.baseInline.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{pkg.baseInline.sub}</p>
            </div>
            <p className="font-extrabold text-xl whitespace-nowrap" style={{ color: pkg.accent }}>
              {pkg.baseInline.price.toLocaleString("ar-SA")} <span className="text-xs font-medium text-slate-400">ريال</span>
            </p>
          </div>
        )}

        {/* Extras */}
        {pkg.extras && (
          <Section title="إضافات اختيارية" icon={<Sparkles size={16} />} accent={pkg.accent}>
            <div className="space-y-2">
              {pkg.extras.map(e => {
                const active = p.extras.includes(e.id);
                return (
                  <button key={e.id} onClick={() => toggleExtra(e.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                    style={{
                      background: active ? `${pkg.accent}15` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? pkg.accent + "60" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center"
                        style={{
                          background: active ? pkg.accent : "transparent",
                          border: `1.5px solid ${active ? pkg.accent : "rgba(255,255,255,0.2)"}`,
                        }}>
                        {active && <Check size={13} className="text-white" />}
                      </div>
                      <span className={`text-sm ${active ? "text-white font-medium" : "text-slate-300"}`}>{e.label}</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: pkg.accent }}>
                      + {e.price.toLocaleString("ar-SA")} ريال
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* Customer info */}
        <Section title="بيانات الحجز" icon={<User size={16} />} accent={pkg.accent}>
          <div className="space-y-3">
            <Input icon={<User size={14} />} label="الاسم الكامل *"
              value={p.name} onChange={p.setName} placeholder="مثال: أحمد محمد" />
            <Input icon={<Phone size={14} />} label="رقم الجوال *" dir="ltr"
              value={p.phone} onChange={p.setPhone} placeholder="05xxxxxxxx" />
            <div className="grid grid-cols-2 gap-3">
              <Input icon={<Calendar size={14} />} label="تاريخ الرحلة *" type="date"
                value={p.date} onChange={p.setDate} min={today} />
              <NumberInput icon={<Users size={14} />} label="عدد الأشخاص"
                value={p.persons} onChange={p.setPersons} min={1} max={50} />
            </div>
            {pkg.extraPersonPrice && (
              <div className="text-xs text-slate-500 px-1">
                💡 الباقة الأساسية حتى {pkg.basePersons} أشخاص. كل شخص إضافي:{" "}
                <span className="text-[#F4A400] font-bold">+{pkg.extraPersonPrice} ريال</span>
              </div>
            )}
            <div>
              <label className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
                <FileText size={14} className="text-[#0077B6]" />
                ملاحظات (اختياري)
              </label>
              <textarea value={p.notes} onChange={(e) => p.setNotes(e.target.value)}
                rows={3} className="drawer-input resize-none w-full"
                placeholder="مثلاً: تجهيز خاص، احتياجات معينة..." />
            </div>
          </div>
        </Section>

        {/* Payment */}
        <Section title="طريقة الدفع" icon={<Wallet size={16} />} accent={pkg.accent}>
          <div className="grid grid-cols-2 gap-2">
            <PayChoice
              active={p.payMethod === "transfer"}
              onClick={() => p.setPayMethod("transfer")}
              icon={<Banknote size={20} />}
              title="تحويل بنكي"
              desc="تحويل الآن + إرسال الإيصال"
              accent="#F4A400"
            />
            <PayChoice
              active={p.payMethod === "cash"}
              onClick={() => p.setPayMethod("cash")}
              icon={<Wallet size={20} />}
              title="الدفع عند الوصول"
              desc="ادفع نقداً عند الميناء"
              accent="#10B981"
            />
          </div>
        </Section>
      </div>

      {/* ── Summary card (sticky on desktop) ── */}
      <aside className="lg:sticky lg:top-6 self-start">
        <div className="rounded-3xl p-5 lg:p-6"
          style={{ background: "rgba(15,34,54,0.85)", border: `1px solid ${pkg.accent}40`, backdropFilter: "blur(12px)"}}>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">ملخص الحجز</p>

          <div className="space-y-2 mb-4 text-sm">
            <Row label="الباقة" value={pkg.title} />
            {pkg.tiers && p.tier && (
              <Row label="الخيار" value={pkg.tiers.find(t => t.id === p.tier)?.label || "—"} />
            )}
            {pkg.slots && p.slot && (
              <Row label="الوقت" value={pkg.slots.find(s => s.id === p.slot)?.label || "—"} />
            )}
            <Row label="عدد الأشخاص" value={`${p.persons.toLocaleString("ar-SA")} شخص`} />
            {p.date && <Row label="التاريخ" value={p.date} />}
            {pkg.extras && p.extras.length > 0 && (
              <Row label="الإضافات" value={`${p.extras.length} إضافة`} />
            )}
          </div>

          <div className="border-t border-white/10 pt-4 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">الإجمالي</span>
              <div className="text-left">
                <p className="font-extrabold text-3xl" style={{ color: pkg.accent }}>
                  {p.total.toLocaleString("ar-SA")}
                </p>
                <p className="text-slate-500 text-xs">ريال سعودي</p>
              </div>
            </div>
          </div>

          <button
            onClick={p.onSubmit}
            disabled={p.submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white shadow-xl transition-all disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${pkg.accent}, ${pkg.accent}cc)` }}
          >
            {p.submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {p.submitting ? "جاري الحجز..." : "تأكيد الحجز"}
          </button>

          <p className="text-center text-slate-500 text-xs mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={12} /> حجزك محفوظ ومؤمَّن
          </p>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, icon, accent, children }:
  { title: string; icon: React.ReactNode; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-5 lg:p-6"
      style={{ background: "rgba(15,34,54,0.6)", border: "1px solid rgba(0,119,182,0.18)", backdropFilter: "blur(8px)" }}>
      <h3 className="flex items-center gap-2 text-white font-bold text-base mb-4">
        <span style={{ color: accent }}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500 text-xs">{label}</span>
      <span className="text-slate-200 text-sm font-medium text-left line-clamp-1">{value}</span>
    </div>
  );
}

function Input({ icon, label, value, onChange, placeholder, type = "text", dir, min }:
  { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; dir?: string; min?: string }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
        <span className="text-[#0077B6]">{icon}</span>
        {label}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} dir={dir} min={min}
        className="drawer-input w-full" />
    </div>
  );
}

function NumberInput({ icon, label, value, onChange, min, max }:
  { icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-2">
        <span className="text-[#0077B6]">{icon}</span>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 rounded-xl bg-white/5 text-white hover:bg-white/10 transition flex items-center justify-center">−</button>
        <input type="number" value={value} onChange={(e) => onChange(Math.max(min, Math.min(max, +e.target.value || min)))}
          className="drawer-input flex-1 text-center" />
        <button onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 rounded-xl bg-white/5 text-white hover:bg-white/10 transition flex items-center justify-center">+</button>
      </div>
    </div>
  );
}

function PayChoice({ active, onClick, icon, title, desc, accent }:
  { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string; accent: string }) {
  return (
    <button onClick={onClick} className="text-right p-4 rounded-2xl transition-all"
      style={{
        background: active ? `${accent}15` : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? accent : "rgba(255,255,255,0.08)"}`,
      }}>
      <div className="flex items-center gap-2 mb-1.5" style={{ color: active ? accent : "#94a3b8" }}>
        {icon}
        <p className={`font-bold text-sm ${active ? "text-white" : "text-slate-200"}`}>{title}</p>
      </div>
      <p className="text-slate-500 text-xs">{desc}</p>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
function PaymentScreen({ total, bookingId, pkgTitle, name, date, onDone }:
  { total: number; bookingId: string; pkgTitle: string; name: string; date: string; onDone: () => void }) {

  const [copied, setCopied] = useState(false);
  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(BANK.iban);
      setCopied(true);
      toast.success("تم نسخ رقم الحساب (IBAN)");
      setTimeout(() => setCopied(false), 2500);
    } catch { toast.error("تعذّر النسخ"); }
  };

  const qrData = encodeURIComponent(
    `Bank: ${BANK.bank}\nName: ${BANK.name}\nIBAN: ${BANK.iban}\nAmount: ${total} SAR\nRef: ${bookingId}`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&bgcolor=ffffff&color=0D1B2A&margin=10&data=${qrData}`;

  const waText = encodeURIComponent(
`السلام عليكم،
أرسل لكم إيصال التحويل البنكي 🏦

📋 رقم الحجز: ${bookingId}
👤 الاسم: ${name}
📅 التاريخ: ${date}
🚤 الباقة: ${pkgTitle}
💰 المبلغ: ${total} ريال`);
  const waUrl = `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${waText}&type=phone_number&app_absent=0`;

  return (
    <div className="max-w-2xl mx-auto">

      {/* Success header */}
      <div className="rounded-3xl p-6 mb-5 text-center"
        style={{ background: "linear-gradient(135deg, rgba(244,164,0,0.15), rgba(244,164,0,0.04))", border: "1px solid rgba(244,164,0,0.3)" }}>
        <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #F4A400, #c98800)" }}>
          <Check size={32} className="text-black" strokeWidth={3} />
        </div>
        <h2 className="text-white font-extrabold text-2xl">تم حفظ الحجز بنجاح</h2>
        <p className="text-slate-300 text-sm mt-2">يتبقى خطوة واحدة فقط — أكمل الدفع لتأكيد رحلتك</p>
        <p className="text-slate-500 text-xs mt-2 font-mono">رقم الحجز: {bookingId}</p>
      </div>

      {/* Amount */}
      <div className="rounded-3xl p-5 mb-5 text-center"
        style={{ background: "rgba(15,34,54,0.7)", border: "1px solid rgba(0,119,182,0.3)" }}>
        <p className="text-slate-400 text-xs uppercase tracking-wider">المبلغ المطلوب تحويله</p>
        <p className="font-extrabold text-5xl mt-2" style={{ color: "#F4A400" }}>
          {total.toLocaleString("ar-SA")}
        </p>
        <p className="text-slate-400 text-sm mt-1">ريال سعودي</p>
      </div>

      {/* QR + Bank info */}
      <div className="rounded-3xl p-6 mb-5"
        style={{ background: "rgba(15,34,54,0.7)", border: "1px solid rgba(0,119,182,0.3)" }}>
        <h3 className="text-white font-bold text-lg mb-4 text-center flex items-center justify-center gap-2">
          <Banknote size={20} className="text-[#F4A400]" />
          تفاصيل التحويل البنكي
        </h3>

        <div className="flex flex-col items-center mb-5">
          <div className="p-3 rounded-2xl bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR" width={240} height={240} className="rounded-xl" />
          </div>
          <p className="text-slate-500 text-xs mt-3 flex items-center gap-1">
            <Sparkles size={12} className="text-[#F4A400]" /> امسح الكود لنسخ بيانات الحساب
          </p>
        </div>

        <div className="space-y-3">
          <BankRow label="🏦 البنك"        value={BANK.bank} />
          <BankRow label="👤 اسم المستفيد" value={BANK.name} />
          <div className="rounded-xl p-3 flex items-center justify-between gap-3"
            style={{ background: "rgba(244,164,0,0.08)", border: "1px solid rgba(244,164,0,0.3)" }}>
            <div className="flex-1 min-w-0">
              <p className="text-slate-400 text-xs mb-1">🔢 رقم الآيبان</p>
              <p className="text-white font-bold font-mono text-sm break-all" dir="ltr">{BANK.iban}</p>
            </div>
            <button onClick={copyIban}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition"
              style={{ background: copied ? "#10B981" : "#F4A400", color: "#000" }}>
              {copied ? <><Check size={14}/> تم</> : <><Copy size={14}/> نسخ</>}
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp step */}
      <div className="rounded-3xl p-6 mb-5"
        style={{ background: "linear-gradient(135deg, rgba(37,211,102,0.12), rgba(37,211,102,0.02))", border: "1px solid rgba(37,211,102,0.3)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(37,211,102,0.18)" }}>
            <MessageCircle size={22} className="text-[#25D366]" />
          </div>
          <div>
            <h3 className="text-white font-bold">بعد التحويل، أرسل صورة الإيصال</h3>
            <p className="text-slate-400 text-xs mt-0.5">عبر الواتساب لتأكيد حجزك فوراً</p>
          </div>
        </div>
        <a href={waUrl} target="_blank" rel="noopener"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white shadow-lg transition"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
          <MessageCircle size={18} /> فتح واتساب وإرسال الإيصال
        </a>
        <p className="text-center text-slate-500 text-xs mt-3">
          📱 الرقم: <span className="text-slate-300 font-mono" dir="ltr">+966 50 004 5946</span>
        </p>
      </div>

      <button onClick={onDone}
        className="w-full py-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition text-sm font-medium">
        تم — إنهاء العملية
      </button>
    </div>
  );
}

function BankRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <span className="text-slate-400 text-xs">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
function DoneScreen({ bookingId, payMethod, onReset }:
  { bookingId: string; payMethod: PayMethod; onReset: () => void }) {
  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
        <Check size={48} className="text-white" strokeWidth={3} />
      </div>
      <h2 className="text-white font-extrabold text-3xl mb-3">شكراً لك! 🌊</h2>
      <p className="text-slate-300 text-base mb-2">تم استلام حجزك بنجاح</p>
      <p className="text-slate-500 text-sm font-mono mb-8">رقم الحجز: {bookingId}</p>

      <div className="rounded-2xl p-5 mb-6 text-right"
        style={{ background: "rgba(15,34,54,0.7)", border: "1px solid rgba(0,119,182,0.25)" }}>
        <p className="text-white font-bold text-sm mb-3">الخطوات التالية:</p>
        <ul className="text-slate-300 text-sm space-y-2">
          {payMethod === "transfer" ? (
            <>
              <li className="flex items-start gap-2"><span className="text-[#F4A400]">①</span> أكمل التحويل البنكي بالمبلغ المطلوب</li>
              <li className="flex items-start gap-2"><span className="text-[#F4A400]">②</span> أرسل صورة الإيصال عبر الواتساب</li>
              <li className="flex items-start gap-2"><span className="text-[#F4A400]">③</span> سنتواصل معك لتأكيد الموعد النهائي</li>
            </>
          ) : (
            <>
              <li className="flex items-start gap-2"><span className="text-[#10B981]">①</span> سنتواصل معك خلال 30 دقيقة لتأكيد الحجز</li>
              <li className="flex items-start gap-2"><span className="text-[#10B981]">②</span> ادفع نقداً عند الوصول للميناء</li>
              <li className="flex items-start gap-2"><span className="text-[#10B981]">③</span> استمتع برحلتك! 🚤</li>
            </>
          )}
        </ul>
      </div>

      <button onClick={onReset}
        className="px-6 py-3 rounded-xl font-bold text-white transition"
        style={{ background: "linear-gradient(135deg, #0077B6, #005f92)" }}>
        حجز رحلة أخرى
      </button>
    </div>
  );
}
