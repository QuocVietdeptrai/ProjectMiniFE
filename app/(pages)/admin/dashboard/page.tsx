"use client";

import { useEffect, useState } from "react";
import FormDashboard from "./FormDashboard";

export default function DashboardPage() {
  const [summary, setSummary] = useState({ products: 0, students: 0, orders: 0 });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/summary`, {
      credentials: "include", // nếu dùng cookie để JWT
    })
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <FormDashboard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Chào mừng đến Dashboard</h1>
        <p>Đây là trang tổng quan hiển thị tổng số sản phẩm , học sinh , đơn hàng</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">Sản phẩm</h2>
            <p className="text-2xl font-bold">{summary.products}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">Học sinh</h2>
            <p className="text-2xl font-bold">{summary.students}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">Đơn hàng</h2>
            <p className="text-2xl font-bold">{summary.orders}</p>
          </div>
        </div>
      </div>
    </FormDashboard>
  );
}
