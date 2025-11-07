// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Sản phẩm", href: "/admin/product" },
  { name: "Học sinh", href: "/admin/student" },
  { name: "Đơn hàng", href: "/admin/order" },
  { name: "Quản trị tài khoản", href: "/admin/user" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === "success") {
          router.push("/login");
        }
      })
      .catch(() => {
        alert("Đăng xuất thất bại. Vui lòng thử lại.");
      });
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 h-screen flex flex-col justify-between">
      <div>
        {/* Logo / Title */}
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          <span className="text-blue-400">ProjectMini</span>
          <span className="text-white">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}