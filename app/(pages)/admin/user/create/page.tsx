"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import FormCreateUser from "./FormCreate";

export default function CreateProductPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen text-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Taskbar */}
        <Taskbar />

        {/* Nội dung chính */}
        <div className="p-6 flex-1">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Thêm người dùng mới</h2>
            <FormCreateUser />
        </div>
      </main>
    </div>
  );
}