import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ title, value, icon, iconBg = "bg-[#0077B6]", trend, trendUp }: StatCardProps) {
  return (
    <div className="glass-card p-5 flex items-center gap-4 hover:border-[#0077B6]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#0077B6]/10">
      <div className={`${iconBg} rounded-2xl p-3 flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-sm truncate">{title}</p>
        <p className="text-white font-bold text-2xl mt-1">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? "text-green-400" : "text-red-400"}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
