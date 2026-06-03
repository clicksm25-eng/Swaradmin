export interface Tier   { id: string; label: string; sub?: string; price: number; }
export interface Slot   { id: string; label: string; time: string; }
export interface Extra  { id: string; label: string; price: number; }
export interface Pkg {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  from: number;
  badge: string;
  yacht: string;
  desc?: string;
  accent: string;          // primary color for accents
  bgGradient: string;      // card background gradient
  basePersons: number;
  extraPersonPrice?: number;
  tiers?: Tier[];          // mandatory choice
  slots?: Slot[];          // mandatory choice (e.g. dolphin times)
  extras?: Extra[];        // optional checkboxes
  includes: string[];      // bullet "what's included"
  baseInline?: { label: string; sub: string; price: number };  // single base option (swimming-style)
}

export const PACKAGES: Pkg[] = [
  // 1 — Swimming
  {
    id: "swim",
    emoji: "🍸",
    title: "رحلة السباحة والاستجمام",
    subtitle: "جزيرة ثول الرملية · ميني يخت سوار البحر 31 قدم",
    from: 1200,
    badge: "5 أشخاص · 4 ساعات",
    yacht: "⚓ يتسع لـ11 شخص · غرفة نوم خاصة · مطبخ تحضيري متكامل · دورة مياه · ماء حلو للغسيل والاستحمام",
    accent: "#0EA5E9",
    bgGradient: "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(14,165,233,0.04))",
    basePersons: 5,
    baseInline: { label: "💧 السعر الأساسي — 4 ساعات + مشروبات", sub: "لـ 5 أشخاص · كاياك + أدوات سلامة", price: 1200 },
    extras: [
      { id: "hour",   label: "⏱️ ساعة إضافية",            price: 100 },
      { id: "snack",  label: "🍉 سناك وفواكه",            price: 350 },
      { id: "fish",   label: "🎣 صيد + عدة صيد + طُعم",   price: 500 },
      { id: "photo",  label: "📸 تصوير احترافي",          price: 500 },
      { id: "weekend",label: "🌙 نهاية الأسبوع",          price: 100 },
    ],
    includes: ["🛟 كاياك + أدوات سلامة", "🍹 مشروبات متنوعة", "❄️ مياه شرب وثلج"],
  },
  // 2 — Fishing
  {
    id: "fish",
    emoji: "🎣",
    title: "رحلات صيد الأسماك",
    subtitle: "تجربة صيد احترافية · حتى 5 أشخاص",
    from: 1400,
    badge: "لـ 5 أشخاص",
    yacht: "⚓ يتسع لـ11 شخص · غرفة نوم خاصة · مطبخ تحضيري متكامل · دورة مياه · ماء حلو للغسيل والاستحمام",
    accent: "#10B981",
    bgGradient: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.04))",
    basePersons: 5,
    tiers: [
      { id: "6h",  label: "🕕 6 ساعات",  sub: "حتى 5 أشخاص", price: 1400 },
      { id: "8h",  label: "🕗 8 ساعات",  sub: "حتى 5 أشخاص", price: 1600 },
      { id: "10h", label: "🕙 10 ساعات", sub: "حتى 5 أشخاص", price: 1900 },
    ],
    includes: [
      "❄️ مياه شرب وثلج",
      "🐟 طُعم للصيد",
      "🎣 عدة الصيد كاملة",
      "📦 حافظة للسمك",
      "☕ ضيافة شاهي وقهوة",
    ],
  },
  // 3 — Hourly
  {
    id: "hour",
    emoji: "🕐",
    title: "رحلات بالساعة",
    subtitle: "جولة بحرية مرنة · من المرسى مباشرةً",
    from: 250,
    badge: "لـ 5 أشخاص",
    yacht: "⚓ يتسع لـ11 شخص · غرفة نوم خاصة · مطبخ تحضيري متكامل · دورة مياه · ماء حلو للغسيل والاستحمام",
    accent: "#F4A400",
    bgGradient: "linear-gradient(135deg, rgba(244,164,0,0.18), rgba(244,164,0,0.04))",
    basePersons: 5,
    tiers: [
      { id: "30m", label: "⏱️ نصف ساعة",  sub: "حتى 5 أشخاص", price: 250 },
      { id: "1h",  label: "🕐 ساعة كاملة", sub: "حتى 5 أشخاص", price: 350 },
      { id: "2h",  label: "🕑 ساعتان",    sub: "حتى 5 أشخاص", price: 600 },
    ],
    includes: ["🌊 جولة البحر المفتوح", "❄️ مياه شرب وثلج", "🛟 أدوات السلامة كاملة"],
  },
  // 4 — Parties
  {
    id: "party",
    emoji: "🎉",
    title: "تنظيم الحفلات البحرية الخاصة",
    subtitle: "اجعل مناسبتك لا تُنسى فوق أمواج البحر الأحمر",
    from: 600,
    badge: "لـ 5 أشخاص",
    yacht: "🚤 قارب مجهز VIP · 🎵 مسجل وسماعات DJ · 🛋️ جلسات مريحة · 🔒 خصوصية تامة",
    accent: "#EC4899",
    bgGradient: "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(236,72,153,0.04))",
    basePersons: 5,
    tiers: [
      { id: "bronze", label: "🥉 البرونزية", sub: "تجهيز القارب بالزينة · جولة بحرية · ساعة", price: 600 },
      { id: "silver", label: "🥈 الفضية",    sub: "تجهيز القارب · جولة ساعة ونصف · كيكة 🎂 · باقة ورود 💐 · مشروبات", price: 1000 },
      { id: "gold",   label: "🥇 الذهبية",   sub: "تجهيز القارب · جولة ساعتان · كيكة 🎂 · باقة ورود 💐 · مشروبات · عشاء لشخصين 🍽️", price: 1500 },
    ],
    includes: ["🚤 قارب مجهز VIP", "🎵 مسجل وسماعات DJ", "🛋️ جلسات مريحة", "🔒 خصوصية تامة"],
  },
  // 5 — Dolphins
  {
    id: "dolphin",
    emoji: "🐬",
    title: "رحلة مشاهدة الدلافين",
    subtitle: "تجربة لا تُنسى · شاهد الدلافين في البحر الأحمر · 4 ساعات",
    from: 900,
    badge: "لـ 5 أشخاص",
    yacht: "⚓ يتسع لـ10 أشخاص · غرفة نوم خاصة · مطبخ تحضيري متكامل · دورة مياه · ماء حلو للغسيل والاستحمام",
    accent: "#3B82F6",
    bgGradient: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(59,130,246,0.04))",
    basePersons: 5,
    extraPersonPrice: 50,
    slots: [
      { id: "morning", label: "🌅 الرحلة الصباحية",   time: "6:00 ص — 10:00 ص" },
      { id: "sunset",  label: "🌇 رحلة وقت الغروب", time: "2:00 م — 6:00 م" },
    ],
    baseInline: { label: "👥 حتى 5 أشخاص — السعر الأساسي", sub: "الأشخاص الإضافيين فوق 5 يُحتسبون 50 ريال للشخص", price: 900 },
    includes: [
      "🐬 مشاهدة الدلافين",
      "🕐 4 ساعات كاملة",
      "❄️ مياه شرب وثلج",
      "🍹 مشروبات متنوعة",
      "🛟 أدوات السلامة كاملة",
      "📍 مرشد بحري متخصص",
    ],
  },
  // 6 — VIP
  {
    id: "vip",
    emoji: "👑",
    title: "رحلة الصيد الملكية — الباقة الشاملة VIP",
    subtitle: "صيد احترافي + طبخ مباشر + ضيافة فاخرة · 8 ساعات · بحر ثول",
    from: 3800,
    badge: "VIP · لـ 5 أشخاص",
    yacht: "⚓ يتسع لـ11 شخص · غرفة نوم خاصة · مطبخ تحضيري متكامل · دورة مياه · ماء حلو للغسيل والاستحمام",
    desc: "استمتع بتجربة بحرية فاخرة تجمع بين الصيد الاحترافي وتجربة الطهي المباشر في قلب بحر ثول. نأخذك إلى أفضل مواقع الصيد، ثم نحوّل صيدك إلى وجبة بحرية طازجة تُحضَّر أمامك.",
    accent: "#F4A400",
    bgGradient: "linear-gradient(135deg, rgba(244,164,0,0.22), rgba(244,164,0,0.04))",
    basePersons: 5,
    extraPersonPrice: 100,
    baseInline: { label: "👑 الباقة الملكية VIP — 8 ساعات", sub: "حتى 5 أشخاص · شخص إضافي +100 ريال", price: 3800 },
    includes: [
      "🕗 8 ساعات كاملة",
      "🎣 عدة الصيد كاملة",
      "🐟 طُعم للصيد",
      "📦 حافظة للسمك",
      "🍳 طبخ الصيد مباشرةً",
      "❄️ مياه شرب وثلج",
      "☕ شاهي وقهوة فاخرة",
      "🛟 أدوات السلامة كاملة",
    ],
  },
];

export const BANK = {
  bank:  "مصرف الراجحي",
  name:  "مؤسسة سوار البحر للتجارة",
  iban:  "SA4180000993608016031469",
};

export const WHATSAPP_PHONE = "966500045946";
