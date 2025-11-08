/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import { useRole } from "@/hook/useRole";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentsPage() {
  const { user } = useRole([
    "admin",
    "student_manager",
    "product_manager",
    "order_manager",
  ]);

  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch danh sách học sinh
  const fetchStudents = async (page = 1, search = "") => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/students/list`);
      url.searchParams.append("page", page.toString());
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString(), { credentials: "include" });
      const data = await res.json();

      if (data.status === "success" && Array.isArray(data.data.data)) {
        setStudents(data.data.data);
        setCurrentPage(data.data.current_page);
        setTotalPages(data.data.last_page);
      } else {
        console.error("Không lấy được danh sách học sinh", data);
      }
    } catch (error) {
      console.error("Lỗi fetch học sinh:", error);
    }
  };

  // Xóa học sinh
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa học sinh này?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.status === "success") {
        fetchStudents(currentPage, searchTerm);
      } else {
        alert(data.message || "Xóa thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server!");
    }
  };

  // Search debounce
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchStudents(1, searchTerm);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Quản lý học sinh</h1>
          </div>

          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* <Link
              href="/admin/student/create"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex-shrink-0"
            >
              Thêm học sinh mới
            </Link> */}
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 text-black">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Avatar</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên học sinh</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ngày sinh</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lớp</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-black">
                {students.map((item: any) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-3">
                      <img
                        src={item.avatar}
                        alt={item.full_name}
                        className="w-16 h-16 rounded object-cover"
                      />
                    </td>
                    <td className="px-6 py-3 font-medium">{item.full_name}</td>
                    <td className="px-6 py-3">{item.dob}</td>
                    <td className="px-6 py-3">{item.class}</td>
                    <td className="px-6 py-3">{item.phone}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/student/${item.id}`)}
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
                {students.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Không tìm thấy học sinh
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchStudents(page, searchTerm)}
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
