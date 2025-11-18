/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FormLogin() {
    const router = useRouter();

    useEffect(() => {
        const validator = new JustValidate("#loginForm");

        validator
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
                const email = event.target.email.value;
                const password = event.target.password.value;

                const dataFinal = {
                    email: email,
                    password: password
                };

                fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataFinal),
                    credentials: "include",
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === "error") {
                            alert(data.message);
                        }

                        if (data.code === "success") {
                            // console.log(data);
                            // alert("Đăng nhập thành công!");
                            // console.log(data);
                            router.push("/admin/dashboard");
                        }
                    });
            });
    }, []);

    return (
        <>
            <form id="loginForm" action="" className="grid grid-cols-1 gap-y-[15px]">
                <div className="">
                    <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-[#0088FF] focus:border-transparent"
                    />
                </div>
                <div className="">
                    <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
                        Mật khẩu *
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-[#0088FF] focus:border-transparent"
                    />
                </div>
                <div className="">
                    <button
                        type="submit"
                        className="bg-white border-2 border-[#0088FF] text-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] hover:bg-[#0088FF] hover:text-white transition-all duration-300"
                    >
                        Đăng nhập
                    </button>
                </div>
            </form>
        </>
    );
}