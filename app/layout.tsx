import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProjectMini",
  description: "Trang quản trị học sinh, sản phẩm và đơn hàng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
