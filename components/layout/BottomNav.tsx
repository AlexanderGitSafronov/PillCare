"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Pill, Calendar, Clock, Settings } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, key: "dashboard" as const },
  { href: "/medications", icon: Pill, key: "medications" as const },
  { href: "/calendar", icon: Calendar, key: "calendar" as const },
  { href: "/history", icon: Clock, key: "history" as const },
  { href: "/settings", icon: Settings, key: "settings" as const },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="bottom-nav z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[60px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-lg -m-1"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-6 h-6 relative z-10 transition-all",
                    isActive ? "scale-110" : ""
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className="text-[10px] font-medium leading-none">
                {t.nav[item.key]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
