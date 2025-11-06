"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // gọi API /check-auth để check token
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-auth`, {
      method: "GET",
      credentials: "include", // gửi cookie
    })
      .then(async res => {
        if (res.status === 401) {
          router.push("/login"); // chưa login thì quay về login
        } else {
          const data = await res.json();
          if (data.authenticated) {
            setLoading(false);
          } else {
            router.push("/login");
          }
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  return loading; // true nếu đang check
}
