"use client";

import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const FormResetPassword = dynamic(() => import("./FormResetPassword"), { ssr: false });

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 tracking-tight">
          Nhập mật khẩu mới
        </h1>

        <Suspense>
          <FormResetPassword />
        </Suspense>

        <div className="mt-5 text-center text-sm text-gray-600">
          <Link
            href="/otp"
            className="text-blue-600 font-semibold hover:underline transition-colors duration-200"
          >
            ← Quay lại OTP
          </Link>
        </div>
      </div>
    </div>
  );
}
