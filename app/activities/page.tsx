"use client";
import Sidebar from "@/components/layout/sidebar";

const packages = [
  {
    emoji: "🍸",
    name: "رحلة السباحة والاستجمام",
    subtitle: "جزيرة ثول الرملية · ميني يخت سوار البحر 31 قدم",
    color: "from-blue-600/20 to-cyan-600/10 border-blue-500/30",
    items: [
      { label: "💧 السعر الأساسي", value: "1,200 ريال", note: "5 أشخاص · 4 ساعات + مشروبات + كاياك" },
    ],
    extras: [
      "⏱️ ساعة إضافية: +100 ريال",
      "🍉 سناك وفواكه: +350 ريال",
      "🎣 صيد + عدة صيد + طُعم: +500 ريال",
      "📸 تصوير احترافي: +500 ريال",
      "🌙 نهاية الأسبوع: +100 ريال",
    ],
  },
  {
    emoji: "🎣",
    name: "رحلات صيد الأسماك",
    subtitle: "تجربة صيد احترافية · حتى 5 أشخاص",
    color: "from-green-600/20 to-emerald-600/10 border-green-500/30",
    items: [
      { label: "🕕 6 ساعات",  value: "1,400 ريال", note: "حتى 5 أشخاص" },
      { label: "🕗 8 ساعات",  value: "1,600 ريال", note: "حتى 5 أشخاص" },
      { label: "🕙 10 ساعات", value: "1,900 ريال", note: "حتى 5 أشخاص" },
    ],
    includes: ["❄️ مياه شرب وثلج", "🐟 طُعم للصيد", "🎣 عدة الصيد كاملة", "📦 حافظة للسمك", "☕ ضيافة شاهي وقهوة"],
  },
  {
    emoji: "🕐",
    name: "رحلات بالساعة",
    subtitle: "جولة بحرية مرنة · من المرسى مباشرةً",
    color: "from-purple-600/20 to-violet-600/10 border-purple-500/30",
    items: [
      { label: "⏱️ نصف ساعة",  value: "250 ريال",  note: "حتى 5 أشخاص" },
      { label: "🕐 ساعة كاملة", value: "350 ريال",  note: "حتى 5 أشخاص" },
      { label: "🕑 ساعتان",    value: "600 ريال",  note: "حتى 5 أشخاص" },
    ],
    includes: ["🌊 جولة البحر المفتوح", "❄️ مياه شرب وثلج", "🛟 أدوات السلامة كاملة"],
  },
  {
    emoji: "🎉",
    name: "الحفلات البحرية الخاصة",
    subtitle: "اجعل مناسبتك لا تُنسى فوق أمواج البحر الأحمر",
    color: "from-pink-600/20 to-rose-600/10 border-pink-500/30",
    items: [
      { label: "🥉 البرونزية", value: "600 ريال",   note: "تجهيز بالزينة · جولة بحرية ساعة" },
      { label: "🥈 الفضية",    value: "1,000 ريال", note: "تجهيز · ساعة ونصف · كيكة 🎂 · باقة ورود 💐 · مشروبات" },
      { label: "🥇 الذهبية",   value: "1,500 ريال", note: "تجهيز · ساعتان · كيكة 🎂 · باقة ورود 💐 · مشروبات · عشاء لشخصين 🍽️" },
    ],
    includes: ["🚤 قارب مجهز VIP", "🎵 مسجل وسماعات DJ", "🛋️ جلسات مريحة", "🔒 خصوصية تامة"],
  },
  {
    emoji: "🐬",
    name: "رحلة مشاهدة الدلافين",
    subtitle: "شاهد الدلافين في البحر الأحمر · 4 ساعات",
    color: "from-teal-600/20 to-cyan-600/10 border-teal-500/30",
    items: [
      { label: "🌅 الرحلة الصباحية",   value: "900 ريال",  note: "6:00 ص — 10:00 ص · حتى 5 أشخاص" },
      { label: "🌇 رحلة وقت الغروب", value: "900 ريال",  note: "2:00 م — 6:00 م · حتى 5 أشخاص" },
      { label: "👤 شخص إضافي (فوق 5)", value: "+50 ريال", note: "" },
    ],
    includes: ["🐬 مشاهدة الدلافين", "🕐 4 ساعات كاملة", "❄️ مياه شرب وثلج", "🍹 مشروبات متنوعة", "🛟 أدوات السلامة كاملة", "📍 مرشد بحري متخصص"],
  },
  {
    emoji: "👑",
    name: "رحلة الصيد الملكية VIP",
    subtitle: "صيد احترافي + طبخ مباشر + ضيافة فاخرة · 8 ساعات · بحر ثول",
    color: "from-yellow-600/20 to-amber-600/10 border-yellow-500/30",
    items: [
      { label: "👑 الباقة الملكية VIP", value: "3,800 ريال", note: "5 أشخاص · 8 ساعات" },
      { label: "👤 شخص إضافي (فوق 5)",  value: "+100 ريال",  note: "" },
    ],
    includes: [
      "🕗 8 ساعات كاملة", "🎣 عدة الصيد كاملة", "🐟 طُعم للصيد",
      "📦 حافظة للسمك", "🍳 طبخ الصيد مباشرةً",
      "❄️ مياه شرب وثلج", "☕ شاهي وقهوة فاخرة", "🛟 أدوات السلامة كاملة",
    ],
  },
];

export default function ActivitiesPage() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:mr-64 p-4 lg:p-8 pt-20 lg:pt-8 min-w-0 overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-white font-bold text-2xl lg:text-3xl">الأنشطة والأسعار</h1>
          <p className="text-slate-400 mt-1">قائمة باقات سوار البحر</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`glass-card bg-gradient-to-br ${pkg.color} border p-6 hover:scale-[1.02] transition-transform duration-200 flex flex-col`}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-1">
                <span className="text-3xl mt-0.5">{pkg.emoji}</span>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{pkg.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{pkg.subtitle}</p>
                </div>
              </div>

              <div className="border-t border-white/10 my-4" />

              {/* Pricing rows */}
              <div className="space-y-3 flex-1">
                {pkg.items.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-slate-200 text-sm font-medium">{item.label}</p>
                      {item.note && <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.note}</p>}
                    </div>
                    <span className="text-[#F4A400] font-bold text-sm whitespace-nowrap">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Includes */}
              {pkg.includes && (
                <div className="border-t border-white/10 pt-3 mt-4">
                  <p className="text-slate-400 text-xs font-medium mb-2">✅ يشمل الباقة:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {pkg.includes.map((inc, i) => (
                      <p key={i} className="text-slate-400 text-xs">{inc}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {pkg.extras && (
                <div className="border-t border-white/10 pt-3 mt-4">
                  <p className="text-slate-400 text-xs font-medium mb-2">✨ إضافات اختيارية:</p>
                  <div className="space-y-1">
                    {pkg.extras.map((e, i) => (
                      <p key={i} className="text-slate-400 text-xs">{e}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
