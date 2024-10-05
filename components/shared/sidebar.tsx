"use client";

import React, { memo } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Cloud,
  Droplet,
  MessageSquare,
  Calendar,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarButton } from "@/components/shared/sidebar-button";
import Link from "next/link";

interface Props {
  className?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (state: boolean) => void;
}

const routeMapping = [
  { path: "/dashboard", label: "Панель управления", Icon: LineChart },
  { path: "/dashboard/weather-map", label: "Карта погоды", Icon: Cloud },
  {
    path: "/dashboard/water-resources",
    label: "Водные ресурсы",
    Icon: Droplet,
  },
  { path: "/dashboard/chat", label: "AI-помощник", Icon: MessageSquare },
  { path: "/dashboard/planner", label: "Планировщик", Icon: Calendar },
];

const Sidebar: React.FC<Props> = memo(({ isSidebarOpen, setIsSidebarOpen }) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        { "translate-x-0": isSidebarOpen, "-translate-x-full": !isSidebarOpen }
      )}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b dark:border-gray-700">
        <span className="text-2xl font-semibold text-gray-800 dark:text-white">
          AgroSpace
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <nav className="p-6 space-y-2">
        {routeMapping.map(({ path, label, Icon }) => (
          <Link key={path} href={path} passHref>
            <SidebarButton
              Icon={Icon}
              label={label}
              isActive={pathname === path}
            />
          </Link>
        ))}
      </nav>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

export { Sidebar };
