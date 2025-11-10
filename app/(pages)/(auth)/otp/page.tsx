"use client";

import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import FormOTP, tắt SSR
const FormOTP = dynamic(() => import("./FormOTP"), { ssr: false });

export default function OtpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 tracking-tight">
          Nhập mã OTP
        </h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Vui lòng nhập mã OTP đã được gửi đến mail của bạn!
        </p>

        {/* Suspense wrap FormOTP */}
        <Suspense>
          <FormOTP />
        </Suspense>

        <div className="mt-5 text-center text-sm text-gray-600">
          <Link
            href="/forgotpassword"
            className="text-blue-600 font-semibold hover:underline transition-colors duration-200"
          >
            ← Quay lại quên mật khẩu
          </Link>
        </div>
      </div>
    </div>
  );
}
