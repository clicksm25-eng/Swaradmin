"use client";
import Sidebar from "@/components/layout/sidebar";

const packages = [
  {
    emoji: "🍸",
    name: "رحلة السباحة والاستجمام",
    color: "from-blue-600/20 to-cyan-600/10 border-blue-500/30",
    items: [
      { label: "الأساسية", value: "1,200 ريال", note: "5 أشخاص - 4 ساعات" },
    ],
    extras: [
      "ساعة إضافية: +100 ريال",
      "سناك: +350 ريال",
      "صيد: +500 ريال",
      "تصوير: +500 ريال",
    ],
  },
  {
    emoji: "🎣",
    name: "رحلات صيد الأسماك",
    color: "from-green-600/20 to-emerald-600/10 border-green-500/30",
    items: [
      { label: "6 ساعات", value: "1,400 ريال" },
      { label: "8 ساعات", value: "1,600 ريال" },
      { label: "10 ساعات", value: "1,900 ريال" },
    ],
    extras: undefined,
  },
  {
    emoji: "🕐",
    name: "رحلات بالساعة",
    color: "from-purple-600/20 to-violet-600/10 border-purple-500/30",
    items: [
      { label: "نصف ساعة", value: "250 ريال" },
      { label: "ساعة كاملة", value: "350 ريال" },
      { label: "ساعتان", value: "600 ريال" },
    ],
    extras: undefined,
  },
  {
    emoji: "🎉",
    name: "الحفلات البحرية",
    color: "from-pink-600/20 to-rose-600/10 border-pink-500/30",
    items: [
      { label: "🥉 برونز", value: "600 ريال", note: "ساعة" },
      { label: "🥈 فضية", value: "1,000 ريال", note: "ساعة ونصف + كيكة + ورود" },
      { label: "🥇 ذهبية", value: "1,500 ريال", note: "ساعتان + كيكة + ورود + عشاء" },
    ],
    extras: undefined,
  },
  {
    emoji: "🐬",
    name: "رحلة مشاهدة الدلافين",
    color: "from-teal-600/20 to-cyan-600/10 border-teal-500/30",
    items: [
      { label: "الأساسية", value: "900 ريال", note: "5 أشخاص - 4 ساعات" },
      { label: "شخص إضافي", value: "+50 ريال" },
    ],
    extras: undefined,
  },
  {
    emoji: "👑",
    name: "رحلة الصيد الملكية VIP",
    color: "from-yellow-600/20 to-amber-600/10 border-yellow-500/30",
    items: [
      { label: "VIP", value: "3,800 ريال", note: "5 أشخاص - 8 ساعات" },
      { label: "شخص إضافي", value: "+100 ريال" },
    ],
    extras: undefined,
  },
];

export default function ActivitiesPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:mr-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-white font-bold text-2xl lg:text-3xl">الأنشطة والأسعار</h1>
          <p className="text-slate-400 mt-1">قائمة باقات سوار البحر</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`glass-card bg-gradient-to-br ${pkg.color} border p-6 hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{pkg.emoji}</span>
                <h3 className="text-white font-bold text-lg leading-tight">{pkg.name}</h3>
              </div>

              <div className="space-y-3 mb-4">
                {pkg.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm">{item.label}</p>
                      {item.note && <p className="text-slate-500 text-xs">{item.note}</p>}
                    </div>
                    <span className="text-[#F4A400] font-bold text-sm">{item.value}</span>
                  </div>
                ))}
              </div>

              {pkg.extras && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-slate-400 text-xs mb-2">إضافات:</p>
                  <div className="space-y-1">
                    {pkg.extras.map((e, i) => (
                      <p key={i} className="text-slate-400 text-xs">• {e}</p>
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
