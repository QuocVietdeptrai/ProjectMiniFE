/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function useRole(allowedRoles: string[] = []) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-auth`, {
          credentials: "include", // gửi cookie token
        });

        if (res.status === 401) {
          // chưa login
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (data.code === "success" && data.user) {
          setUser(data.user);

          if (allowedRoles.length === 0 || allowedRoles.includes(data.user.role)) {
            setHasRole(true);
          } else {
            // user không có quyền
            router.push("/unauthorized"); // hoặc /login
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, hasRole, loading };
}
