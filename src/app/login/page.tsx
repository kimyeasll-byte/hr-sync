"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "pending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. 도메인 1차 방어
    if (!email.endsWith("@gopowernet.com")) {
      setStatus("error");
      setErrorMessage("회사 이메일(@gopowernet.com)만 접속할 수 있습니다.");
      return;
    }

    setStatus("loading");

    try {
      // 2. 서버에 가입 승인 상태 확인 (DB 통신)
      const res = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // 3. 미승인 상태면 대기 화면 표시
      if (data.status === "pending") {
        setStatus("pending");
        return;
      }

      // 4. 승인된 사용자면 Supabase Magic Link 발송
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (authError) throw authError;

      // 발송 성공 화면 표시
      setStatus("sent");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "오류가 발생했습니다. 다시 시도해주세요.");
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
            담당자 인증을 위해 회사 이메일을 입력해주세요.
          </p>
        </div>

        {status === "pending" ? (
          <div className="text-center py-6 animate-in fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: 'var(--color-progress-bg)', color: 'var(--color-progress-text)' }}>
              <Clock size={24} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-title)' }}>가입 승인 대기 중</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              최초 접속 시 관리자의 승인이 필요합니다.<br/>
              인사팀 리더에게 시스템 접근 승인을 요청해주세요.
            </p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-bold underline transition-colors hover:opacity-70"
              style={{ color: 'var(--color-text-muted)' }}
            >
              다른 이메일로 시도하기
            </button>
          </div>
        ) : status === "sent" ? (
          <div className="text-center py-6 animate-in fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
              <CheckCircle2 size={24} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-title)' }}>로그인 링크 발송 완료!</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              <strong>{email}</strong> 메일함을 확인해주세요.<br/>
              메일 안의 로그인 링크를 클릭하면 즉시 접속됩니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
            <div>
              <div className="relative">
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
              {status === "error" && (
                <p className="mt-2 text-sm font-medium" style={{ color: 'var(--color-error-text)' }}>
                  {errorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="w-full py-3 flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: (status === "loading" || !email) ? 'var(--color-disabled-bg)' : 'var(--color-primary-bg)',
                color: (status === "loading" || !email) ? 'var(--color-disabled-text)' : 'var(--color-primary-text)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                transition: 'transform var(--transition-fast)'
              }}
              onMouseDown={(e) => {
                if (status !== 'loading' && email) e.currentTarget.style.transform = 'var(--active-scale)';
              }}
              onMouseUp={(e) => {
                if (status !== 'loading' && email) e.currentTarget.style.transform = 'none';
              }}
              onMouseLeave={(e) => {
                if (status !== 'loading' && email) e.currentTarget.style.transform = 'none';
              }}
            >
              {status === "loading" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  로그인 링크 받기 <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
