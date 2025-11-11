/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import JustValidate from "just-validate";

export default function FormRegister() {
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#formRegister");

    validator
      .addField('#name', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập họ và tên!',
        },
        {
          rule: 'maxLength',
          value: 200,
          errorMessage: 'Họ và tên không được vượt quá 200 ký tự!',
        },
      ])
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập email!',
        },
        {
          rule: 'email',
          errorMessage: 'Email không đúng định dạng!',
        },
      ])
      .addField('#password', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập mật khẩu!',
        },
        {
          validator: (value: string) => value.length >= 6,
          errorMessage: 'Mật khẩu phải chứa ít nhất 6 ký tự!',
        },
      ])
      .onSuccess((event: any) => {
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = { name, email, password };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify(dataFinal),
        })
          .then(res => res.json())
          .then(data => {
            if (data.data?.code === "error") {
              alert(data.message);
            }
            if (data.data?.code === "success") {
              alert("Đăng ký thành công! Vui lòng đăng nhập.");
              router.push("/login");
            }
          });
      });
  }, []);

  return (
    <form id="formRegister" className="space-y-5">
      {/* Họ và tên */}
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium text-sm mb-1">
          Họ và tên *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nguyễn Văn A"
          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

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

      {/* Mật khẩu */}
      <div>
        <label htmlFor="password" className="block text-gray-700 font-medium text-sm mb-1">
          Mật khẩu *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Nút Đăng ký - TRẮNG, ĐỒNG BỘ VỚI LOGIN */}
      <button
        type="submit"
        className="bg-white border-2 border-[#0088FF] text-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] hover:bg-[#0088FF] hover:text-white transition-all duration-300"
      >
        Đăng ký
      </button>
    </form>
  );
}