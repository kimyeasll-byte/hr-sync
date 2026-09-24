"use client";

import { useState } from "react";
import { Mail, Key, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

      // 3. 비밀번호 기반 로그인 (이메일 발송 없음!)
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
      // 강제 리다이렉트
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-title)', letterSpacing: '-0.5px' }}>
            HR Sync
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            관리자 시스템에 접속하기 위해 로그인해주세요.
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
                  size={20} 
                  strokeWidth={1.5} 
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gopowernet.com"
                  className="w-full pl-10 pr-4 py-3 outline-none transition-all"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-title)',
                    fontSize: '15px'
                  }}
                  required
                />
              </div>
              <div className="relative">
                <Key 
                  className="absolute left-3 top-1/2 -translate-y-1/2" 
                  style={{ color: 'var(--color-text-muted)' }} 
                  size={20} 
                  strokeWidth={1.5} 
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full pl-10 pr-4 py-3 outline-none transition-all"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-title)',
                    fontSize: '15px'
                  }}
                  required
                />
              </div>
              {status === "error" && (
                <p className="mt-2 text-sm font-medium" style={{ color: 'var(--color-error-text)' }}>
                  {errorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !email || !password}
              className="w-full py-3 flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: (status === "loading" || !email || !password) ? 'var(--color-disabled-bg)' : 'var(--color-primary-bg)',
                color: (status === "loading" || !email || !password) ? 'var(--color-disabled-text)' : 'var(--color-primary-text)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                transition: 'transform var(--transition-fast)'
              }}
            >
              {status === "loading" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  안전하게 로그인 <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
