/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import JustValidate from "just-validate";

export default function FormResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const validator = new JustValidate("#formResetPassword");

    validator
      .addField("#password", [
        { rule: "required", errorMessage: "Vui lòng nhập mật khẩu mới!", },
        { rule: "minLength", value: 6, errorMessage: "Mật khẩu phải có ít nhất 6 ký tự!", },])

      .addField("#password_confirmation", [
        { rule: "required", errorMessage: "Vui lòng xác nhận mật khẩu!", },
        { validator: (value: string, fields: Record<string, any>) => { const pass = (fields["#password"]?.elem as HTMLInputElement).value; return value === pass; }, errorMessage: "Mật khẩu xác nhận không khớp!", },])
      .onSuccess((event: any) => {
        const password = event.target.password.value;
        const password_confirmation = event.target.password_confirmation.value;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset_password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, password_confirmation }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.data?.code === "success") {
              alert("Đặt lại mật khẩu thành công!");
              router.push("/login");
            } else alert(data.data.message);
          })
          .catch(() => alert("Đã có lỗi xảy ra. Vui lòng thử lại."));
      });
  }, [email, router]);

  return (
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
  );
}
