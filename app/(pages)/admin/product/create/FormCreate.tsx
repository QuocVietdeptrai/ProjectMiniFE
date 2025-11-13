/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import Image from "next/image";

export default function FormCreateProduct() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Xử lý preview khi chọn file
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
        { rule: "required", errorMessage: "Vui lòng nhập tên sản phẩm!" },
        { rule: "maxLength", value: 200, errorMessage: "Tên không vượt quá 200 ký tự!" },
      ])
      .addField("#price", [
        { rule: "required", errorMessage: "Vui lòng nhập giá!" },
        { rule: "number", errorMessage: "Giá phải là số!" },
        { validator: (value: string) => Number(value) > 0, errorMessage: "Giá phải lớn hơn 0!" },
      ])
      .addField("#quantity", [
        { rule: "required", errorMessage: "Vui lòng nhập số lượng!" },
        { rule: "number", errorMessage: "Số lượng phải là số!" },
        { validator: (value: string) => Number(value) >= 0, errorMessage: "Số lượng không được âm!" },
      ])
      .addField("#description", [{ rule: "required", errorMessage: "Vui lòng nhập mô tả!" }])
      .addField("#image", [
        { rule: "required", errorMessage: "Vui lòng chọn hình ảnh!" },
        {
          rule: "files",
          value: { files: { maxSize: 5 * 1024 * 1024, types: ["image/jpeg", "image/jpg", "image/png", "image/webp"] } },
          errorMessage: "Chỉ chấp nhận ảnh JPG, PNG, WebP và dung lượng ≤ 5MB!",
        },
      ])
      .onSuccess((event: any) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/create`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.data) {
              alert("Thêm sản phẩm thành công!");
              router.push("/admin/product");
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
      <form ref={formRef} id="formProduct" className="space-y-8" noValidate>
        {/* Tên sản phẩm */}
        <div>
          <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-3">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Nhập tên sản phẩm (tối đa 200 ký tự)"
          />
        </div>

        {/* Giá & Số lượng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="price" className="block text-lg font-semibold text-gray-700 mb-3">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="1"
              step="1000"
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
              placeholder="Ví dụ: 250000"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-lg font-semibold text-gray-700 mb-3">
              Số lượng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200"
              placeholder="Ví dụ: 50"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-3">
            Mô tả sản phẩm <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 transition duration-200 resize-none"
            placeholder="Mô tả chi tiết về sản phẩm..."
          />
        </div>

        {/* Hình ảnh */}
        <div>
          <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-3">
            Hình ảnh sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="image"
            name="image"
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
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
