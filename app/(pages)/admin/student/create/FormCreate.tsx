/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import Image from "next/image";

export default function FormCreateStudent() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
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
      .addField("#full_name", [
        { rule: "required", errorMessage: "Vui lòng nhập tên sinh viên!" },
        { rule: "maxLength", value: 200, errorMessage: "Tên không vượt quá 200 ký tự!" },
      ])
      .addField("#dob", [
        { rule: "required", errorMessage: "Vui lòng nhập ngày sinh!" },
      ])
      .addField("#gender", [
        { rule: "required", errorMessage: "Vui lòng chọn giới tính!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Vui lòng nhập email!" },
        { rule: "email", errorMessage: "Email không hợp lệ!" },
      ])
      .addField("#class", [
        { rule: "required", errorMessage: "Vui lòng nhập lớp!" },
      ])
      .addField("#avatar", [
        {
          rule: "required",
          errorMessage: "Vui lòng chọn hình ảnh!",
        },
        {
          rule: "files",
          value: {
            files: {
              maxSize: 5 * 1024 * 1024,
              types: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
            },
          },
          errorMessage: "Chỉ chấp nhận ảnh JPG, PNG, WebP và dung lượng ≤ 5MB!",
        },
      ])
      .onSuccess((event: any) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/create`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "success") {
              alert("Thêm sinh viên thành công!");
              router.push("/admin/student");
            } else {
              alert(data.message || "Có lỗi xảy ra!");
            }
          })
      });

    return () => validator.destroy();
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-10">
      <form ref={formRef} id="formStudent" className="space-y-8" noValidate>
        {/* Tên sinh viên */}
        <div>
          <label htmlFor="full_name" className="block text-lg font-semibold text-gray-700 mb-3">
            Tên sinh viên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Nhập tên sinh viên"
          />
        </div>

        {/* Ngày sinh & Giới tính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="dob" className="block text-lg font-semibold text-gray-700 mb-3">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-lg font-semibold text-gray-700 mb-3">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
            id="gender"
            name="gender"
            className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
            >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
            </select>
          </div>
        </div>

        {/* Email & Lớp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-3">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
              placeholder="Ví dụ: nguyenvana@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="class" className="block text-lg font-semibold text-gray-700 mb-3">
              Lớp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="class"
              name="class"
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
              placeholder="Ví dụ: 73DCTT25"
            />
          </div>
        </div>

        {/* Hình ảnh */}
        <div>
          <label htmlFor="avatar" className="block text-lg font-semibold text-gray-700 mb-3">
            Ảnh đại diện sinh viên <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full text-lg text-gray-700 file:mr-5 file:py-4 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-2">Chấp nhận: JPG, PNG, WebP • Tối đa 5MB</p>

          {previewUrl && (
            <div className="mt-5 relative w-72 h-72 rounded-lg overflow-hidden shadow-lg border-2 border-dashed border-gray-300">
              <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex gap-6 justify-end pt-8 border-t-2 border-gray-200">
          <button
            type="submit"
            className="px-10 py-3.5 text-lg bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            Thêm sinh viên
          </button>
        </div>
      </form>
    </div>
  );
}
