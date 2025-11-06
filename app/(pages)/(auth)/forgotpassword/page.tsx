"use client";
import Link from "next/link";
import FormForgotPassword from "./FormForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 tracking-tight">
          Quên mật khẩu
        </h1>

        {/* Mô tả */}
        <p className="text-center text-sm text-gray-600 mb-6">
          Nhập email của bạn để nhận OTP đặt lại mật khẩu.
        </p>

        {/* Form */}
        <FormForgotPassword />

        {/* Quay lại đăng nhập */}
        <div className="mt-5 text-center text-sm text-gray-600">
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline transition-colors duration-200"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}