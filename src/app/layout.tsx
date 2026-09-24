import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Sync",
  description: "입퇴사자 계정 자동화 처리 및 권한 회수 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
