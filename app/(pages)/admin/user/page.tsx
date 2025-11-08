/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import { useRole } from "@/hook/useRole";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const roleLabels: Record<string, string> = {
    admin: "Admin",
    user: "Người dùng",
    product_manager: "Quản lý sản phẩm",
    student_manager: "Quản lý học sinh",
    order_manager: "Quản lý đơn hàng",
};
const statusLabels: Record<string, string> = {
    active: "Hoạt động",
    inactive: "Dừng hoạt động"
};

export default function ProductsPage() {
  const { user } = useRole([
    "admin",
  ]);

  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page = 1, search = "") => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/list`);
      url.searchParams.append("page", page.toString());
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString(), { credentials: "include" });
      const data = await res.json();

      if (data.status === "success" && Array.isArray(data.data.data)) {
        setUsers(data.data.data);
        setCurrentPage(data.data.current_page);
        setTotalPages(data.data.last_page);
      } else {
        console.error("Không lấy được danh sách người dùng", data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.status === "success") {
        fetchUsers(currentPage, searchTerm); // fetch lại trang hiện tại sau khi xóa
      } else {
        alert(data.message || "Xóa thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server!");
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  if (!user) return null;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto">
        <Taskbar />

        <div className="p-6 flex-1">
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Link
              href="/admin/user/create"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex-shrink-0"
            >
              Thêm người dùng mới
            </Link>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 text-black">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên người dùng</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quyền</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-black">
                {users.map((item: any) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-3 font-medium">{item.name}</td>
                    <td className="px-6 py-3">{item.email}</td>
                    <td className="px-6 py-3 max-w-xs truncate">{statusLabels[item.status]}</td>
                    <td className="px-6 py-3 max-w-xs truncate">{roleLabels[item.role]}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/user/${item.id}`)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Không tìm thấy người dùng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchUsers(page, searchTerm)}
                  className={`px-3 py-1 rounded border text-sm font-medium transition ${page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
