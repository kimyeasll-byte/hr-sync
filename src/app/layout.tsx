import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AntigravityCursor from "@/components/AntigravityCursor";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

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
    <html lang="ko" className={jakarta.variable}>
      <body className="antialiased">
        <AntigravityCursor />
        {children}
      </body>
    </html>
  );
}
