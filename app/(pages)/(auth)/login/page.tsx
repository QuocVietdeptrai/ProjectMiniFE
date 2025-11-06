"use client";
import Link from "next/link";
import FormLogin from "./FormLogin";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h1>

        <FormLogin />

        {/* Quên mật khẩu + Đăng ký */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link 
            href="/forgotpassword" 
            className="text-blue-600 font-medium hover:underline transition"
          >
            Quên mật khẩu?
          </Link>
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}