/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import { useRole } from "@/hook/useRole";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditOrderPage() {
  const { user } = useRole(["admin", "order_manager"]);
  const router = useRouter();
  const { id } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [student, setStudent] = useState({
    full_name: "",
    class: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("");
  const [orderDate, setOrderDate] = useState("");

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/listOrder`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.status === "success") setProducts(data.data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  // Lấy chi tiết đơn hàng
    useEffect(() => {
    const fetchOrder = async () => {
        try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
            credentials: "include",
        });
        const data = await res.json();

        if (data.status === "success") {
            const order = data.data;
            setStudent({
            full_name: order.student?.full_name || order.customer_name || "",
            class: order.student?.class || "",
            phone: order.student?.phone || "",
            });

            setPaymentMethod(order.payment_method || "");
            setStatus(order.status || "");
            setOrderDate(order.order_date || new Date().toISOString().split("T")[0]);

            // Map ảnh từ products list
            setOrderItems(
            order.items.map((i: any) => {
                const product = products.find((p) => p.id == i.product_id);
                return {
                product_id: i.product_id,
                quantity: i.quantity,
                price: i.price,
                name: i.product?.name || product?.name || "",
                image: i.product?.image || product?.image || "",
                };
            })
            );
        }
        } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
        }
    };
    fetchOrder();
    }, [id, products]);


  // Tổng tiền
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Xử lý đổi sản phẩm
  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id == productId);
    const updated = [...orderItems];
    if (product) {
      updated[index] = {
        ...updated[index],
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      };
    } else {
      updated[index] = { product_id: "", name: "", price: 0, image: "", quantity: 1 };
    }
    setOrderItems(updated);
  };

  // Đổi số lượng
  const handleQuantityChange = (index: number, quantity: number) => {
    const updated = [...orderItems];
    updated[index].quantity = quantity;
    setOrderItems(updated);
  };

  // Thêm / xóa sản phẩm
  const addProductRow = () =>
    setOrderItems([
      ...orderItems,
      { product_id: "", name: "", price: 0, quantity: 1, image: "" },
    ]);
  const removeProductRow = (index: number) =>
    setOrderItems(orderItems.filter((_, i) => i !== index));

  // Cập nhật đơn hàng
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod || !status) {
      alert("Vui lòng chọn trạng thái và phương thức thanh toán!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/update/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            customer_name: student.full_name,
            class: student.class,
            phone: student.phone,
            order_date: new Date().toISOString().split("T")[0],
            status: status,
            payment_method: paymentMethod,
            total: total,
            products: orderItems
              .filter((item) => item.product_id)
              .map((item) => ({
                id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                subtotal : item.quantity * item.price
              })),
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        alert("Cập nhật đơn hàng thành công!");
        router.push("/admin/order");
      } else {
        alert(data.message || "Lỗi khi cập nhật đơn hàng!");
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Không thể kết nối server!");
    }
  };

  if (!user) return null;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Taskbar />
        <div className="p-6 flex-1 overflow-auto">
          <form onSubmit={handleUpdate} className="space-y-6 bg-white shadow p-6 rounded-xl">
            {/* Thông tin sinh viên */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Thông tin sinh viên</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Họ và tên sinh viên"
                  value={student.full_name}
                  onChange={(e) => setStudent({ ...student, full_name: e.target.value })}
                  className="border px-3 py-2 rounded w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Lớp"
                  value={student.class}
                  onChange={(e) => setStudent({ ...student, class: e.target.value })}
                  className="border px-3 py-2 rounded w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={student.phone}
                  onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                  className="border px-3 py-2 rounded w-full"
                  required
                />
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Danh sách sản phẩm</h2>
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-4 border p-4 rounded-xl mb-4 bg-gray-50"
                >
                  <select
                    value={item.product_id}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="border px-3 py-2 rounded w-full md:w-1/3"
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    className="border px-3 py-2 rounded w-full md:w-1/6"
                  />

                  {item.name && (
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/no-image.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">{item.price.toLocaleString()}₫</p>
                      </div>
                    </div>
                  )}

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeProductRow(index)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addProductRow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Thêm sản phẩm
              </button>
            </div>

            {/* Thanh toán & Trạng thái */}
            <div className="flex gap-4">
              <div className="flex-1">
                <select
                  id="payment_method"
                  name="payment_method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
                >
                  <option value="">Phương thức thanh toán</option>
                  <option value="cash">Thanh toán trực tiếp</option>
                  <option value="bank">Chuyển khoản</option>
                </select>
              </div>

              <div className="flex-1">
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
                >
                  <option value="">Trạng thái đơn hàng</option>
                  <option value="pending">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="canceled">Đã hủy</option>
                </select>
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="text-right text-lg font-semibold text-gray-800">
              TỔNG TIỀN:{" "}
              <span className="text-green-600">{total.toLocaleString()}₫</span>
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Lưu thay đổi
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
