/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import Image from "next/image";


export default function FormCreateUser() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Preview ảnh khi chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    if (!formRef.current) return;

    const validator = new JustValidate(formRef.current, {
      errorFieldCssClass: "border-red-500",
      errorLabelCssClass: "text-red-500 text-sm mt-1 block",
      focusInvalidField: true,
      validateBeforeSubmitting: true,
    });

    validator
      .addField("#name", [
        { rule: "required", errorMessage: "Vui lòng nhập tên!" },
        { rule: "maxLength", value: 200, errorMessage: "Tên không vượt quá 200 ký tự!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Vui lòng nhập email!" },
        { rule: "email", errorMessage: "Email không hợp lệ!" },
      ])
      .addField("#password", [
        { rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" },
        { rule: "minLength", value: 6, errorMessage: "Mật khẩu ít nhất 6 ký tự!" },
      ])
      .addField("#role", [{ rule: "required", errorMessage: "Vui lòng chọn quyền!" }])
      .addField("#phone", [
        { rule: "required", errorMessage: "Vui lòng nhập số điện thoại!" },
        {
          rule: "number",
          errorMessage: "Số điện thoại chỉ gồm số",
        },
      ])
      .addField("#address", [{ rule: "required", errorMessage: "Vui lòng nhập địa chỉ!" }])
      .addField("#image", [
        { rule: "required", errorMessage: "Vui lòng chọn ảnh!" },
        {
          rule: "files",
          value: { files: { maxSize: 5 * 1024 * 1024, types: ["image/jpeg", "image/jpg", "image/png", "image/webp"] } },
          errorMessage: "Chỉ chấp nhận ảnh JPG, PNG, WebP ≤ 5MB!",
        },
      ])
      .onSuccess((event: any) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/create`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              alert("Thêm người dùng thành công!");
              router.push("/admin/user");
            } else {
              alert(data.message || "Có lỗi xảy ra!");
            }
          })
          .catch((err) => {
            console.error(err);
            alert("Lỗi kết nối server!");
          });
      });

    return () => {
      validator.destroy();
    };
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-10">
      <form ref={formRef} id="formUser" className="space-y-8" noValidate>

        {/* Tên + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
              placeholder="Nhập tên người dùng"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
              placeholder="Nhập email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-lg font-semibold text-gray-700 mb-2">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Phone + Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-lg font-semibold text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-lg font-semibold text-gray-700 mb-2">
              Quyền <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
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

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-lg font-semibold text-gray-700 mb-2">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
            placeholder="Nhập địa chỉ"
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-2">
            Ảnh đại diện <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full text-lg text-gray-700 file:mr-5 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
          />
          {previewUrl && (
            <div className="mt-4 relative w-48 h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
            </div>
          )}
        </div>

        {/* Nút submit */}
        <div className="flex justify-end pt-4 border-t-2 border-gray-200">
          <button
            type="submit"
            className="px-10 py-3.5 text-lg bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition duration-200 shadow-lg"
          >
            Thêm người dùng
          </button>
        </div>
      </form>
    </div>

  );
}
