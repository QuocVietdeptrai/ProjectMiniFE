/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import JustValidate from "just-validate";

export default function FormForgotPassword() {
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#formForgotPassword");

    validator
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập email!",
        },
        {
          rule: "email",
          errorMessage: "Email không đúng định dạng!",
        },
      ])
      .onSuccess((event: any) => {
        const email = event.target.email.value;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgotpassword`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "error") {
              alert(data.message);
            }
            if (data.code === "success") {
              router.push(`/otp?email=${email}`);
            }
          })
          .catch(() => {
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
          });
      });
  }, []);

  return (
    <form id="formForgotPassword" className="space-y-5">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium text-sm mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <button
        type="submit"
        className="bg-white border-2 border-[#0088FF] text-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] hover:bg-[#0088FF] hover:text-white transition-all duration-300"
      >
        Gửi yêu cầu
      </button>
    </form>
  );
}