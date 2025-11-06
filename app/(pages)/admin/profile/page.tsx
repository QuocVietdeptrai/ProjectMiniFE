/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Lưu file avatar khi chọn
  const [avatarPreview, setAvatarPreview] = useState<string>(""); // Hiển thị avatar

  // Lấy user từ API khi load trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.code === "success") {
          const u = data.user;
          setUser(u);
          setForm({
            name: u.name,
            phone: u.phone || "",
            address: u.address || "",
          });
          setAvatarPreview(u.image || "");
        }
      } catch (err) {
        console.error("Lỗi lấy user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update_profile`, {
        method: "POST",
        credentials: "include",
        body: formData, // gửi FormData
      });

      const data = await res.json();
      if (data.code === "success") {
        window.location.reload();
      } else {
        alert("Cập nhật thất bại: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (!user) return <p className="text-center py-12 text-gray-500">Đang tải thông tin...</p>;

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto bg-white">
        <Taskbar/>

        <div className="p-6 flex-1 flex justify-center bg-white">
          <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 flex items-center gap-6 bg-white border-b border-gray-200">
              <label className="cursor-pointer relative">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleAvatarChange}
                />
              </label>
              <div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 font-bold w-48"
                />
                <p className="mt-1 text-gray-600">{user.role}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Số điện thoại</p>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-500">Địa chỉ</p>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleUpdate}
                  className="bg-white border-2 border-[#0088FF] text-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] hover:bg-[#0088FF] hover:text-white transition-all duration-300"
                >
                  Cập nhật thông tin
                </button>
              </div>

              <Link
                href="/admin/profile/resetpassword"
                className="bg-white border-2 border-green-600 text-green-600 rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                Đổi mật khẩu
              </Link>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
