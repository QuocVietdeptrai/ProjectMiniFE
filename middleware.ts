
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Lấy cookie token FE gửi lên
    const cookieHeader = request.headers.get("cookie") || "";
    // console.log("Cookie Header:", cookieHeader);
    // console.log("Checking auth for URL:", request.url);

    // Gọi API BE để check token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-auth`, {
      headers: { cookie: cookieHeader },
      credentials: "include",
    });

    const data = await res.json();

    if (data.data?.code === "success") {
      // Token hợp lệ → cho phép truy cập page
      return NextResponse.next();
    } else {
      // Token invalid → redirect về login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    console.error("Error checking auth:", error);
    // Lỗi fetch → redirect về login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*", // tất cả route /admin sẽ bị check token
  ],
};
