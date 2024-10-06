"use client";

import React, { memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Cloud,
  Droplet,
  MessageSquare,
  Calendar,
  Menu,
  LogOut,
  BinocularsIcon,
  LineChartIcon,
  CircleGaugeIcon,
  CircleGauge, // Importing the logout icon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarButton } from "@/components/shared/sidebar-button";
import Link from "next/link";
import { createClient } from "@/lib/utils/supabase/client";

interface Props {
  className?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (state: boolean) => void;
}

const routeMapping = [
  { path: "/dashboard", label: "Панель управления", Icon: CircleGauge },
  { path: "/dashboard/chat", label: "AI-помощник", Icon: MessageSquare },
  { path: "/dashboard/planner", label: "Планировщик", Icon: Calendar },
  {
    path: "/dashboard/field",
    label: "Ваши поля",
    Icon: BinocularsIcon,
  },
];

const Sidebar: React.FC<Props> = memo(({ isSidebarOpen, setIsSidebarOpen }) => {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const signOut = () => {
    supabase.auth.signOut().then(() => {
      router.replace("/");
    });
  };

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

        {/* Add sign out button */}
        <Button
          onClick={() => signOut()} // This will trigger the sign-out action
          className="w-full flex items-center justify-start space-x-2"
        >
          <LogOut className="h-6 w-6" />
          <span>Выйти</span>
        </Button>
      </nav>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

export { Sidebar };
