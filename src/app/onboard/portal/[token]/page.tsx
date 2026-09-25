"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Circle,
  Upload,
  Camera,
  FileText,
  IdCard,
  Send,
  Loader2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Coffee,
  Heart,
  Briefcase,
  Laptop
} from "lucide-react";

interface EmployeeInfo {
  id: string;
  name: string;
  department: string;
  status: string;
  target_date: string;
  created_at: string;
}

const CHECKLIST_ITEMS = [
  {
    id: "id_card",
    title: "본인 신분증 지참",
    description: "주민등록증 또는 운전면허증 (본인 확인 및 근로계약 체결용)",
    category: "필수 서류"
  },
  {
    id: "bank_book",
    title: "급여 계좌 통장 사본",
    description: "급여 입금용 본인 명의 계좌 통장 사본 (모바일 뱅킹 캡처본 가능)",
    category: "필수 서류"
  },
  {
    id: "graduation",
    title: "최종 학력 증명서",
    description: "대학/대학원 졸업증명서 또는 학위증 사본",
    category: "필수 서류"
  },
  {
    id: "dress_code",
    title: "첫날 복장 가이드 확인",
    description: "단정하고 편안한 비즈니스 캐주얼 (자유롭고 쾌적한 출근 룩)",
    category: "안내 확인"
  },
  {
    id: "lunch_guide",
    title: "첫날 웰컴 런치 안내 확인",
    description: "첫 출근일 점심은 부서 멘토 및 팀원들과의 환영 식사가 준비되어 있습니다.",
    category: "안내 확인"
  }
];

