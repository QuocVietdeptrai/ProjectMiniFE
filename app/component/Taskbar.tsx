/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Taskbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === "success" && data.user) {
          setUser(data.user);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const avatarSrc = user?.image;
  const displayName = user?.name || "User";

  return (
    <header className="flex justify-end items-center bg-white shadow-md px-6 py-4 sticky top-0 z-50 w-full">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/profile"
          className="flex items-center space-x-2 hover:underline"
        >
          <img
            src={avatarSrc}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium text-gray-800">{displayName}</span>
        </Link>
      </div>
    </header>
  );
}
