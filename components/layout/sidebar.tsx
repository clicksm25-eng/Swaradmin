"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, CalendarDays, Anchor, Users, Wallet, Menu, X } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  pendingCount?: number;
  lastUpdated?: Date | null;
}

export default function Sidebar({ pendingCount = 0, lastUpdated }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "الرئيسية", icon: <Home size={20} /> },
    { href: "/bookings", label: "الحجوزات", icon: <CalendarDays size={20} />, badge: pendingCount },
    { href: "/activities", label: "الأنشطة والأسعار", icon: <Anchor size={20} /> },
    { href: "/clients", label: "العملاء", icon: <Users size={20} /> },
    { href: "/finance", label: "المالية", icon: <Wallet size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center py-6 px-4 border-b border-[rgba(0,119,182,0.2)]">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="https://sewarmarine.com/wp-content/uploads/2024/07/%D8%B4%D8%B9%D8%A7%D8%B1_%D8%B3%D9%88%D8%A7%D8%B1-removebg-preview.png"
            alt="سوار البحر"
            width={80}
            height={80}
            className="object-contain"
            unoptimized
          />
          <div className="text-center">
            <p className="text-[#0077B6] font-bold text-lg">سوار البحر</p>
            <p className="text-slate-400 text-xs">لوحة التحكم</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`sidebar-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
          >
            <span className="text-current">{item.icon}</span>
            <span className="flex-1 font-medium">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span className="bg-[#F4A400] text-black text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[rgba(0,119,182,0.2)]">
        <div className="text-center text-xs text-slate-500 space-y-1">
          {lastUpdated && (
            <p>
              آخر تحديث:{" "}
              {lastUpdated.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
          <p className="text-[#0077B6]">v1.0 — سوار البحر</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#0F2236] border-l border-[rgba(0,119,182,0.2)] fixed right-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-40 bg-[#0F2236] border-b border-[rgba(0,119,182,0.2)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="https://sewarmarine.com/wp-content/uploads/2024/07/%D8%B4%D8%B9%D8%A7%D8%B1_%D8%B3%D9%88%D8%A7%D8%B1-removebg-preview.png"
            alt="سوار البحر"
            width={36}
            height={36}
            className="object-contain"
            unoptimized
          />
          <span className="text-[#0077B6] font-bold">سوار البحر</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-slate-300 p-2 rounded-lg hover:bg-[rgba(0,119,182,0.15)] transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-72 z-50 bg-[#0F2236] border-l border-[rgba(0,119,182,0.2)] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
}
