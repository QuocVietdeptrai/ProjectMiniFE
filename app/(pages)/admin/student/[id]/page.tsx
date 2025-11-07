/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import { useRole } from "@/hook/useRole";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import Image from "next/image";

export default function EditStudentPage() {
  const { user } = useRole(["admin", "teacher", "student_manager"]);
  const { id } = useParams();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const [student, setStudent] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Lấy dữ liệu sinh viên theo ID
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.status === "success" && data.data) {
          setStudent(data.data);
          setPreviewUrl(data.data.avatar);
        } else {
          alert(data.message || "Không tìm thấy sinh viên!");
          router.push("/admin/student");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi tải dữ liệu!");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id, router]);

  // ✅ Preview ảnh khi chọn mới
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

  // ✅ Validation + Submit
  useEffect(() => {
    if (!formRef.current || !student) return;

    const validator = new JustValidate(formRef.current, {
      errorFieldCssClass: "border-red-500",
      errorLabelCssClass: "text-red-500 text-sm mt-1 block",
      focusInvalidField: true,
      validateBeforeSubmitting: true,
    });

    validator
      .addField("#full_name", [
        { rule: "required", errorMessage: "Vui lòng nhập tên sinh viên!" },
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

        // Nếu không chọn ảnh mới thì xoá field image để giữ ảnh cũ
        if (!formData.get("avatar") || !(formData.get("avatar") as File).size) {
          formData.delete("avatar");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/update/${id}`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const data = await res.json();

          if (data.status === "success") {
            alert("Cập nhật sinh viên thành công!");
            router.push("/admin/student");
          } else {
            alert(data.message || "Cập nhật thất bại!");
          }
        } catch (err) {
          console.error(err);
          alert("Lỗi kết nối server!");
        }
      });

    return () => validator.destroy();
  }, [student, id, router]);

  if (!user) return null;
  if (isLoading) return <p className="p-8 text-center">Đang tải dữ liệu...</p>;
  if (!student) return null;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto">
        <Taskbar/>

        <div className="p-8 flex-1">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sửa thông tin sinh viên</h1>

          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8">
            <form ref={formRef} id="formStudent" className="space-y-8" noValidate>
              {/* Họ tên */}
              <div>
                <label htmlFor="full_name" className="block text-lg font-semibold text-gray-700 mb-3">
                  Họ tên sinh viên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  defaultValue={student.full_name}
                  className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Nhập họ tên"
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
                    defaultValue={student.dob}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-lg font-semibold text-gray-700 mb-3">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    defaultValue={student.gender}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
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
                    defaultValue={student.email}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
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
                    defaultValue={student.class}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Ảnh đại diện */}
              <div>
                <label htmlFor="avatar" className="block text-lg font-semibold text-gray-700 mb-3">
                  Ảnh đại diện
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full text-lg text-gray-700 file:mr-5 file:py-4 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-sm text-gray-500 mt-2">Để trống nếu không muốn thay đổi ảnh</p>

                {previewUrl && (
                  <div className="mt-5 relative w-72 h-72 rounded-lg overflow-hidden shadow-lg border-2 border-dashed border-gray-300">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              {/* Nút hành động */}
              <div className="flex gap-6 justify-end pt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/admin/student")}
                  className="px-8 py-3.5 text-lg border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-10 py-3.5 text-lg bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
                >
                  Cập nhật sinh viên
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
