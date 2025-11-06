"use client";

import React from "react";
import { useRole } from "@/hook/useRole";
import Taskbar from "@/app/component/Taskbar";
import Sidebar from "@/app/component/Sidebar";

export default function FormDashboard({ children }: { children: React.ReactNode }) {
  const { user } = useRole([
    "admin",
    "product_manager",
    "order_manager",
    "student_manager",
  ]);

  if (!user) return null; // redirect handled in useRole hook

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto">
        <Taskbar/>
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  );
}
