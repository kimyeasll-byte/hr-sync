"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  BookOpen, 
  Zap, 
  UserCheck, 
  Laptop, 
  UserMinus, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Smartphone, 
  ShieldCheck, 
  Printer, 
  HeartHandshake,
  Layers,
  ChevronRight
} from "lucide-react";

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserManualModal({ isOpen, onClose }: UserManualModalProps) {
  const [activeManualTab, setActiveManualTab] = useState<"quick" | "admin" | "user">("quick");
  const [dontShowToday, setDontShowToday] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowToday) {
      const today = new Date().toISOString().split("T")[0];
      try {
        localStorage.setItem("powernet_hide_manual_today", today);
      } catch (e) {}
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border bg-white overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-neutral-900">
                  (주)파워넷 HR Sync - 사용자 & 관리자 매뉴얼
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  과제 심사용 가이드
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                올인원 엔터프라이즈 인사/계정 자동화 시스템 핵심 기능을 빠르게 파악하실 수 있습니다.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b bg-neutral-50/70 overflow-x-auto">
          <button
            onClick={() => setActiveManualTab("quick")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeManualTab === "quick"
                ? "border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Zap size={14} className={activeManualTab === "quick" ? "text-amber-500 fill-amber-500" : ""} />
            <span>⚡ 30초 핵심 체험 코스 (Quick Tour)</span>
          </button>

          <button
            onClick={() => setActiveManualTab("admin")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeManualTab === "admin"
                ? "border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <UserCheck size={14} />
            <span>👨‍💼 관리자 운영 매뉴얼</span>
          </button>

          <button
            onClick={() => setActiveManualTab("user")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeManualTab === "user"
                ? "border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Smartphone size={14} />
            <span>📱 신입사원 모바일 포털 가이드</span>
          </button>
        </div>

        {/* 본문 콘텐츠 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-neutral-700 leading-relaxed">
          
          {/* ============================================================== */}
          {/* 탭 1: 30초 핵심 체험 코스 (Quick Tour) */}
          {/* ============================================================== */}
          {activeManualTab === "quick" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                💡 <strong>과제 평가 팁:</strong> 아래 6단계 순서대로 클릭해보시면 HR Sync의 모든 엔터프라이즈 자동화 파이프라인을 3분 안에 완벽히 체감하실 수 있습니다!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Step 1 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-neutral-900 text-xs">원터치 입사 자동화 체험</h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    우측 상단 <strong>[🚀 연구소 HW개발]</strong> 프리셋 버튼 클릭 ➔ <strong>[⚡ 원터치 입사 자동화 일괄 실행]</strong> 클릭 ➔ 5단계 실시간 프로비저닝 완료 확인!
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-neutral-900 text-xs">신입사원 모바일 포털 체험</h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    입사 완료 카드의 <strong>[📱 모바일 포털 바로 열기]</strong> 클릭 ➔ D-Day, 제휴 사진관(패밀리포토하우스) 네이버지도, 사원증 촬영, 12대 복리후생 탐색 후 <strong>[온보딩 준비 전송하기]</strong> 클릭!
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-neutral-900 text-xs">관리자 실시간 접수 & 원본 사진 다운</h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    <strong>[온보딩 여정 (D-Day)]</strong> 서브 탭 ➔ 좌측 입사자 선택 ➔ 신입사원이 보낸 사원증 사진과 각오 확인 후 <strong>[사원증 원본 사진 다운로드]</strong>(에스원 발주용) 클릭!
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <h4 className="font-bold text-neutral-900 text-xs">회차별 펄스 서베이 & AI 피플 분석</h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    온보딩 상세 뷰의 <strong>[AI 피플 애널리틱스]</strong> 확인 (1M/3M/6M/1Y 회차별 질문, 위험 지수, 🚨 Red/Yellow Flag 신호 및 AI 맞춤 실행 권고안 확인)!
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">5</span>
                    <h4 className="font-bold text-neutral-900 text-xs">IT 자산 대장 엑셀 일괄 등록</h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    상단 <strong>[IT 자산 관리]</strong> 탭 이동 ➔ <strong>[📥 엑셀 표준 서식 다운로드]</strong> 및 <strong>[📤 엑셀 일괄 등록]</strong> 드래그앤드롭 유효성 검사 미리보기 확인!
                  </p>
                </div>

                {/* Step 6 */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">6</span>
                    <h4 className="font-bold text-neutral-900 text-xs">원터치 퇴사 처리 & A4 확인서 출력</h4>
                  </div>
                  <p className="text-xs text-neutral-600">
                    상단 <strong>[퇴사자 권한 회수]</strong> 탭 ➔ 직원 선택 ➔ <strong>[🚨 원터치 종합 퇴사 즉시 실행]</strong> 클릭 (계정 차단 + 자산 일괄 반납) ➔ <strong>[🖨️ ITGC 퇴사 확인서(A4) 즉시 인쇄]</strong> 클릭!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 탭 2: 관리자 운영 매뉴얼 */}
          {/* ============================================================== */}
          {activeManualTab === "admin" && (
            <div className="space-y-5 text-xs">
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Zap size={16} className="text-blue-600" />
                  1. 원터치 종합 입사 자동화 (One-Touch Onboarding 5-in-1)
                </h4>
                <p className="text-neutral-600 leading-relaxed">
                  인사담당자가 신입사원 성명과 부서, 출근일을 입력하고 실행 버튼을 누르면 <strong>(1) ERP/다우오피스 계정 및 사번 발급, (2) 부서 맞춤 IT 장비 3종(노트북, 모니터, 출입증) 자동 배정 및 고정 IP 채번, (3) 사전 준비 체크리스트 4종 자동 완료, (4) 모바일 포털 링크 및 웰컴 메일 발송, (5) ITGC 감사 로그 영구 기록</strong>이 1초 만에 일괄 완료됩니다.
                </p>
              </section>

              <section className="space-y-2 border-t pt-4">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <UserCheck size={16} className="text-purple-600" />
                  2. 온보딩 여정 관리 & 7단계 수평 타임라인 스테퍼
                </h4>
                <p className="text-neutral-600 leading-relaxed">
                  D-7(사전준비)부터 D-Day(출근), D+7(1주차), D+30(1개월), D+90(3개월), D+180(6개월), D+365(1년 안착)까지의 전체 라이프사이클을 수평 타임라인 바에서 직관적으로 모니터링할 수 있습니다. 경과일에 따라 현재 단계가 펄싱 링으로 자동 표시됩니다.
                </p>
              </section>

              <section className="space-y-2 border-t pt-4">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-600" />
                  3. AI 조기퇴사 위험 신호(Flag) 분석 & 피플 애널리틱스
                </h4>
                <p className="text-neutral-600 leading-relaxed">
                  신입사원이 응답한 회차별 설문 점수와 주관식 텍스트를 감성 분석하여 조기 퇴사 위험도를 3단계(🚨 Red / ⚠️ Yellow / ✨ Green)로 자동 판정합니다. Red Flag 발생 시 <strong>[1:1 긴급 케어 면담 예약]</strong>을 1클릭으로 실행할 수 있습니다.
                </p>
              </section>

              <section className="space-y-2 border-t pt-4">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Laptop size={16} className="text-emerald-600" />
                  4. IT 자산 대장 및 엑셀 일괄 등록 (Bulk Import)
                </h4>
                <p className="text-neutral-600 leading-relaxed">
                  사내 PC, 모니터, 고정 IP, MAC, 에스원 카드 자산을 관리합니다. UTF-8 BOM 지원 표준 CSV 템플릿 다운로드와 파일 드래그앤드롭을 통한 실시간 데이터 유효성 검사 및 일괄 등록을 지원합니다.
                </p>
              </section>

              <section className="space-y-2 border-t pt-4">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <UserMinus size={16} className="text-rose-600" />
                  5. 원터치 종합 퇴사 권한 회수 및 자산 정산
                </h4>
                <p className="text-neutral-600 leading-relaxed">
                  퇴사자 선택 시 보유 IT 자산이 실시간 테이블로 표시되며, <strong>[원터치 퇴사 즉시 실행]</strong> 클릭 한 번으로 모든 계정 세션 즉시 만료 + 대여 IT 자산 100% 반납(RETURNED) + 에스원 출입 권한 폐기 + ITGC 공식 퇴사 확인서가 즉시 발급됩니다.
                </p>
              </section>
            </div>
          )}

          {/* ============================================================== */}
          {/* 탭 3: 신입사원 모바일 포털 가이드 */}
          {/* ============================================================== */}
          {activeManualTab === "user" && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
                📱 <strong>신입사원 전용 화면 (`/onboard/portal/[token]`):</strong> 첫 출근 전 개인 스마트폰으로 접속하여 첫날 준비물을 챙기고 사원증 사진을 접수하는 모바일 웹입니다.
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-bold text-neutral-900">① 첫 출근 카운트다운 & 사업장 길안내</div>
                  <div className="text-neutral-600">출근 D-Day 확인, 수원 영통 사업장 / 서울 가산 본사의 네이버/카카오 지도 길찾기 및 주차 안내 확인.</div>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-bold text-neutral-900">② 사원증 지정 사진관(패밀리포토하우스) 네이버 지도 연동</div>
                  <div className="text-neutral-600">공식 제휴 스튜디오 위치 확인 및 "사진 촬영 후 실물 사원증 제작까지 약 2주 소요되며, 그동안 임시 출입증이 지급됩니다" 사전 안내 제공.</div>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-bold text-neutral-900">③ 사원증 프로필 사진 촬영 및 목걸이형 시뮬레이터</div>
                  <div className="text-neutral-600">스마트폰 카메라로 사진 촬영 또는 업로드 시 실물 사원증 시뮬레이터로 출력 시안 즉시 확인.</div>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-bold text-neutral-900">④ 5대 필수 서류/준비물 체크리스트 & 12대 복리후생 가이드 탐색</div>
                  <div className="text-neutral-600">주민등록등본, 통장 사본 등 서류 체크 및 생활안정, 건강검진, 자기개발 등 파워넷만의 복리후생 확인.</div>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-bold text-neutral-900">⑤ 입사 각오 작성 및 [온보딩 준비 전송하기]</div>
                  <div className="text-neutral-600">전송 즉시 관리자 대시보드에 프로필 사진 원본과 각오 메시지가 실시간 동기화되어 에스원 사원증 발주가 진행됩니다.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 푸터 액션바 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3.5 border-t bg-neutral-50/90">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-600 font-medium">
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
              className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>오늘 하루 동안 이 팝업 다시 보지 않기</span>
          </label>

          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            대시보드 둘러보기 (닫기)
          </button>
        </div>
      </div>
    </div>
  );
}
