/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import { useRole } from "@/hook/useRole";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import Image from "next/image";

export default function EditProductPage() {
  const { user } = useRole(["admin", "product_manager"]);
  const { id } = useParams();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const [product, setProduct] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Load dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data) {
          setProduct(data);
          setPreviewUrl(data.image);
        } else {
          alert("Không tìm thấy sản phẩm!");
          router.push("/admin/product");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi tải dữ liệu!");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  // Preview ảnh mới
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

  // Validation + Submit (PATCH)
  useEffect(() => {
    if (!formRef.current || !product) return;

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
        {
          validator: (value: string) => Number(value) > 0,
          errorMessage: "Giá phải lớn hơn 0!",
        },
      ])
      .addField("#quantity", [
        { rule: "required", errorMessage: "Vui lòng nhập số lượng!" },
        { rule: "number", errorMessage: "Số lượng phải là số!" },
        {
          validator: (value: string) => Number(value) >= 0,
          errorMessage: "Số lượng không được âm!",
        },
      ])
      .addField("#description", [
        { rule: "required", errorMessage: "Vui lòng nhập mô tả!" },
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
          errorMessage: "Chỉ chấp nhận ảnh JPG, PNG, WebP và dung lượng ≤ 5MB!",
        },
      ])
      .onSuccess(async (event: any) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        // Nếu không chọn ảnh mới → gửi tên ảnh cũ
        if (!formData.get("image") || !(formData.get("image") as File).size) {
          formData.delete("image");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/update/${id}`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const data = await res.json();
          if (res.ok && data.data) {
            alert("Cập nhật sản phẩm thành công!");
            router.push("/admin/product");
          } else {
            alert(data.message || "Có lỗi xảy ra!");
          }
        } catch (err) {
          console.error("Lỗi fetch:", err);
          alert("Lỗi kết nối server!");
        }

      });

    return () => validator.destroy();
  }, [product, id, router]);

  if (!user) return null;
  if (isLoading) return <p className="p-8 text-center">Đang tải dữ liệu...</p>;
  if (!product) return null;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto">
        <Taskbar />

        <div className="p-8 flex-1">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sửa sản phẩm</h1>

          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8">
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
                  defaultValue={product.name}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Nhập tên sản phẩm"
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
                    defaultValue={product.price}
                    min="1"
                    step="1000"
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
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
                    defaultValue={product.quantity}
                    min="0"
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
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
                  defaultValue={product.description}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 resize-none"
                  placeholder="Mô tả chi tiết..."
                />
              </div>

              {/* Hình ảnh + Preview */}
              <div>
                <label htmlFor="image" className="block text-lg font-semibold text-gray-700 mb-3">
                  Hình ảnh sản phẩm
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
                      alt="Preview"
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
                  onClick={() => router.push("/admin/product")}
                  className="px-8 py-3.5 text-lg border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-10 py-3.5 text-lg bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
                >
                  Cập nhật sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
