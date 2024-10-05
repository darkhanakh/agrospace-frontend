"use client";

import React from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { useSidebarStore } from "@/store/sidebar-store";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
