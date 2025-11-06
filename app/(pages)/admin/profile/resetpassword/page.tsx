/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Sidebar from "@/app/component/Sidebar";
import Taskbar from "@/app/component/Taskbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import JustValidate from "just-validate";

export default function FormResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // có thể bỏ nếu không dùng

  useEffect(() => {
    const validator = new JustValidate("#formResetPassword");

    validator
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập mật khẩu mới!",
        },
        {
          rule: "minLength",
          value: 6,
          errorMessage: "Mật khẩu phải có ít nhất 6 ký tự!",
        },
      ])
      .addField("#password_confirmation", [
        {
          rule: "required",
          errorMessage: "Vui lòng xác nhận mật khẩu!",
        },
        {
          validator: (value: string, fields: Record<string, any>) => {
            const pass = (fields["#password"]?.elem as HTMLInputElement).value;
            return value === pass;
          },
          errorMessage: "Mật khẩu xác nhận không khớp!",
        },
      ])
      .onSuccess((event: any) => {
        event.preventDefault();
        const password = event.target.password.value;
        const password_confirmation = event.target.password_confirmation.value;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/update_password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // <-- gửi cookie JWT như update_profile
          body: JSON.stringify({ password, password_confirmation }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "error") {
              alert(data.message);
            }
            if (data.code === "success") {
              alert("Đổi mật khẩu thành công!");
              router.push("/admin/profile");
            }
          })
          .catch(() => {
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
          });
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-auto bg-white">
        <Taskbar />

        <div className="flex-1 flex justify-center items-start p-6">
          <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Đặt lại mật khẩu
            </h2>

            <form id="formResetPassword" className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium text-sm mb-1">
                  Mật khẩu mới *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-gray-700 font-medium text-sm mb-1">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                className="bg-[#0088FF] text-white rounded-[4px] w-full h-[48px] px-[20px] font-[700] text-[16px] hover:bg-[#006edc] transition-all duration-300"
              >
                Đặt lại mật khẩu
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
