/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import { useRole } from "@/hook/useRole";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useRole([
    "admin",
    "order_manager",
    "product_manager",
    "student_manager",
  ]);

  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusLabels: Record<string, string> = {
    pending: "Chờ xử lý",
    completed: "Hoàn thành",
    canceled: "Đã hủy",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };

  const paymentLabels: Record<string, string> = {
    cash: "Tiền mặt",
    bank: "Chuyển khoản",
  };

  const fetchOrders = async (page = 1, search = "") => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/orders/list`);
      url.searchParams.append("page", page.toString());
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString(), { credentials: "include" });
      const data = await res.json();

      if (data.status === "success" && Array.isArray(data.data.data)) {
        setOrders(data.data.data);
        setCurrentPage(data.data.current_page);
        setTotalPages(data.data.last_page);
      } else {
        console.error("Không lấy được danh sách đơn hàng", data);
      }
    } catch (err) {
      console.error("Lỗi fetch đơn hàng:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.status === "success") {
        fetchOrders(currentPage, searchTerm);
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
      fetchOrders(1, searchTerm);
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
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <Link
              href="/admin/order/create"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex-shrink-0"
            >
              Thêm đơn hàng mới
            </Link>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 text-black">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phương thức thanh toán</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-black">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-3">{order.customer_name}</td>
                    <td className="px-6 py-3">{Number(order.total).toLocaleString()}₫</td>
                    <td className="px-6 py-3">
                      {paymentLabels[order.payment_method] || "Không xác định"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          statusColors[order.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/order/${order.id}`)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition"
                      >
                        Hủy
                      </button>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Không tìm thấy đơn hàng
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
                  onClick={() => fetchOrders(page, searchTerm)}
                  className={`px-3 py-1 rounded border text-sm font-medium transition ${
                    page === currentPage
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
