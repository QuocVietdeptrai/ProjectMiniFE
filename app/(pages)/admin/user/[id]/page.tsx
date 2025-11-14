/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import { useRole } from "@/hook/useRole";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import Image from "next/image";

export default function EditUserPage() {
  const { user } = useRole(["admin", "product_manager", "student_manager", "order_manager"]);
  const { id } = useParams();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const [userData, setUserData] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data) {
          setUserData(data);
          setPreviewUrl(data.image || data.image_url || "");
        } else {
          alert(data.message);
          router.push("/admin/user");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi tải dữ liệu!");
      }
    };

    if (id) fetchUser();
  }, [id, router]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    if (!formRef.current || !userData) return;

    const validator = new JustValidate(formRef.current, {
      errorFieldCssClass: "border-red-500",
      errorLabelCssClass: "text-red-500 text-sm mt-1 block",
      focusInvalidField: true,
      validateBeforeSubmitting: true,
    });

    validator
      .addField("#name", [
        { rule: "required", errorMessage: "Vui lòng nhập tên!" },
        { rule: "maxLength", value: 200, errorMessage: "Tên không quá 200 ký tự!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Vui lòng nhập email!" },
        { rule: "email", errorMessage: "Email không hợp lệ!" },
      ])
      .addField("#phone", [
        { rule: "required", errorMessage: "Vui lòng nhập số điện thoại!" },
        { rule: "number", errorMessage: "Chỉ được nhập số!" },
      ])
      .addField("#address", [
        { rule: "required", errorMessage: "Vui lòng nhập địa chỉ!" },
      ])
      .addField("#role", [
        { rule: "required", errorMessage: "Vui lòng chọn quyền!" },
      ])
      .addField("#status", [
        { rule: "required", errorMessage: "Vui lòng chọn trạng thái!" },
      ])
      .addField("#image", [
        {
          rule: "files",
          value: {
            files: {
              maxSize: 5 * 1024 * 1024,
              types: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
            },
          },
          errorMessage: "Ảnh ≤ 5MB, chỉ chấp nhận JPG, PNG, WebP!",
        },
      ])
      .onSuccess(async (event: any) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);


        const imageFile = formData.get("image") as File;
        if (!imageFile || !imageFile.size) {
          formData.delete("image");
        }


        const password = formData.get("password") as string;
        if (!password?.trim()) {
          formData.delete("password");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update/${id}`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const data = await res.json();

          if (data.status === "success") {
            alert("Cập nhật người dùng thành công!");
            router.push("/admin/user");
          } else {
            alert(data.message || "Cập nhật thất bại!");
          }
        } catch (err) {
          console.error(err);
          alert("Lỗi kết nối server!");
        }
      });

    return () => validator.destroy();
  }, [userData, id, router]);

  // === 4. RENDER ===
  if (!user) return null;
  if (!userData) return null;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto">
        <Taskbar />

        <div className="p-8 flex-1">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sửa người dùng</h1>

          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8">
            <form ref={formRef} className="space-y-8" noValidate>
              {/* Tên + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-3">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={userData.name}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                    placeholder="Nhập tên"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-3">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={userData.email}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                    placeholder="Nhập email"
                  />
                </div>
              </div>

              {/* Mật khẩu + Trạng thái */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-3">
                    Mật khẩu <span className="text-gray-500 text-sm">(Để trống nếu không đổi)</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-lg font-semibold text-gray-700 mb-3">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={userData.status}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Số điện thoại + Quyền */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="phone" className="block text-lg font-semibold text-gray-700 mb-3">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    defaultValue={userData.phone}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-lg font-semibold text-gray-700 mb-3">
                    Quyền <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    defaultValue={userData.role}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                  >
                    <option value="">Chọn quyền</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="product_manager">Quản lý sản phẩm</option>
                    <option value="student_manager">Quản lý sinh viên</option>
                    <option value="order_manager">Quản lý đơn hàng</option>
                  </select>
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <label htmlFor="address" className="block text-lg font-semibold text-gray-700 mb-3">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={userData.address}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              {/* Ảnh đại diện */}
              <div>
                <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-3">
                  Ảnh đại diện
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full text-lg text-gray-700 file:mr-5 file:py-4 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-sm text-gray-500 mt-2">Để trống nếu không muốn thay đổi ảnh</p>

                {previewUrl && (
                  <div className="mt-5 relative w-72 h-72 rounded-lg overflow-hidden shadow-lg border-2 border-dashed border-gray-300">
                    <Image
                      src={previewUrl}
                      alt="Preview ảnh đại diện"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              {/* Nút hành động */}
              <div className="flex gap-6 justify-end pt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/admin/user")}
                  className="px-8 py-3.5 text-lg border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-10 py-3.5 text-lg bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
                >
                  Cập nhật người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}