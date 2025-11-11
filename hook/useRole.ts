// hooks/useRole.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  image?: string;
  created_at?: string;
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
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Network error");

        const data = await res.json();

        // DÙNG data.data.user
        if (data.data?.code === "success" && data.data?.user) {
          setUser(data.data.user);

          if (allowedRoles.length === 0 || allowedRoles.includes(data.data.user.role)) {
            setHasRole(true);
          } else {
            router.push("/unauthorized");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Check auth failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, allowedRoles]);

  return { user, hasRole, loading };
}