export default function NewHirePortalPage() {
  const params = useParams();
  const token = params?.token as string;

  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 셀프 체크리스트 상태
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  
  // 사원증 사진 업로드 상태
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 근무 사업장 선택 (수원 / 서울)
  const [selectedLocation, setSelectedLocation] = useState<"suwon" | "seoul">("suwon");

  // 입사 한마디 / 메모
  const [welcomeNote, setWelcomeNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 1. 입사자 정보 조회
  useEffect(() => {
    if (!token) return;

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/portal/${token}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "입사자 정보를 불러올 수 없습니다.");
        }

        setEmployee(data.employee);

        // 로컬스토리지에서 기존 작성 내역 복원
        const savedChecklist = localStorage.getItem(`pwn_portal_checklist_${data.employee.id}`);
        if (savedChecklist) {
          try { setChecklist(JSON.parse(savedChecklist)); } catch (e) {}
        }

        const savedPhoto = localStorage.getItem(`pwn_portal_photo_${data.employee.id}`);
        if (savedPhoto) {
          setPhotoPreview(savedPhoto);
        }

        const savedNote = localStorage.getItem(`pwn_portal_note_${data.employee.id}`);
        if (savedNote) {
          setWelcomeNote(savedNote);
        }

      } catch (err: any) {
        console.error("Portal fetch error:", err);
        setError(err.message || "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [token]);

  // 체크리스트 토글
  const handleToggleCheck = (itemId: string) => {
    const updated = { ...checklist, [itemId]: !checklist[itemId] };
    setChecklist(updated);
    if (employee) {
      localStorage.setItem(`pwn_portal_checklist_${employee.id}`, JSON.stringify(updated));
    }
  };

  // 사진 업로드 핸들러
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 최대 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      alert("사진 파일 용량은 5MB 이하로 업로드해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      if (employee) {
        localStorage.setItem(`pwn_portal_photo_${employee.id}`, result);
      }
    };
    reader.readAsDataURL(file);
  };

  // 최종 제출 핸들러
  const handleSubmitPortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setSubmitting(true);
    try {
      const completedCount = Object.values(checklist).filter(Boolean).length;
      const res = await fetch(`/api/portal/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist,
          photoData: photoPreview ? "UPLOADED" : "NONE",
          welcomeNote,
          completedCount,
          totalCount: CHECKLIST_ITEMS.length
        })
      });

      if (!res.ok) {
        throw new Error("제출 중 오류가 발생했습니다.");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert(err.message || "제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // D-Day 계산
  const getDDay = () => {
    if (!employee?.target_date) return { text: "D-Day", diff: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(employee.target_date);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return { text: `D-${diffDays}일`, diff: diffDays };
    if (diffDays === 0) return { text: "첫 출근 D-Day! 🎉", diff: 0 };
    return { text: `입사 D+${Math.abs(diffDays)}일차`, diff: diffDays };
  };

  const dDay = getDDay();
  const completedCheckCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCheckCount / CHECKLIST_ITEMS.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
        <Loader2 size={36} className="text-[#0071E3] animate-spin mb-3" />
        <p className="text-sm font-semibold text-[#1D1D1F]">신입사원 온보딩 정보를 준비하고 있습니다...</p>
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
          <h2 className="text-xl font-bold text-[#1D1D1F]">온보딩 링크를 확인할 수 없습니다</h2>
          <p className="text-sm text-[#86868B] leading-relaxed">
            {error || "접근 링크가 올바르지 않거나 유효 기간이 만료되었습니다. 인사기획팀에 문의해주세요."}
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
            <div className="w-7 h-7 rounded-lg bg-[#0071E3] text-white font-black text-xs flex items-center justify-center shadow-xs">
              PW
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#1D1D1F] tracking-tight">POWERNET</span>
              <span className="text-[10px] text-[#0071E3] font-bold ml-1.5 px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                신입사원 온보딩
              </span>
            </div>
          </div>
          <a
            href="tel:02-3282-0700"
            className="flex items-center gap-1 text-xs font-semibold text-[#86868B] hover:text-[#0071E3] transition-colors"
          >
            <Phone size={13} /> 문의: 02-3282-0700
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        
        {/* 제출 완료 축하 배너 */}
        {submitted && (
          <div className="p-6 bg-[#EAF8EE] border border-[#B7EB8F] rounded-3xl text-center space-y-2 animate-in fade-in zoom-in duration-200 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1E8E3E] text-white flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-base font-bold text-[#1E8E3E]">
              온보딩 체크 및 사진 제출이 완료되었습니다! 🎉
            </h3>
            <p className="text-xs text-[#2E7D32] leading-relaxed">
              작성하신 사전 준비 내역과 사원증 사진이 인사기획팀에 안전하게 접수되었습니다. <br />
              {employee.target_date} 첫 출근일에 뵙겠습니다!
            </p>
          </div>
        )}

        {/* 2. 웰컴 히어로 카드 */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5EA] shadow-card space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0071E3] bg-[#EBF5FF] px-2.5 py-1 rounded-full mb-2">
                <Sparkles size={13} />
                Welcome to Powernet!
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight leading-tight">
                반갑습니다, <br />
                <span className="text-[#0071E3]">{employee.name}</span> 님!
              </h1>
              <p className="text-xs sm:text-sm text-[#86868B] mt-1.5">
                (주)파워넷의 새로운 여정에 합류하신 것을 진심으로 환영합니다.
              </p>
            </div>

            {/* D-Day 뱃지 */}
            <div className="text-right shrink-0">
              <div className="px-3.5 py-1.5 rounded-2xl bg-[#0071E3] text-white font-extrabold text-sm sm:text-base shadow-sm">
                {dDay.text}
              </div>
              <div className="text-[11px] text-[#86868B] font-medium mt-1">
                출근 예정일
              </div>
            </div>
          </div>

          {/* 소속 및 첫 출근 일시 메타 박스 */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F5F5F7] text-xs">
            <div>
              <span className="text-[#86868B] block mb-0.5">발령 소속 부서</span>
              <strong className="text-[#1D1D1F] font-bold text-sm">{employee.department}</strong>
            </div>
            <div>
              <span className="text-[#86868B] block mb-0.5">첫 출근 일시</span>
              <strong className="text-[#1D1D1F] font-bold text-sm">
                {employee.target_date || "출근일 조율 중"} (오전 9:00)
              </strong>
            </div>
          </div>

          {/* 준비 진척도 프로그레스 바 */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#1D1D1F] flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#0071E3]" />
                첫 출근 사전 준비 진척도
              </span>
              <span className="text-[#0071E3]">{completedCheckCount} / {CHECKLIST_ITEMS.length} 완료 ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-[#E5E5EA] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0071E3] to-[#42A5F5] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* 3. 첫 출근 길안내 & 사업장 위치 (Map & Location) */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5EA] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-[#0071E3]">
                <MapPin size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1D1D1F]">첫 출근 오시는 길</h2>
                <p className="text-[11px] text-[#86868B]">배정된 근무 사업장의 위치를 확인하세요.</p>
              </div>
            </div>

            {/* 사업장 토글 버튼 */}
            <div className="flex items-center p-1 bg-[#F5F5F7] rounded-xl text-xs font-bold border border-[#E5E5EA]">
              <button
                type="button"
                onClick={() => setSelectedLocation("suwon")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedLocation === "suwon"
                    ? "bg-white text-[#1D1D1F] shadow-xs"
                    : "text-[#86868B] hover:text-[#1D1D1F]"
                }`}
              >
                수원 사업장
              </button>
              <button
                type="button"
                onClick={() => setSelectedLocation("seoul")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedLocation === "seoul"
                    ? "bg-white text-[#1D1D1F] shadow-xs"
                    : "text-[#86868B] hover:text-[#1D1D1F]"
                }`}
              >
                서울 사업장
              </button>
            </div>
          </div>

          {/* 사업장 주소 상세 정보 카드 */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E5EA] space-y-3 text-xs">
            {selectedLocation === "suwon" ? (
              <>
                <div>
                  <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wide">본사 / 수원 연구소</span>
                  <p className="font-bold text-sm text-[#1D1D1F] mt-0.5">
                    경기 수원시 영통구 신원로250번길 13, 현대테라타워영통 A동 1403호
                  </p>
                </div>
                <div className="text-[#86868B] space-y-1 text-[11px] leading-relaxed">
                  <div>🚗 <strong>주차 안내:</strong> 현대테라타워 지하 1층~지하 3층 방문객 주차 (입사 첫날 로비 도착 후 무료 등록)</div>
                  <div>🚇 <strong>대중교통:</strong> 수인분당선 망포역/영통역에서 버스 10분, 도보 약 15분</div>
                  <div>📍 <strong>도착 장소:</strong> A동 14층 1403호 경영지원실 총무팀 접수대</div>
                </div>
                <div className="flex gap-2 pt-1">
                  <a
                    href="https://map.kakao.com/?q=현대테라타워영통"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 text-center rounded-xl bg-yellow-400 text-neutral-900 font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-1"
                  >
                    카카오맵 길찾기 <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://map.naver.com/v5/search/현대테라타워영통"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 text-center rounded-xl bg-[#03C75A] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                  >
                    네이버지도 길찾기 <ExternalLink size={12} />
                  </a>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wide">서울 사업장</span>
                  <p className="font-bold text-sm text-[#1D1D1F] mt-0.5">
                    서울시 금천구 두산로 70, B동 17층 (현대지식산업센터)
                  </p>
                </div>
                <div className="text-[#86868B] space-y-1 text-[11px] leading-relaxed">
                  <div>🚗 <strong>주차 안내:</strong> 현대지식산업센터 지하 고객 주차장</div>
                  <div>🚇 <strong>대중교통:</strong> 1호선 독산역 1번 출구 도보 8분</div>
                  <div>📍 <strong>도착 장소:</strong> B동 17층 파워넷 안내 데스크</div>
                </div>
                <div className="flex gap-2 pt-1">
                  <a
                    href="https://map.kakao.com/?q=서울시+금천구+두산로+70"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 text-center rounded-xl bg-yellow-400 text-neutral-900 font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-1"
                  >
                    카카오맵 길찾기 <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://map.naver.com/v5/search/서울시+금천구+두산로+70"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 text-center rounded-xl bg-[#03C75A] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                  >
                    네이버지도 길찾기 <ExternalLink size={12} />
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 4. 첫 출근 준비물 체크리스트 */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5EA] shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#1E8E3E]">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">첫 출근 준비물 체크리스트</h2>
              <p className="text-[11px] text-[#86868B]">항목을 터치하여 준비 완료 여부를 체크해보세요.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = !!checklist[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-[#F8F9FA] border-[#E5E5EA] hover:border-neutral-300"
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 shrink-0 transition-colors ${
                      isChecked ? "text-[#1E8E3E]" : "text-neutral-300"
                    }`}
                  >
                    {isChecked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-neutral-200/60 text-neutral-600">
                        {item.category}
                      </span>
                      <h4 className={`text-xs font-bold ${isChecked ? "line-through text-neutral-400" : "text-[#1D1D1F]"}`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#86868B] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. 사원증 & 스마트 보안 출입카드 사진 제출 */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5EA] shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <IdCard size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">사원증 & 에스원 출입증 사진 등록</h2>
              <p className="text-[11px] text-[#86868B]">사원증에 인쇄될 증명사진(또는 단정한 정면 셀카)을 올려주세요.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* 사원증 카드 시뮬레이터 */}
            <div className="w-full max-w-[240px] mx-auto bg-gradient-to-b from-[#0A192F] to-[#172A45] rounded-2xl p-4 text-white shadow-lg border border-neutral-700 text-center relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <span className="font-extrabold text-[10px] tracking-wider text-blue-400">POWERNET</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">S1 SECURITY PASS</span>
              </div>

              {/* 사진 영역 */}
              <div className="w-24 h-32 mx-auto rounded-xl bg-neutral-800 border-2 border-white/20 overflow-hidden flex items-center justify-center mb-3 shadow-inner">
                {photoPreview ? (
                  <img src={photoPreview} alt="사원증 증명사진" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-neutral-400">
                    <Camera size={24} className="mx-auto mb-1 opacity-60" />
                    <span className="text-[10px] block">사진 등록 필요</span>
                  </div>
                )}
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-sm tracking-tight">{employee.name}</div>
                <div className="text-[10px] text-neutral-300">{employee.department}</div>
              </div>
            </div>

            {/* 업로드 컨트롤 */}
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-2xl border border-dashed border-[#0071E3] bg-[#EBF5FF] text-[#0071E3] font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors shadow-xs"
              >
                <Upload size={16} /> 사진 선택 또는 카메라 촬영
              </button>

              <div className="text-[11px] text-[#86868B] leading-relaxed space-y-1">
                <div>• 여권용/반명함판 규격 증명사진 권장</div>
                <div>• 깔끔한 배경의 정면 상반신 셀카도 가능</div>
                <div>• 등록 즉시 인사기획팀 사원증 발주 시스템에 전달됩니다.</div>
              </div>

              {photoPreview && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1E8E3E] text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> 사진이 정상 등록되었습니다!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6. 첫날 타임라인 (Day 1 Schedule) */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5EA] shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">첫날 하루 일정 미리보기</h2>
              <p className="text-[11px] text-[#86868B]">출근 첫날 어떤 순서로 하루가 진행되는지 안내해 드립니다.</p>
            </div>
          </div>

          <div className="space-y-3 pl-2 border-l-2 border-[#E5E5EA] ml-2">
            {[
              { time: "09:00 ~ 09:30", title: "총무팀 안내 데스크 도착 & 웰컴 키트 수령", desc: "파워넷 다이어리, 사무용품 세트 및 출입 안내" },
              { time: "09:30 ~ 10:30", title: "배정 자리 안내 & 업무용 PC/노트북 부팅", desc: "초기 포맷 완료된 업무용 PC 확인 및 사내 자리 배선 점검" },
              { time: "10:30 ~ 11:30", title: "그룹웨어 & ERP 계정 로그인 및 기본 OJT", desc: "사내 시스템 초기 패스워드 변경 및 보안 규정 서약" },
              { time: "11:30 ~ 13:00", title: "팀 웰컴 런치 (환영 점심 식사)", desc: "부서 멘토(사수) 및 팀원들과의 맛있는 환영 점심 (회사 전액 지원)" },
              { time: "13:00 ~ 17:30", title: "1:1 사수 멘토링 및 부서 첫 업무 오리엔테이션", desc: "담당 업무 파악 및 편안한 첫날 적응 시간" }
            ].map((step, idx) => (
              <div key={idx} className="relative pl-5">
                <div className="absolute -left-[11px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#0071E3]" />
                <div className="text-[11px] font-bold text-[#0071E3]">{step.time}</div>
                <div className="text-xs font-bold text-[#1D1D1F] mt-0.5">{step.title}</div>
                <div className="text-[11px] text-[#86868B] mt-0.5">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. 입사 소감 작성 & 최종 제출 폼 */}
        <form onSubmit={handleSubmitPortal} className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E5EA] shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0071E3]">
              <Send size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">입사 각오 & 인사팀 전달 메시지</h2>
              <p className="text-[11px] text-[#86868B]">첫 출근을 앞둔 소감이나 궁금한 점을 적어주시면 큰 힘이 됩니다.</p>
            </div>
          </div>

          <textarea
            rows={3}
            value={welcomeNote}
            onChange={(e) => {
              setWelcomeNote(e.target.value);
              if (employee) {
                localStorage.setItem(`pwn_portal_note_${employee.id}`, e.target.value);
              }
            }}
            placeholder="예: 파워넷에 합류하게 되어 기쁩니다! 첫날 밝은 모습으로 출근하겠습니다."
            className="w-full p-3.5 text-xs rounded-2xl border border-[#E5E5EA] bg-[#F8F9FA] outline-none resize-none transition-all focus:border-[#0071E3] focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-[#0071E3] hover:bg-[#0051A3] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> 접수 처리 중...
                </>
              ) : (
                <>
                  <Send size={16} /> 온보딩 준비 완료 전송하기
                </>
              )}
            </button>
            <p className="text-[11px] text-[#86868B] text-center mt-2">
              전송 시 체크리스트 진행 내역과 증명사진이 인사기획팀에 즉시 공유됩니다.
            </p>
          </div>
        </form>

        {/* 8. 푸터 정보 */}
        <footer className="text-center pt-6 space-y-1.5 text-xs text-[#86868B]">
          <div className="font-bold text-[#1D1D1F]">(주)파워넷 경영지원실 인사기획팀</div>
          <div>대표전화: 02-3282-0700 · 수원: 02-3282-0700 · 서울: 02-3282-0752</div>
          <div className="text-[11px] text-[#AEAEC2] pt-2">
            © 2026 POWERNET Co., Ltd. All Rights Reserved.
          </div>
        </footer>

      </main>
    </div>
  );
}
