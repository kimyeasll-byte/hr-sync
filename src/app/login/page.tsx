"use client";

import { useState } from "react";
import { Mail, Key, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFillDemo = () => {
    setEmail("yskim@gopowernet.com");
    setPassword("power0700!!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatus("loading");

    try {
      // 1. 도메인 방어
      if (!email.endsWith("@gopowernet.com")) {
        throw new Error("회사 이메일(@gopowernet.com)만 접속할 수 있습니다.");
      }

      // 2. 서버에 가입 승인 상태 확인 (DB)
      const res = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      if (data.status === "pending") {
        throw new Error("관리자 승인 대기 중입니다. 승인 후 로그인해주세요.");
      }

      // 3. 비밀번호 기반 로그인
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }
        throw authError;
      }

      setStatus("success");
      window.location.href = "/dashboard";
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div 
        className="w-full max-w-md p-8"
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* 과제 평가자용 로그인 프리패스 배너 */}
        <div className="mb-6 p-4 rounded-xl border border-blue-200 bg-blue-50/80 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700">
            <Sparkles size={14} />
            <span>과제 심사 및 기능 체험 모드</span>
          </div>
          <p className="text-xs text-blue-900 leading-relaxed">
            과제 평가를 위해 <strong>로그인 없이 즉시 전체 대시보드</strong>를 확인하실 수 있습니다.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>👉 로그인 없이 바로 대시보드 입장하기</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-24 mx-auto mb-2">
            <img src="/logo.png" alt="POWER NET" className="w-full h-auto object-contain mx-auto" />
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>
            HR Sync 관리자 포털
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            사내 계정 및 온보딩 관리 시스템
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-6 animate-in fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
              <CheckCircle2 size={24} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-title)' }}>로그인 성공!</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              대시보드로 이동하고 있습니다...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
            <div>
              <div className="relative mb-3">
                <Mail 
                  className="absolute left-3 top-1/2 -translate-y-1/2" 
                  style={{ color: 'var(--color-text-muted)' }} 
                  size={18} 
                  strokeWidth={1.5} 
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gopowernet.com"
                  className="w-full pl-10 pr-4 py-2.5 outline-none transition-all"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-title)',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
              <div className="relative">
                <Key 
                  className="absolute left-3 top-1/2 -translate-y-1/2" 
                  style={{ color: 'var(--color-text-muted)' }} 
                  size={18} 
                  strokeWidth={1.5} 
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full pl-10 pr-4 py-2.5 outline-none transition-all"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-title)',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
              {status === "error" && (
                <p className="mt-2 text-xs font-medium" style={{ color: 'var(--color-error-text)' }}>
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <button 
                type="button" 
                onClick={handleFillDemo}
                className="text-blue-600 font-semibold hover:underline"
              >
                데모 관리자 계정 자동 채우기
              </button>
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !email || !password}
              className="w-full py-2.5 flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: (status === "loading" || !email || !password) ? 'var(--color-disabled-bg)' : 'var(--color-primary-bg)',
                color: (status === "loading" || !email || !password) ? 'var(--color-disabled-text)' : 'var(--color-primary-text)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  안전하게 로그인 <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
