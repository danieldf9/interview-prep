"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  TrendingUp,
  BookOpen,
  Sparkles,
  Library,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview", label: "Mock Interview", icon: MessageSquare },
  { href: "/report", label: "Reports", icon: FileText },
  { href: "/topics", label: "Topics", icon: BookOpen },
  { href: "/resources", label: "Resources", icon: Library },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">InterviewAI</h1>
          <p className="text-xs text-muted-foreground">Ace Your Interview</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-primary-50 hover:text-primary-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
        <p className="text-sm font-semibold text-primary-800">Pro Tip</p>
        <p className="text-xs text-primary-600 mt-1">
          Practice daily for 30 minutes to see the best improvement in your interview skills.
        </p>
      </div>
    </aside>
  );
}
