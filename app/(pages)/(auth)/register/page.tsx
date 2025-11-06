"use client";
import Link from "next/link";
import FormRegister from "./FormRegister";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 tracking-tight">
          Đăng ký tài khoản
        </h1>

        {/* Form đăng ký */}
        <FormRegister />

        {/* Footer: Đã có tài khoản? */}
        <div className="mt-5 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline transition-colors duration-200"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}