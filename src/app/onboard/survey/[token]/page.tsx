"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Sparkles,
  HeartPulse,
  Briefcase,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  ArrowLeft,
  Phone,
  ShieldCheck,
  Calendar,
  Gift
} from "lucide-react";

interface EmployeeInfo {
  id: string;
  name: string;
  department: string;
  status: string;
  target_date: string;
  created_at: string;
}

type SurveyStageKey = "MONTH_1" | "MONTH_3" | "MONTH_6" | "YEAR_1";

const STAGE_CONFIG: Record<SurveyStageKey, {
  label: string;
  sublabel: string;
  title: string;
  description: string;
  dDayText: string;
  badgeColor: string;
}> = {
  MONTH_1: {
    label: "1개월차",
    sublabel: "D+30",
    title: "입사 1개월차 조직 적응도 펄스 서베이",
    description: "파워넷 합류 첫 한 달! 팀 분위기, 담당 업무 난이도, 장비 지원에 대한 솔직한 생각을 들려주세요.",
    dDayText: "입사 1개월차 안착 점검",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
  },
  MONTH_3: {
    label: "3개월차",
    sublabel: "D+90",
    title: "수습 3개월차 온보딩 피드백 서베이",
    description: "수습 기간을 마무리하며 업무 수행 만족도와 사내 협업 환경에 대한 의견을 나누어주세요.",
    dDayText: "3개월차 수습 평가",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
  },
  MONTH_6: {
    label: "6개월차",
    sublabel: "D+180",
    title: "입사 6개월차 직무 몰입 & 성장 서베이",
    description: "어느덧 반 년! 담당 직무에 대한 몰입도와 앞으로의 성장 방향성에 대해 들려주세요.",
    dDayText: "반기 직무 몰입 점검",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  YEAR_1: {
    label: "1년차 (1주년)",
    sublabel: "D+365",
    title: "입사 1주년 안착 & 직무 리텐션 서베이",
    description: "파워넷과 함께한 빛나는 1주년을 축하드립니다! 파워넷에서의 1년간의 소회와 제안을 적어주세요.",
    dDayText: "입사 1주년 안착 진단",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200"
  }
};

function SurveyContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params?.token as string;
  const initialStage = (searchParams?.get("stage") as SurveyStageKey) || "MONTH_1";

  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 선택된 설문 회차
  const [stage, setStage] = useState<SurveyStageKey>(
    ["MONTH_1", "MONTH_3", "MONTH_6", "YEAR_1"].includes(initialStage) ? initialStage : "MONTH_1"
  );

  // 3문항 점수 (1~5)
  const [workScore, setWorkScore] = useState<number>(4);
  const [teamScore, setTeamScore] = useState<number>(5);
  const [equipScore, setEquipScore] = useState<number>(4);
  const [feedbackText, setFeedbackText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  // 1. 직원 정보 및 기존 설문 결과 로드
  useEffect(() => {
    if (!token) return;

    const fetchInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/portal/${token}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "입사자 정보를 불러올 수 없습니다.");
        }

        setEmployee(data.employee);

        // 기존 설문 내역 확인
        try {
          const sRes = await fetch(`/api/onboarding/survey?empId=${data.employee.id}`);
          if (sRes.ok) {
            const sData = await sRes.json();
            if (sData.success && sData.survey) {
              setSubmittedResult(sData.survey);
              if (sData.survey.analysis?.scores) {
                setWorkScore(sData.survey.analysis.scores.workScore || 4);
                setTeamScore(sData.survey.analysis.scores.teamScore || 5);
                setEquipScore(sData.survey.analysis.scores.equipScore || 4);
              }
              if (sData.survey.feedbackText) {
                setFeedbackText(sData.survey.feedbackText);
              }
              if (sData.survey.stage && STAGE_CONFIG[sData.survey.stage as SurveyStageKey]) {
                setStage(sData.survey.stage as SurveyStageKey);
              }
            }
          }
        } catch (e) {
          console.error("Survey check error:", e);
        }

      } catch (err: any) {
        setError(err.message || "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [token]);

  // 설문 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          stage,
          workScore,
          teamScore,
          equipScore,
          feedbackText
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "설문 등록 중 오류가 발생했습니다.");
      }

      setSubmittedResult(data.payload);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert(err.message || "설문 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentConfig = STAGE_CONFIG[stage];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
        <Loader2 size={36} className="text-[#0071E3] animate-spin mb-3" />
        <p className="text-sm font-semibold text-[#1D1D1F]">신입사원 펄스 서베이를 불러오고 있습니다...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E5E5EA] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-[#1D1D1F]">설문 링크를 확인할 수 없습니다</h2>
          <p className="text-sm text-[#86868B] leading-relaxed">
            {error || "접근 링크가 올바르지 않거나 만료되었습니다. 인사기획팀에 문의해주세요."}
          </p>
          <div className="pt-2">
            <a
              href="tel:02-3282-0700"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0071E3] text-white text-sm font-bold shadow-sm hover:bg-[#0051A3] transition-colors"
            >
              <Phone size={15} /> 인사기획팀 문의하기 (02-3282-0700)
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased pb-20">
      
      {/* 1. 상단 글로벌 헤더 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E5E5EA] px-4 py-3.5 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#5856D6] text-white font-black text-xs flex items-center justify-center shadow-xs">
              PW
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#1D1D1F] tracking-tight">POWERNET</span>
              <span className="text-[10px] text-[#5856D6] font-bold ml-1.5 px-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">
                피플 애널리틱스 펄스 서베이
              </span>
            </div>
          </div>
          <a
            href={`/onboard/portal/${token}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#86868B] hover:text-[#0071E3] transition-colors"
          >
            <ArrowLeft size={13} /> 온보딩 포털
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        
        {/* 제출 완료 피드백 배너 */}
        {submittedResult && (
          <div className="p-6 bg-[#EAF8EE] border border-[#B7EB8F] rounded-3xl text-center space-y-3 animate-in fade-in zoom-in duration-200 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1E8E3E] text-white flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-base font-bold text-[#1E8E3E]">
              {employee.name} 님의 펄스 서베이가 성공적으로 접수되었습니다! 🎉
            </h3>
            <p className="text-xs text-[#2E7D32] leading-relaxed">
              설문 응답이 인사기획팀 피플 애널리틱스 대시보드에 안전하게 반영되었습니다. <br />
              AI 분석 결과는 인사팀의 맞춤 1:1 케어 및 근무 환경 개선에 활용됩니다.
            </p>
            {submittedResult.analysis && (
              <div className="p-3.5 rounded-2xl bg-white/80 border border-emerald-200 text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800 flex items-center gap-1">
                    <Sparkles size={13} className="text-emerald-600" /> AI 조직 적응도 진단 결과:
                  </span>
                  <span className="font-extrabold text-[#1E8E3E]">
                    {submittedResult.analysis.flagTitle}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  "{submittedResult.analysis.aiDiagnosis}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* 2. 설문 히어로 안내 카드 */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5EA] shadow-card space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5856D6] bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
                <HeartPulse size={13} />
                People Analytics Micro Survey
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] tracking-tight leading-snug">
                {currentConfig.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#86868B] mt-1.5 leading-relaxed">
                {currentConfig.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="px-3 py-1 rounded-2xl bg-[#5856D6] text-white font-extrabold text-xs sm:text-sm shadow-xs">
                {currentConfig.label}
              </div>
              <div className="text-[10px] text-[#86868B] font-medium mt-1">
                {currentConfig.sublabel}
              </div>
            </div>
          </div>

          {/* 대상자 정보 박스 */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F5F5F7] text-xs">
            <div>
              <span className="text-[#86868B] block mb-0.5">성명 / 소속</span>
              <strong className="text-[#1D1D1F] font-bold">{employee.name} ({employee.department})</strong>
            </div>
            <div>
              <span className="text-[#86868B] block mb-0.5">입사일</span>
              <strong className="text-[#1D1D1F] font-bold">{employee.target_date || "확인 중"}</strong>
            </div>
          </div>

          {/* 설문 회차 선택 탭 (1개월, 3개월, 6개월, 1년) */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-neutral-500 block">설문 참여 회차 선택:</span>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA]">
              {(["MONTH_1", "MONTH_3", "MONTH_6", "YEAR_1"] as SurveyStageKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setStage(k)}
                  className={`py-2 px-1 text-center rounded-xl transition-all font-bold text-xs ${
                    stage === k
                      ? "bg-white text-[#5856D6] shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <span className="block">{STAGE_CONFIG[k].label}</span>
                  <span className="text-[9px] font-normal text-neutral-400 block">{STAGE_CONFIG[k].sublabel}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. 3문항 초간단 설문 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5EA] shadow-card space-y-5">
          <div className="border-b border-[#E5E5EA] pb-3">
            <h2 className="text-base font-bold text-[#1D1D1F]">
              솔직한 생각을 3개 문항으로 들려주세요 (약 3분 소요)
            </h2>
            <p className="text-[11px] text-[#86868B] mt-0.5">
              응답 내용은 안전하게 보호되며, 근무 만족도를 높이기 위한 맞춤 케어에만 활용됩니다.
            </p>
          </div>

          {/* 문항 1: 업무 난이도 */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E5EA] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Briefcase size={14} className="text-[#0071E3]" />
                1. 현재 담당하고 계신 업무의 난이도와 양은 적절한가요?
              </label>
              <span className="text-[11px] font-bold text-[#0071E3]">{workScore}점 / 5점</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { score: 1, emoji: "😫", label: "과부하" },
                { score: 2, emoji: "🙁", label: "부담됨" },
                { score: 3, emoji: "😐", label: "보통" },
                { score: 4, emoji: "😃", label: "수월함" },
                { score: 5, emoji: "😍", label: "매우적절" },
              ].map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => setWorkScore(item.score)}
                  className={`py-2 px-1 rounded-xl text-center transition-all border flex flex-col items-center gap-0.5 ${
                    workScore === item.score
                      ? "bg-[#0071E3] text-white border-[#0071E3] shadow-xs scale-102"
                      : "bg-white text-[#1D1D1F] border-[#E5E5EA] hover:border-neutral-300"
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 문항 2: 팀 분위기 & 소통 */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E5EA] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <HeartPulse size={14} className="text-rose-500" />
                2. 팀원 및 사수(멘토)와의 소통과 조직 분위기는 편안한가요?
              </label>
              <span className="text-[11px] font-bold text-[#0071E3]">{teamScore}점 / 5점</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { score: 1, emoji: "😫", label: "고립감" },
                { score: 2, emoji: "🙁", label: "어색함" },
                { score: 3, emoji: "😐", label: "무난함" },
                { score: 4, emoji: "😃", label: "화기애애" },
                { score: 5, emoji: "😍", label: "최고팀워크" },
              ].map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => setTeamScore(item.score)}
                  className={`py-2 px-1 rounded-xl text-center transition-all border flex flex-col items-center gap-0.5 ${
                    teamScore === item.score
                      ? "bg-[#0071E3] text-white border-[#0071E3] shadow-xs scale-102"
                      : "bg-white text-[#1D1D1F] border-[#E5E5EA] hover:border-neutral-300"
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 문항 3: 필요 장비 및 인프라 */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E5EA] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Laptop size={14} className="text-[#5856D6]" />
                3. 업무에 필요한 IT 장비, 소프트웨어, 인프라 지원이 충분한가요?
              </label>
              <span className="text-[11px] font-bold text-[#0071E3]">{equipScore}점 / 5점</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { score: 1, emoji: "😫", label: "심각부족" },
                { score: 2, emoji: "🙁", label: "일부불편" },
                { score: 3, emoji: "😐", label: "기본충족" },
                { score: 4, emoji: "😃", label: "쾌적지원" },
                { score: 5, emoji: "😍", label: "완벽지원" },
              ].map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => setEquipScore(item.score)}
                  className={`py-2 px-1 rounded-xl text-center transition-all border flex flex-col items-center gap-0.5 ${
                    equipScore === item.score
                      ? "bg-[#0071E3] text-white border-[#0071E3] shadow-xs scale-102"
                      : "bg-white text-[#1D1D1F] border-[#E5E5EA] hover:border-neutral-300"
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 주관식 추가 의견 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F] flex items-center justify-between">
              <span>💬 인사팀 또는 사수(멘토)에게 바라는 점이나 애로사항 (선택사항)</span>
              <span className="text-[10px] text-[#86868B] font-normal">AI 심층 키워드 분석 지원</span>
            </label>
            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="예: 업무 방향성에 대한 멘토링이 더 필요합니다 / 팀 분위기가 매우 편안하고 만족스럽습니다 / 추가 모니터 지급을 요청드립니다."
              className="w-full p-3.5 text-xs rounded-2xl border border-[#E5E5EA] bg-[#F8F9FA] outline-none resize-none transition-all focus:border-[#5856D6] focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-[#5856D6] hover:bg-[#4745C4] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> AI 분석 및 설문 등록 중...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> {STAGE_CONFIG[stage].label} 펄스 서베이 제출하기
                </>
              )}
            </button>
            <p className="text-[11px] text-[#86868B] text-center mt-2">
              제출 즉시 AI 피플 애널리틱스 엔진이 분석을 수행하여 인사팀 대시보드에 공유됩니다.
            </p>
          </div>
        </form>

        {/* 4. 푸터 정보 */}
        <footer className="text-center pt-6 space-y-1.5 text-xs text-[#86868B]">
          <div className="font-bold text-[#1D1D1F]">(주)파워넷 경영지원실 인사기획팀</div>
          <div>대표전화: 02-3282-0700 · 직통: 02-3282-0752</div>
          <div className="text-[11px] text-[#AEAEC2] pt-2">
            © 2026 POWERNET Co., Ltd. All Rights Reserved.
          </div>
        </footer>

      </main>
    </div>
  );
}

export default function NewHirePulseSurveyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <Loader2 size={32} className="text-[#0071E3] animate-spin" />
      </div>
    }>
      <SurveyContent />
    </Suspense>
  );
}
