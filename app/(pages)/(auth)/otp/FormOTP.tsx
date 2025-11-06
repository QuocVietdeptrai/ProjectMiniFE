/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import JustValidate from "just-validate";

export default function FormOTP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Lấy email từ URL

  useEffect(() => {
    const validator = new JustValidate("#formOTP");

    validator
      .addField("#otp", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập mã OTP!",
        },
        {
          rule: "customRegexp",
          value: /^[0-9]{6}$/,
          errorMessage: "OTP phải gồm 6 chữ số!",
        },
      ])
      .onSuccess((event: any) => {
        const otp = event.target.otp.value;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/otp_password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "error") {
              alert(data.message);
            }
            if (data.code === "success") {
              router.push(`/resetpassword?email=${email}`);
            }
          })
          .catch(() => {
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
          });
      });
  }, []);

  return (
    <form id="formOTP" className="space-y-5">
      {/* OTP */}
      <div>
        <label
          htmlFor="otp"
          className="block text-gray-700 font-medium text-sm mb-1"
        >
          Mã OTP *
        </label>
        <input
          type="text"
          id="otp"
          name="otp"
          placeholder="Nhập mã OTP gồm 6 số"
          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Nút Xác minh OTP */}
      <button
        type="submit"
        className="bg-white border-2 border-[#0088FF] text-[#0088FF] rounded-[4px] w-full h-[48px] px-[20px] font-[700] text-[16px] hover:bg-[#0088FF] hover:text-white transition-all duration-300"
      >
        Xác minh OTP
      </button>
    </form>
  );
}
