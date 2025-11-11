// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-auth`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          // router.push("/login");
          throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (data.data?.code === "error") {
          alert(data.message || "Lỗi xác thực!");
          router.push("/login");
        } else if (data.data?.code === "success") {
          alert("Đăng nhập thành công!");
          console.log(data);
          setLoading(false);
          router.push("/admin/dashboard");
        } else {
          router.push("/login");
        }
      })
      .catch((error) => {
        console.error("Auth check failed:", error);
        router.push("/login");
      });
  }, [router]);

  return { loading };
}
