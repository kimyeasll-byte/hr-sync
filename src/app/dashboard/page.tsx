"use client";
import BusinessCardGenerator from "@/components/BusinessCardGenerator";
import OnboardingJourney from "@/components/OnboardingJourney";
import AssetManagement from "@/components/AssetManagement";
import DocumentPrintModal, { PrintDocumentData } from "@/components/DocumentPrintModal";
import UserManualModal from "@/components/UserManualModal";

import { useState, useEffect, useRef } from "react";
import { 
  UserPlus, 
  UserMinus, 
  Calendar, 
  Briefcase, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  RefreshCw, 
  FileText, 
  IdCard, 
  LogOut, 
  Mail, 
  Laptop, 
  Download, 
  Printer, 
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Check,
  CheckCheck,
  KeyRound,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"onboard" | "journey" | "assets" | "offboard" | "history" | "card">("onboard");
  const isNewHireGroup = activeTab === "onboard" || activeTab === "journey" || activeTab === "card";

  // 사용자 & 관리자 매뉴얼 모달 상태 (접속 시 자동 팝업)
  const [isManualOpen, setIsManualOpen] = useState(false);

  useEffect(() => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const hideDate = localStorage.getItem("powernet_hide_manual_today");
      if (hideDate !== today) {
        setIsManualOpen(true);
      }
    } catch (e) {
      setIsManualOpen(true);
    }
  }, []);

  // Onboarding States
  const [onName, setOnName] = useState("");
  const [onDept, setOnDept] = useState("");
  const [onRank, setOnRank] = useState("");
  const [onRole, setOnRole] = useState("");
  const [onLocation, setOnLocation] = useState<'seoul' | 'suwon'>('suwon');
  const [onDate, setOnDate] = useState("");
  const [onEmail, setOnEmail] = useState("");
  const [onStatus, setOnStatus] = useState<"idle" | "loading" | "in_progress" | "completed" | "error">("idle");
  const [onErrorMessage, setOnErrorMessage] = useState("");
  const [onTaskId, setOnTaskId] = useState<string | null>(null);

  // One-Touch Onboarding Execution Console State
  const [onStep, setOnStep] = useState<number>(0);
  const [onResultData, setOnResultData] = useState<{
    employeeId?: string;
    employeeNumber?: string;
    companyEmail?: string;
    temporaryPassword?: string;
    fixedIp?: string;
    macAddress?: string;
    s1CardNo?: string;
    laptopModel?: string;
    portalUrl?: string;
    fullPortalUrl?: string;
    defaultAssets?: any[];
    auditDocNo?: string;
  } | null>(null);

  // Quick Preset Helper for 1-Click Testing
  const applyPreset = (presetType: 'lab' | 'hr' | 'sales') => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateStr = nextWeek.toISOString().split("T")[0];

    if (presetType === 'lab') {
      setOnName("홍길동");
      setOnDept("전력변환연구소 HW개발팀");
      setOnRank("선임연구원");
      setOnRole("HW 엔지니어");
      setOnLocation("suwon");
      setOnDate(dateStr);
      setOnEmail("imyesir@naver.com");
    } else if (presetType === 'hr') {
      setOnName("김민서");
      setOnDept("경영지원실 인사기획팀");
      setOnRank("대리");
      setOnRole("HR 인사담당");
      setOnLocation("suwon");
      setOnDate(dateStr);
      setOnEmail("imyesir@naver.com");
    } else if (presetType === 'sales') {
      setOnName("박지훈");
      setOnDept("글로벌영업본부 기술영업팀");
      setOnRank("과장");
      setOnRole("해외 기술영업");
      setOnLocation("seoul");
      setOnDate(dateStr);
      setOnEmail("imyesir@naver.com");
    }
  };

  // Offboarding States
  const [offName, setOffName] = useState("");
  const [offDept, setOffDept] = useState("");
  const [offDate, setOffDate] = useState("");
  const [offStatus, setOffStatus] = useState<"idle" | "loading" | "scheduled" | "completed" | "error">("idle");
  const [offErrorMessage, setOffErrorMessage] = useState("");
  const [offStep, setOffStep] = useState<number>(0);
  const [offResultData, setOffResultData] = useState<{
    docNo?: string;
    isImmediate?: boolean;
    returnedAssetCount?: number;
  } | null>(null);
  
  // Offboarding IT Asset Tracking States
  const [offEmpAssets, setOffEmpAssets] = useState<any[]>([]);

  const loadOffEmpAssets = (name: string) => {
    if (typeof window === "undefined" || !name) {
      setOffEmpAssets([]);
      return;
    }
    try {
      const raw = localStorage.getItem("powernet_it_assets");
      if (raw) {
        const all = JSON.parse(raw);
        setOffEmpAssets(all.filter((a: any) => a.empName === name));
      } else {
        setOffEmpAssets([]);
      }
    } catch (e) {
      setOffEmpAssets([]);
    }
  };

  const handleBatchReturnOffAssets = () => {
    if (!offName) return;
    if (!confirm(`${offName} 님의 보유 IT 자산 ${offEmpAssets.length}건을 모두 '반납 완료' 처리하시겠습니까?`)) return;

    const today = new Date().toISOString().split("T")[0];
    try {
      const raw = localStorage.getItem("powernet_it_assets");
      if (raw) {
        const all = JSON.parse(raw);
        const updated = all.map((a: any) => {
          if (a.empName === offName) {
            return { ...a, status: "RETURNED", returnDate: today };
          }
          return a;
        });
        localStorage.setItem("powernet_it_assets", JSON.stringify(updated));
        loadOffEmpAssets(offName);
        alert(`${offName} 님의 보유 IT 자산이 모두 정상 반납 완료 처리되었습니다.`);
      }
    } catch (e) {
      alert("반납 처리 중 오류 발생");
    }
  };

  // Search States (Offboarding)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // History(Log) States
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const logSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [offTaskId, setOffTaskId] = useState<string | null>(null);
  const [cancellingTaskId, setCancellingTaskId] = useState<string | null>(null);

  const handleCancelTask = async (taskId: string, empName: string, taskLabel: string) => {
    if (!confirm(`정말로 ${empName || '직원'} 님의 [${taskLabel}] 작업을 철회하시겠습니까?`)) {
      return;
    }
    setCancellingTaskId(taskId);
    try {
      const res = await fetch('/api/tasks/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || '철회 처리 중 오류가 발생했습니다.');
        return;
      }
      alert(`${empName || '직원'} 님의 [${taskLabel}] 작업이 성공적으로 철회되었습니다.`);
      fetchHistory(logSearchQuery);
    } catch (err) {
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setCancellingTaskId(null);
    }
  };

  const [auditPrintData, setAuditPrintData] = useState<PrintDocumentData | null>(null);

  const handleExportAuditExcel = () => {
    if (!historyData || historyData.length === 0) {
      alert("다운로드할 감사 로그 데이터가 없습니다.");
      return;
    }

    const headers = ["작업 ID", "임직원 성명", "소속 부서", "작업 유형", "처리 상태", "요청/생성 일시", "감사 감사 결과 메시지"];
    const rows = historyData.map((task) => {
      const latestMessage = task.logs && task.logs.length > 0 
        ? [...task.logs].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.result_message 
        : "";
      const taskLabel = task.task_type === 'ONBOARDING' ? '신규 입사 계정 세팅' : '퇴사자 권한 회수';
      const statusLabel = task.status === 'CANCELLED' ? '작업 철회됨' : (task.status === 'COMPLETED' ? '완료' : task.status);
      const createdAt = new Date(task.created_at).toLocaleString();

      return [
        `"${task.id}"`,
        `"${task.employees?.name || ''}"`,
        `"${task.employees?.department || ''}"`,
        `"${taskLabel}"`,
        `"${statusLabel}"`,
        `"${createdAt}"`,
        `"${(latestMessage || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `POWERNET_ITGC_Audit_Log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchEmployees = async (query = "") => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/employees/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!showDropdown) return;
    searchTimeoutRef.current = setTimeout(() => {
      fetchEmployees(searchQuery);
    }, 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery, showDropdown]);

  const fetchHistory = async (nameQuery = "") => {
    setIsHistoryLoading(true);
    try {
      let query = supabase
        .from('tasks')
        .select(`
          id,
          task_type,
          status,
          created_at,
          employees!inner ( name, department ),
          logs ( result_message, created_at )
        `)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (nameQuery.trim() !== "") {
        query = query.ilike('employees.name', `%${nameQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (!error && data) {
        setHistoryData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      if (logSearchTimeoutRef.current) clearTimeout(logSearchTimeoutRef.current);
      logSearchTimeoutRef.current = setTimeout(() => {
        fetchHistory(logSearchQuery);
      }, 300);
    }
    return () => { if (logSearchTimeoutRef.current) clearTimeout(logSearchTimeoutRef.current); };
  }, [activeTab, logSearchQuery]);

  // 원터치 종합 입사 자동화 실행 핸들러
  const handleOneTouchOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnErrorMessage("");
    if (!onName || !onDept || !onDate) {
      setOnStatus("error");
      setOnErrorMessage("입사자 성명, 소속 부서, 출근 예정일을 모두 입력해주세요.");
      return;
    }
    
    setOnStatus("in_progress");
    setOnStep(1);

    try {
      const res = await fetch('/api/onboarding', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          name: onName, 
          department: onDept, 
          targetDate: onDate, 
          email: onEmail,
          rank: onRank,
          role: onRole,
          location: onLocation
        }) 
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '입사 처리 서버 오류');
      }

      const data = await res.json();
      setOnTaskId(data.task?.id || "fallback-id");
      setOnResultData({
        employeeId: data.employee?.id,
        employeeNumber: data.employeeNumber,
        companyEmail: data.companyEmail,
        temporaryPassword: data.temporaryPassword,
        fixedIp: data.fixedIp,
        macAddress: data.macAddress,
        s1CardNo: data.s1CardNo,
        laptopModel: data.laptopModel,
        portalUrl: data.portalUrl,
        fullPortalUrl: data.fullPortalUrl,
        defaultAssets: data.defaultAssets,
        auditDocNo: data.auditDocNo
      });

      // 시각적 단계별 실행 애니메이션 (엔터프라이즈 자동화 체감)
      await new Promise(r => setTimeout(r, 450));
      setOnStep(2);

      // 1. IT 자산 대장에 기본 장비 자동 등록
      if (data.defaultAssets && data.defaultAssets.length > 0) {
        try {
          const raw = localStorage.getItem("powernet_it_assets");
          const existing = raw ? JSON.parse(raw) : [];
          const updated = [...data.defaultAssets, ...existing];
          localStorage.setItem("powernet_it_assets", JSON.stringify(updated));
        } catch (storageErr) {
          console.error(storageErr);
        }
      }

      await new Promise(r => setTimeout(r, 450));
      setOnStep(3);

      // 2. 온보딩 체크리스트의 사전 세팅 항목 자동 완료 처리
      if (data.employee?.id) {
        try {
          const rawCheck = localStorage.getItem("powernet_onboarding_checklists");
          const existingCheck = rawCheck ? JSON.parse(rawCheck) : {};
          const updatedCheck = {
            ...existingCheck,
            [data.employee.id]: {
              ...(existingCheck[data.employee.id] || {}),
              pre_email: true,
              pre_pc: true,
              pre_network: true,
              pre_accounts: true,
              day1_pass_s1: true
            }
          };
          localStorage.setItem("powernet_onboarding_checklists", JSON.stringify(updatedCheck));
        } catch (checkErr) {
          console.error(checkErr);
        }
      }

      await new Promise(r => setTimeout(r, 450));
      setOnStep(4);

      await new Promise(r => setTimeout(r, 450));
      setOnStep(5);

      setOnStatus("completed");
    } catch (error: any) {
      setOnStatus("error"); 
      setOnErrorMessage(error.message || "서버 통신 중 오류가 발생했습니다.");
    }
  };

  // 원터치 종합 퇴사 실행 핸들러 (즉시 실행 or 예약 실행)
  const handleOneTouchOffboard = async (mode: 'IMMEDIATE' | 'SCHEDULED') => {
    if (!offName || !offDept) {
      setOffStatus("error");
      setOffErrorMessage("퇴사 처리할 임직원을 먼저 선택해주세요.");
      return;
    }

    const isImmediate = mode === 'IMMEDIATE';
    const confirmMsg = isImmediate
      ? `🚨 [원터치 종합 퇴사 즉시 실행]\n\n대상: ${offName} (${offDept})\n\n정말로 사내 모든 계정(ERP, 그룹웨어, 메일) 세션을 즉시 차단하고,\n보유 IT 자산 ${offEmpAssets.length}건을 일괄 회수 처리하시겠습니까?`
      : `📅 [퇴사 권한 회수 예약]\n\n대상: ${offName} (${offDept})\n퇴사 예정일: ${offDate || '오늘'}\n\nD+1 일자에 계정이 자동 차단되도록 예약하시겠습니까?`;

    if (!confirm(confirmMsg)) return;

    setOffStatus("loading");
    setOffStep(1);

    try {
      const today = new Date().toISOString().split("T")[0];
      const targetDate = offDate || today;

      const res = await fetch('/api/offboarding', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          name: offName, 
          department: offDept, 
          targetDate: targetDate,
          mode: mode
        }) 
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || '퇴사 처리 서버 오류');
      }

      const data = await res.json();
      setOffTaskId(data.taskId);

      if (isImmediate) {
        await new Promise(r => setTimeout(r, 400));
        setOffStep(2);

        // 보유 IT 자산 일괄 반납 처리 (RETURNED)
        try {
          const raw = localStorage.getItem("powernet_it_assets");
          if (raw) {
            const all = JSON.parse(raw);
            const updated = all.map((a: any) => {
              if (a.empName === offName) {
                return { ...a, status: "RETURNED", returnDate: today };
              }
              return a;
            });
            localStorage.setItem("powernet_it_assets", JSON.stringify(updated));
            loadOffEmpAssets(offName);
          }
        } catch (e) {
          console.error(e);
        }

        await new Promise(r => setTimeout(r, 400));
        setOffStep(3);
        await new Promise(r => setTimeout(r, 400));
        setOffStep(4);
        await new Promise(r => setTimeout(r, 400));
        setOffStep(5);

        setOffResultData({
          docNo: data.docNo,
          isImmediate: true,
          returnedAssetCount: offEmpAssets.length
        });
        setOffStatus("completed");
      } else {
        // 예약 모드: 보유 자산을 반납 대기(PENDING_RETURN)로 설정
        try {
          const raw = localStorage.getItem("powernet_it_assets");
          if (raw) {
            const all = JSON.parse(raw);
            const updated = all.map((a: any) => {
              if (a.empName === offName && a.status === "ACTIVE") {
                return { ...a, status: "PENDING_RETURN" };
              }
              return a;
            });
            localStorage.setItem("powernet_it_assets", JSON.stringify(updated));
            loadOffEmpAssets(offName);
          }
        } catch (e) {}

        setOffResultData({
          docNo: data.docNo,
          isImmediate: false,
          returnedAssetCount: offEmpAssets.length
        });
        setOffStatus("scheduled");
      }
    } catch (error: any) {
      setOffStatus("error"); 
      setOffErrorMessage(error.message || "서버 통신 중 오류가 발생했습니다.");
    }
  };

  const selectEmployee = (emp: any) => {
    setOffName(emp.name);
    setOffDept(emp.department);
    setSearchQuery("");
    setShowDropdown(false);
    loadOffEmpAssets(emp.name);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 w-full max-w-[1920px] mx-auto">
      {/* 파워넷 공식 엔터프라이즈 헤더 */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3.5">
          <div className="w-24 sm:w-28 flex-shrink-0">
            <img src="/logo.png" alt="POWER NET" className="w-full h-auto object-contain" />
          </div>
          <div className="h-6 w-[1px] hidden sm:block" style={{ backgroundColor: 'var(--color-border)' }} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-title)' }}>
                HR Sync
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                원터치 인사 자동화 시스템
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              (주)파워넷 원터치 온보딩 & 오프보딩 통합 관리 포털
            </p>
          </div>
        </div>

        {/* 관리자 프로필 & 매뉴얼 & 로그아웃 */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => setIsManualOpen(true)}
            className="text-xs px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <BookOpen size={13} />
            <span>📖 이용 매뉴얼</span>
          </button>
          <div className="text-right">
            <div className="text-xs font-bold" style={{ color: 'var(--color-text-title)' }}>yskim@gopowernet.com</div>
            <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>인사총괄 관리자 (과제 평가 모드)</div>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="text-xs px-3 py-1.5 rounded border transition-colors font-semibold flex items-center gap-1.5 hover:opacity-80"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-title)'
            }}
          >
            <LogOut size={13} /> 로그아웃
          </button>
        </div>
      </header>

      {/* 1차 대메뉴 네비게이션 바 (Apple Segmented Control Style) */}
      <div className="flex items-center gap-1.5 mb-3 p-1.5 overflow-x-auto rounded-2xl border" 
           style={{ backgroundColor: '#EBEBED', borderColor: 'var(--color-border)', width: 'fit-content' }}>
        
        {/* 대메뉴 1: 신규 입사자 관리 (그룹) */}
        <button
          onClick={() => {
            if (!isNewHireGroup) setActiveTab("onboard");
          }}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all rounded-xl flex items-center gap-2 ${
            isNewHireGroup 
              ? "bg-white text-neutral-900 shadow-sm border border-black/5" 
              : "text-neutral-500 hover:text-neutral-900 hover:bg-white/40"
          }`}
        >
          <UserPlus size={16} className={isNewHireGroup ? "text-blue-600" : "text-neutral-400"} />
          <span>신규 입사자 관리</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            isNewHireGroup ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-neutral-300/60 text-neutral-600"
          }`}>
            3
          </span>
        </button>

        {/* 대메뉴 2: IT 자산 및 비품 관리 */}
        <button
          onClick={() => setActiveTab("assets")}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all rounded-xl flex items-center gap-2 ${
            activeTab === "assets" 
              ? "bg-white text-neutral-900 shadow-sm border border-black/5" 
              : "text-neutral-500 hover:text-neutral-900 hover:bg-white/40"
          }`}
        >
          <Laptop size={16} className={activeTab === "assets" ? "text-blue-600" : "text-neutral-400"} />
          <span>IT 자산 관리</span>
        </button>

        {/* 대메뉴 3: 퇴사자 권한 회수 */}
        <button
          onClick={() => setActiveTab("offboard")}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all rounded-xl flex items-center gap-2 ${
            activeTab === "offboard" 
              ? "bg-white text-neutral-900 shadow-sm border border-black/5" 
              : "text-neutral-500 hover:text-neutral-900 hover:bg-white/40"
          }`}
        >
          <UserMinus size={16} className={activeTab === "offboard" ? "text-red-600" : "text-neutral-400"} />
          <span>퇴사자 권한 회수</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-600 border border-rose-200">
            원터치
          </span>
        </button>

        {/* 대메뉴 4: 감사 로그 */}
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all rounded-xl flex items-center gap-2 ${
            activeTab === "history" 
              ? "bg-white text-neutral-900 shadow-sm border border-black/5" 
              : "text-neutral-500 hover:text-neutral-900 hover:bg-white/40"
          }`}
        >
          <FileText size={16} className={activeTab === "history" ? "text-blue-600" : "text-neutral-400"} />
          <span>감사 로그 (ITGC)</span>
        </button>
      </div>

      {/* 2차 서브메뉴: 신규 입사자 관리 전용 서브 탭 */}
      {isNewHireGroup && (
        <div className="flex items-center gap-1.5 mb-8 p-1 rounded-xl border w-fit shadow-xs"
             style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab("onboard")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "onboard"
                ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Zap size={13} className="text-amber-500 fill-amber-500" />
            원터치 입사 자동화
          </button>
          <button
            onClick={() => setActiveTab("journey")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "journey"
                ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Calendar size={13} />
            온보딩 여정 & 마일스톤 (D-Day)
          </button>
          <button
            onClick={() => setActiveTab("card")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "card"
                ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <IdCard size={13} />
            모바일 명함 스튜디오
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 탭 1: 원터치 종합 입사 자동화 (One-Touch Onboarding Pipeline) */}
      {/* ========================================================================= */}
      {activeTab === "onboard" && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-6)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-subtle)' }}>
          
          {/* 상단 타이틀 & 원터치 배지 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                <Zap size={22} className="fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-neutral-900">원터치 종합 입사 자동화 (One-Touch Onboarding)</h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    5-in-1 일괄 처리
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  단 한 번의 클릭으로 사번/이메일 발급, IT 장비 배정, 고정 IP 채번, 모바일 포털 링크, 웰컴 메일 발송, 마일스톤 등록을 전과정 일괄 처리합니다.
                </p>
              </div>
            </div>

            {/* 빠른 시연용 1-클릭 프리셋 버튼 */}
            {onStatus === "idle" && (
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-neutral-50 p-1.5 rounded-xl border border-neutral-200">
                <span className="text-[11px] font-bold text-neutral-500 pl-1">빠른 시연 프리셋:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('lab')}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-neutral-800 hover:bg-neutral-100 border border-neutral-200 transition-colors shadow-2xs"
                >
                  🚀 연구소 HW개발
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('hr')}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-neutral-800 hover:bg-neutral-100 border border-neutral-200 transition-colors shadow-2xs"
                >
                  💼 경영지원 인사
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('sales')}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-neutral-800 hover:bg-neutral-100 border border-neutral-200 transition-colors shadow-2xs"
                >
                  🌐 기술영업(서울)
                </button>
              </div>
            )}
          </div>

          {onStatus === "error" && (
            <div className="flex items-center gap-2 p-4 mb-6 text-sm bg-red-50 text-red-700 rounded-xl border border-red-200">
              <AlertCircle size={18} strokeWidth={2} />
              <span className="font-semibold">{onErrorMessage}</span>
            </div>
          )}

          {/* 원터치 종합 입사 실행 콘솔 (진행 중 & 완료 화면) */}
          {(onStatus === "in_progress" || onStatus === "completed") ? (
            <div className="space-y-6">
              
              {/* 상단 요약 배너 */}
              <div className="p-5 rounded-2xl border bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-blue-200/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xl text-neutral-900">{onName}</span>
                    {onRank && <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-neutral-200 text-neutral-800">{onRank}</span>}
                    <span className="text-xs text-neutral-500">· {onDept} {onRole ? `(${onRole})` : ''}</span>
                  </div>
                  <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-3">
                    <span>📍 {onLocation === 'suwon' ? '수원사업장 (현대테라타워 A동)' : '서울본사 (금천 현대지식산업센터)'}</span>
                    <span>📅 출근 예정일: <strong>{onDate}</strong></span>
                    {onEmail && <span>📩 수신 메일: <strong>{onEmail}</strong></span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onStatus === "in_progress" ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                      <Loader2 size={16} className="animate-spin text-blue-600" />
                      <span>원터치 자동화 파이프라인 가동 중...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>원터치 종합 입사 세팅 100% 완료</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 5단계 하이테크 실행 콘솔 */}
              <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    ONE-TOUCH AUTOMATION EXECUTION CONSOLE
                  </h4>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {onStatus === "completed" ? "5 / 5 STEP COMPLETE" : `${onStep} / 5 STEP PROCESSING`}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Step 1: 사내 ERP & 그룹웨어 계정/사번 발급 */}
                  <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    onStep >= 1 ? "bg-blue-50/50 border-blue-200" : "bg-neutral-50/50 border-neutral-200 opacity-60"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        onStep > 1 || onStatus === "completed" ? "bg-emerald-600 text-white" : onStep === 1 ? "bg-blue-600 text-white animate-pulse" : "bg-neutral-200 text-neutral-500"
                      }`}>
                        {onStep > 1 || onStatus === "completed" ? <Check size={14} /> : "1"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">사내 ERP / 다우오피스 그룹웨어 계정 및 사번 자동 채번</div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          {onResultData?.employeeNumber ? `사번: ${onResultData.employeeNumber} | 사내 메일: ${onResultData.companyEmail} (SSO 연동)` : "사원 번호 생성 및 Active Directory 계정 등록 대기 중..."}
                        </div>
                      </div>
                    </div>
                    <div>
                      {onStep > 1 || onStatus === "completed" ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">완료됨</span>
                      ) : onStep === 1 ? (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> 생성 중</span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">대기 중</span>
                      )}
                    </div>
                  </div>

                  {/* Step 2: IT 장비 3종 배정 및 IP 채번 */}
                  <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    onStep >= 2 ? "bg-blue-50/50 border-blue-200" : "bg-neutral-50/50 border-neutral-200 opacity-60"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        onStep > 2 || onStatus === "completed" ? "bg-emerald-600 text-white" : onStep === 2 ? "bg-blue-600 text-white animate-pulse" : "bg-neutral-200 text-neutral-500"
                      }`}>
                        {onStep > 2 || onStatus === "completed" ? <Check size={14} /> : "2"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">부서 맞춤 IT 장비 3종(노트북+듀얼모니터+출입증) 자동 배정 & 고정 IP 채번</div>
                        <div className="text-[11px] text-neutral-500">
                          {onResultData?.laptopModel ? `${onResultData.laptopModel} + 듀얼모니터 + 에스원 출입증 | IP: ${onResultData.fixedIp}` : "부서 특성 분석 및 표준 IT 하드웨어 패키지 바인딩 대기 중..."}
                        </div>
                      </div>
                    </div>
                    <div>
                      {onStep > 2 || onStatus === "completed" ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">배정 완료</span>
                      ) : onStep === 2 ? (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> 배정 중</span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">대기 중</span>
                      )}
                    </div>
                  </div>

                  {/* Step 3: 온보딩 체크리스트 동기화 및 마일스톤 캘린더 등록 */}
                  <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    onStep >= 3 ? "bg-blue-50/50 border-blue-200" : "bg-neutral-50/50 border-neutral-200 opacity-60"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        onStep > 3 || onStatus === "completed" ? "bg-emerald-600 text-white" : onStep === 3 ? "bg-blue-600 text-white animate-pulse" : "bg-neutral-200 text-neutral-500"
                      }`}>
                        {onStep > 3 || onStatus === "completed" ? <Check size={14} /> : "3"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">7단계 온보딩 마일스톤 캘린더 등록 & 체크리스트 자동 동기화</div>
                        <div className="text-[11px] text-neutral-500">
                          사전 준비 체크리스트 4종(PC세팅, 고정IP, 계정발급, 출입증) 자동 완료 체크 (D-7 ~ D+365 여정)
                        </div>
                      </div>
                    </div>
                    <div>
                      {onStep > 3 || onStatus === "completed" ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">동기화 완료</span>
                      ) : onStep === 3 ? (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> 동기화 중</span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">대기 중</span>
                      )}
                    </div>
                  </div>

                  {/* Step 4: 모바일 포털 링크 생성 & 웰컴 메일 발송 */}
                  <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    onStep >= 4 ? "bg-blue-50/50 border-blue-200" : "bg-neutral-50/50 border-neutral-200 opacity-60"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        onStep > 4 || onStatus === "completed" ? "bg-emerald-600 text-white" : onStep === 4 ? "bg-blue-600 text-white animate-pulse" : "bg-neutral-200 text-neutral-500"
                      }`}>
                        {onStep > 4 || onStatus === "completed" ? <Check size={14} /> : "4"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">신입사원 전용 모바일 온보딩 포털 URL 발급 & 웰컴 이메일 즉시 발송</div>
                        <div className="text-[11px] text-neutral-500">
                          {onEmail ? `수신처: ${onEmail} (사원증 사진 접수 및 준비물 확인 모바일 웹 링크 포함)` : '관리자 계정으로 테스트 알림장 발송 완료'}
                        </div>
                      </div>
                    </div>
                    <div>
                      {onStep > 4 || onStatus === "completed" ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">발송 완료</span>
                      ) : onStep === 4 ? (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> 발송 중</span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">대기 중</span>
                      )}
                    </div>
                  </div>

                  {/* Step 5: ITGC 감사 로그 기록 & 입사 확인서 생성 */}
                  <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    onStep >= 5 ? "bg-blue-50/50 border-blue-200" : "bg-neutral-50/50 border-neutral-200 opacity-60"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        onStatus === "completed" ? "bg-emerald-600 text-white" : onStep === 5 ? "bg-blue-600 text-white animate-pulse" : "bg-neutral-200 text-neutral-500"
                      }`}>
                        {onStatus === "completed" ? <Check size={14} /> : "5"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">ITGC 내부통제 컴플라이언스 감사 로그 기록 & 공식 입사 확인서 생성</div>
                        <div className="text-[11px] text-neutral-500">
                          문서 번호: {onResultData?.auditDocNo || `PWN-ONB-${new Date().getFullYear()}-AUDIT`} (내부회계관리제도 감사 증빙 영구 보존)
                        </div>
                      </div>
                    </div>
                    <div>
                      {onStatus === "completed" ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">보존 완료</span>
                      ) : onStep === 5 ? (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> 기록 중</span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">대기 중</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 완료 후 결과 리포트 및 원클릭 액션 패널 */}
              {onStatus === "completed" && onResultData && (
                <div className="p-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-neutral-900">
                          {onName} 님의 원터치 종합 입사 세팅이 완벽하게 완료되었습니다! 🎉
                        </h4>
                        <p className="text-xs text-neutral-600">
                          사내 ERP, 그룹웨어, 네트워크 IP, 지급 장비, 모바일 포털이 모두 실시간으로 프로비저닝되었습니다.
                        </p>
                      </div>
                    </div>
                    
                    {/* A4 입사 확인서 출력 바로가기 */}
                    <button
                      type="button"
                      onClick={() => {
                        setAuditPrintData({
                          type: "ONBOARDING_CERTIFICATE",
                          empName: onName,
                          department: onDept,
                          rank: onRank,
                          role: onRole,
                          location: onLocation,
                          targetDate: onDate,
                          completedDate: new Date().toISOString().split("T")[0],
                          docNo: onResultData.auditDocNo || `PWN-ONB-${new Date().getFullYear()}-001`,
                          systems: ["다우오피스 그룹웨어", "사내 ERP/MES 시스템", "Active Directory SSO", "에스원 출입통제 시스템"],
                          equipmentSummary: `${onResultData.laptopModel || '업무용 노트북'}, 27인치 FHD 듀얼 모니터, 에스원 스마트 사원증 (${onResultData.s1CardNo || ''})`,
                          progressPercent: 100
                        });
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Printer size={14} /> ITGC 입사 확인서(A4) 인쇄/PDF
                    </button>
                  </div>

                  {/* 발급된 계정 및 장비 요약 카드 그리드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-neutral-500 mb-0.5">발급 사번 (Employee ID)</div>
                      <div className="text-base font-extrabold text-neutral-900 font-mono">{onResultData.employeeNumber}</div>
                      <div className="text-[10px] text-neutral-400 mt-1">ERP 및 그룹웨어 단일 사번</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-neutral-500 mb-0.5">사내 공식 이메일</div>
                      <div className="text-sm font-bold text-blue-600 font-mono truncate">{onResultData.companyEmail}</div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        초기 비밀번호: <span className="font-mono text-rose-600 font-bold">{onResultData.temporaryPassword}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-neutral-500 mb-0.5">배정 노트북 & 고정 IP</div>
                      <div className="text-xs font-bold text-neutral-800 truncate">{onResultData.laptopModel?.split('(')[0]}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-1">
                        고정 IP: <span className="font-bold text-neutral-700">{onResultData.fixedIp}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-neutral-500 mb-0.5">보안 출입증 (S1 Card)</div>
                      <div className="text-xs font-bold text-neutral-800 font-mono">{onResultData.s1CardNo}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                        ✓ {onLocation === 'suwon' ? '수원사업장 게이트 등록' : '서울본사 게이트 등록'}
                      </div>
                    </div>
                  </div>

                  {/* 하단 액션 버튼 그룹 */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200/60">
                    <div className="flex flex-wrap items-center gap-2">
                      {onResultData.portalUrl && (
                        <a
                          href={onResultData.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <ExternalLink size={13} /> 신입사원 모바일 온보딩 포털 바로 열기
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveTab("journey")}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <Calendar size={13} /> 7대 마일스톤 여정 보기
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("assets")}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <Laptop size={13} /> IT 자산 대장 확인
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("card")}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <IdCard size={13} /> 모바일 명함 스튜디오
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setOnStatus("idle");
                        setOnStep(0);
                        setOnResultData(null);
                        setOnName("");
                        setOnDept("");
                        setOnRank("");
                        setOnRole("");
                        setOnLocation("suwon");
                        setOnDate("");
                        setOnEmail("");
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:text-neutral-900 hover:bg-white/80 transition-colors"
                    >
                      + 다른 신입사원 추가 등록
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 원터치 종합 입사 입력 폼 */
            <form onSubmit={handleOneTouchOnboardSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. 입사자 이름 */}
                <div className="relative">
                  <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} strokeWidth={1.5} />
                  <input 
                    type="text" 
                    value={onName} 
                    onChange={(e) => setOnName(e.target.value)} 
                    placeholder="입사자 성명 (예: 김예슬)" 
                    className="w-full pl-11 pr-4 py-3 outline-none rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all" 
                  />
                </div>

                {/* 2. 소속 부서 */}
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} strokeWidth={1.5} />
                  <input 
                    type="text" 
                    value={onDept} 
                    onChange={(e) => setOnDept(e.target.value)} 
                    placeholder="소속 부서 (예: 전력변환연구소 HW개발팀)" 
                    className="w-full pl-11 pr-4 py-3 outline-none rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all" 
                  />
                </div>

                {/* 3. 직급 (Rank) */}
                <div className="relative">
                  <select 
                    value={onRank} 
                    onChange={(e) => setOnRank(e.target.value)} 
                    className="w-full px-4 py-3 outline-none cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all"
                  >
                    <option value="">-- 직급 선택 (Rank) --</option>
                    <optgroup label="[사업부 직급]">
                      <option value="사원">사원 (Staff)</option>
                      <option value="주임">주임 (Senior Staff)</option>
                      <option value="대리">대리 (Assistant Manager)</option>
                      <option value="과장">과장 (Manager)</option>
                      <option value="차장">차장 (Senior Manager)</option>
                      <option value="부장">부장 (General Manager)</option>
                      <option value="담당">담당 (Director)</option>
                      <option value="이사">이사 (Managing Director)</option>
                      <option value="상무">상무 (Senior Managing Director)</option>
                      <option value="대표이사">대표이사 (CEO & President)</option>
                    </optgroup>
                    <optgroup label="[연구소 직급]">
                      <option value="연구원">연구원 (Research Engineer)</option>
                      <option value="주임연구원">주임연구원 (Associate Research Engineer)</option>
                      <option value="선임연구원">선임연구원 (Senior Research Engineer)</option>
                      <option value="책임연구원">책임연구원 (Principal Research Engineer)</option>
                      <option value="수석연구원">수석연구원 (Lead Research Engineer)</option>
                    </optgroup>
                  </select>
                </div>

                {/* 4. 직책 (Role) */}
                <div className="relative">
                  <input 
                    type="text" 
                    value={onRole} 
                    onChange={(e) => setOnRole(e.target.value)} 
                    placeholder="직책 (예: 팀원, 파트장, 팀장)" 
                    className="w-full px-4 py-3 outline-none rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all" 
                  />
                </div>

                {/* 5. 발령지 (근무 사업장) */}
                <div className="relative">
                  <select 
                    value={onLocation} 
                    onChange={(e) => setOnLocation(e.target.value as 'seoul' | 'suwon')} 
                    className="w-full px-4 py-3 outline-none cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all"
                  >
                    <option value="suwon">수원 사업장 (영통 현대테라타워 A동 1403호)</option>
                    <option value="seoul">서울 본사 (금천 현대지식산업센터 B동 17층)</option>
                  </select>
                </div>

                {/* 6. 출근 예정일 */}
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} strokeWidth={1.5} />
                  <input 
                    type="date" 
                    value={onDate} 
                    onChange={(e) => setOnDate(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3 outline-none rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all" 
                  />
                </div>

                {/* 7. 개인 이메일 (온보딩 알림장 및 포털 링크 발송용) */}
                <div className="relative md:col-span-2">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} strokeWidth={1.5} />
                  <input 
                    type="email" 
                    value={onEmail} 
                    onChange={(e) => setOnEmail(e.target.value)} 
                    placeholder="입사자 개인 이메일 (온보딩 알림장 & 모바일 포털 링크 자동 발송용: 예 imyesir@naver.com)" 
                    className="w-full pl-11 pr-4 py-3 outline-none rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all" 
                  />
                </div>
              </div>

              {/* 하단 원터치 종합 실행 버튼 */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-100">
                <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>실행 즉시 ITGC 내부통제 감사 로그(Audit Trail) 및 자산 대장에 안전하게 기록됩니다.</span>
                </div>

                <button 
                  type="submit" 
                  disabled={onStatus === "loading"} 
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={16} className="fill-white" />
                  <span>⚡ 원터치 입사 자동화 일괄 실행</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 탭 2: 온보딩 여정 & 마일스톤 (D-Day) */}
      {/* ========================================================================= */}
      {activeTab === "journey" && (
        <OnboardingJourney 
          onSelectEmployeeForCard={(emp) => {
            setOnName(emp.name);
            setOnDept(emp.department);
            setActiveTab("card");
          }} 
        />
      )}

      {/* ========================================================================= */}
      {/* 탭 3: IT 자산 및 비품 관리 대장 */}
      {/* ========================================================================= */}
      {activeTab === "assets" && (
        <AssetManagement />
      )}

      {/* ========================================================================= */}
      {/* 탭 4: 원터치 종합 퇴사 권한 회수 및 자산 정산 */}
      {/* ========================================================================= */}
      {activeTab === "offboard" && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-6)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-subtle)' }}>
          
          {/* 상단 타이틀 & 원터치 배지 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm">
                <UserMinus size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-neutral-900">원터치 종합 퇴사 처리 및 권한 회수 (One-Touch Offboarding)</h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                    보안 & 자산 일괄 정산
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  사내 계정 영구 잠금, 보유 IT 장비 일괄 반납(RETURNED), 에스원 출입 권한 폐기, ITGC 법적 감사 확인서 발급을 원터치로 실행합니다.
                </p>
              </div>
            </div>
          </div>

          {offStatus === "error" && (
            <div className="flex items-center gap-2 p-4 mb-6 text-sm bg-red-50 text-red-700 rounded-xl border border-red-200">
              <AlertCircle size={18} strokeWidth={2} />
              <span className="font-semibold">{offErrorMessage}</span>
            </div>
          )}

          {/* 퇴사 처리 완료 또는 예약 화면 */}
          {(offStatus === "completed" || offStatus === "scheduled") ? (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border bg-gradient-to-r from-rose-50/70 via-red-50/40 to-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-rose-200/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xl text-neutral-900">{offName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-neutral-200 text-neutral-800">{offDept}</span>
                  </div>
                  <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-3">
                    {offResultData?.isImmediate ? (
                      <span className="text-rose-700 font-bold">⚡ 당일 즉시 계정 차단 & 자산 일괄 회수 완료</span>
                    ) : (
                      <span>📅 퇴사 예정일: {offDate} (D+1 일자 자동 차단 예약됨)</span>
                    )}
                    <span>문서 번호: <strong>{offResultData?.docNo || 'PWN-OFF-AUDIT'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    <ShieldAlert size={16} className="text-rose-600" />
                    <span>{offResultData?.isImmediate ? "원터치 퇴사 처리 완료" : "D+1 차단 예약 완료"}</span>
                  </div>
                </div>
              </div>

              {/* 완료 상세 및 증빙서 출력 */}
              <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      {offName} 님의 시스템 접근 권한 차단 및 자산 정산이 정상 처리되었습니다.
                    </h4>
                    <p className="text-xs text-neutral-500">
                      ITGC 내부회계관리제도 및 정보보안 규정에 따른 공식 퇴사/권한회수 확인서를 출력할 수 있습니다.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAuditPrintData({
                        type: "OFFBOARDING_REVOKE_CERTIFICATE",
                        empName: offName,
                        department: offDept,
                        targetDate: offDate || new Date().toISOString().split("T")[0],
                        completedDate: new Date().toISOString().split("T")[0],
                        docNo: offResultData?.docNo || `PWN-OFF-${new Date().getFullYear()}-001`,
                        location: "suwon",
                        progressPercent: 100
                      });
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Printer size={14} /> ITGC 퇴사 확인서(A4) 즉시 인쇄/PDF
                  </button>
                </div>

                {/* 5대 회수 조치 결과 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="text-[11px] font-bold text-neutral-500">다우오피스/이메일 계정</div>
                    <div className="text-xs font-bold text-rose-600 mt-1">✓ 영구 잠금 및 세션 만료</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="text-[11px] font-bold text-neutral-500">사내 ERP / MES 시스템</div>
                    <div className="text-xs font-bold text-rose-600 mt-1">✓ 접근 권한 일괄 박탈</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="text-[11px] font-bold text-neutral-500">대여 IT 자산 회수</div>
                    <div className="text-xs font-bold text-emerald-700 mt-1">
                      ✓ 보유 {offResultData?.returnedAssetCount || 0}건 반납 완료 (RETURNED)
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="text-[11px] font-bold text-neutral-500">에스원(S1) 사업장 출입증</div>
                    <div className="text-xs font-bold text-rose-600 mt-1">✓ 게이트 출입 권한 폐기</div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-neutral-100">
                  {offTaskId && (
                    <button
                      type="button"
                      onClick={() => {
                        handleCancelTask(offTaskId, offName, '퇴사 처리');
                        setOffStatus("idle");
                        setOffName("");
                        setOffDept("");
                        setOffDate("");
                      }}
                      className="text-xs font-bold text-red-500 hover:text-red-600 underline"
                    >
                      방금 처리 즉시 철회하기
                    </button>
                  )}
                  <button 
                    onClick={() => { 
                      setOffStatus("idle"); 
                      setOffName(""); 
                      setOffDept(""); 
                      setOffDate(""); 
                      setSearchQuery(""); 
                      setShowDropdown(false); 
                      setOffResultData(null);
                    }} 
                    className="text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                  >
                    <RefreshCw size={13} /> 다른 임직원 퇴사 처리하기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 퇴사 대상자 검색 및 원터치 실행 폼 */
            <div className="space-y-5">
              {/* 임직원 검색 인풋 */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} strokeWidth={1.5} />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }} 
                  onFocus={() => { setShowDropdown(true); fetchEmployees(searchQuery); }}
                  placeholder="퇴사 처리할 임직원을 클릭하거나 이름을 검색하세요. (클릭 시 전체 명단 표시)" 
                  className="w-full pl-11 pr-4 py-3.5 outline-none rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-red-500 text-sm font-bold transition-all" 
                />
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 py-2 shadow-xl max-h-60 overflow-y-auto rounded-xl border border-neutral-200 bg-white">
                    {searchResults.map((emp) => (
                      <div 
                        key={emp.id} 
                        onClick={() => selectEmployee(emp)} 
                        className="px-4 py-3 cursor-pointer flex justify-between items-center transition-colors hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900">{emp.name}</span>
                          <span className="text-xs text-neutral-500">{emp.department}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">선택</span>
                      </div>
                    ))}
                  </div>
                )}
                {showDropdown && searchResults.length === 0 && !isSearching && (
                  <div className="absolute z-20 w-full mt-2 py-4 px-4 text-center shadow-xl text-xs rounded-xl border border-neutral-200 bg-white text-neutral-400">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>

              {/* 선택된 임직원 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ opacity: offName ? 1 : 0.5, pointerEvents: offName ? 'auto' : 'none' }}>
                <div className="relative">
                  <UserMinus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} strokeWidth={1.5} />
                  <input type="text" value={offName} readOnly placeholder="선택된 성명" className="w-full pl-11 pr-4 py-3 outline-none rounded-xl border border-neutral-200 bg-neutral-100/60 font-bold text-sm text-neutral-900" />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} strokeWidth={1.5} />
                  <input type="text" value={offDept} readOnly placeholder="선택된 부서" className="w-full pl-11 pr-4 py-3 outline-none rounded-xl border border-neutral-200 bg-neutral-100/60 font-semibold text-sm text-neutral-900" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} strokeWidth={1.5} />
                  <input 
                    type="date" 
                    value={offDate} 
                    onChange={(e) => setOffDate(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3 outline-none rounded-xl border border-rose-300 bg-white font-bold text-sm text-rose-700" 
                  />
                </div>
              </div>

              {/* 보유 IT 자산 실시간 현황 및 회수 상태 */}
              {offName && (
                <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Laptop size={16} className="text-neutral-700" />
                      <h4 className="text-xs font-bold text-neutral-900">
                        {offName} 님 보유 IT 자산 정산 대상 ({offEmpAssets.length}건)
                      </h4>
                    </div>
                    {offEmpAssets.some(a => a.status !== "RETURNED") && (
                      <button
                        type="button"
                        onClick={handleBatchReturnOffAssets}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-xs flex items-center gap-1"
                      >
                        <RotateCcw size={12} /> 보유 자산만 개별 반납 처리
                      </button>
                    )}
                  </div>

                  {offEmpAssets.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-1">
                      현재 등록된 보유 IT 자산이 없습니다. (자산 대장 미등록)
                    </p>
                  ) : (
                    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#F8F9FA] border-b text-[11px] text-neutral-500 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">분류</th>
                            <th className="py-2.5 px-3">기종 및 모델명</th>
                            <th className="py-2.5 px-3">시리얼 번호</th>
                            <th className="py-2.5 px-3">고정 IP</th>
                            <th className="py-2.5 px-3">회수 상태</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-[11px]">
                          {offEmpAssets.map((asset: any) => (
                            <tr key={asset.id} className="hover:bg-neutral-50">
                              <td className="py-2 px-3">
                                <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-neutral-100 text-neutral-700">
                                  {asset.category === 'LAPTOP' ? '노트북' : asset.category === 'MONITOR' ? '모니터' : asset.category === 'SECURITY_CARD' ? '출입카드' : asset.category}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-semibold text-neutral-800">{asset.modelName}</td>
                              <td className="py-2 px-3 font-mono text-[10px] text-neutral-500">{asset.serialNumber}</td>
                              <td className="py-2 px-3 font-mono text-[10px] text-neutral-500">{asset.fixedIp || "-"}</td>
                              <td className="py-2 px-3">
                                {asset.status === 'RETURNED' ? (
                                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    반납 완료 ({asset.returnDate || '완료'})
                                  </span>
                                ) : (
                                  <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    회수 필요 (대여 중)
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-500 pt-1 gap-2">
                    <span>원터치 퇴사 실행 시 위 IT 자산이 자동으로 반납 완료 처리되며, 포맷 대기로 전환됩니다.</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("assets")}
                      className="text-blue-600 font-bold hover:underline shrink-0"
                    >
                      IT 자산 대장 이동 →
                    </button>
                  </div>
                </div>
              )}

              {/* 하단 2가지 실행 옵션: 원터치 즉시 실행 vs D+1 예약 */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  disabled={!offName || offStatus === "loading"}
                  onClick={() => handleOneTouchOffboard('SCHEDULED')}
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  <Clock size={14} />
                  <span>📅 퇴사일 예약 (D+1 자동 차단)</span>
                </button>

                <button 
                  type="button" 
                  disabled={!offName || offStatus === "loading"}
                  onClick={() => handleOneTouchOffboard('IMMEDIATE')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {offStatus === "loading" ? (
                    <><Loader2 size={16} className="animate-spin" /> 원터치 퇴사 처리 중...</>
                  ) : (
                    <>
                      <Zap size={16} className="fill-white" />
                      <span>🚨 원터치 종합 퇴사 즉시 실행 (계정 차단 + 자산 회수)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 탭 5: 모바일 명함 스튜디오 */}
      {/* ========================================================================= */}
      {activeTab === 'card' && (
        <BusinessCardGenerator 
          initialName={onName} 
          initialDept={onDept}
          initialRank={onRank}
          initialRole={onRole}
          initialLocation={onLocation}
          initialEmail={onEmail}
          key={`${onName}-${onDept}-${onRank}-${onRole}-${onLocation}`} 
        />
      )}

      {/* ========================================================================= */}
      {/* 탭 6: Log 및 ITGC 감사 기록 */}
      {/* ========================================================================= */}
      {activeTab === "history" && (
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-6)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-subtle)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                <FileText size={24} style={{ color: 'var(--color-text-title)' }} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-title)' }}>ITGC 감사 로그 (Audit Trail)</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>최대 3년간 안전하게 보존되는 계정 세팅 및 회수 작업 로그입니다.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportAuditExcel}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download size={14} /> ITGC 엑셀(CSV) 다운로드
              </button>
              <button onClick={() => fetchHistory(logSearchQuery)} className="p-2 rounded-lg transition-colors hover:bg-neutral-100" style={{ color: 'var(--color-text-muted)' }}>
                <RefreshCw size={18} className={isHistoryLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* 로그 필터링 검색바 */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} size={16} strokeWidth={1.5} />
            <input 
              type="text" 
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="직원 이름으로 로그 필터링 (예: 김)" 
              className="w-full pl-10 pr-4 py-2 outline-none" 
              style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-title)', fontSize: '14px' }} 
            />
          </div>

          <div className="space-y-3">
            {historyData.map((task) => {
              const latestMessage = task.logs && task.logs.length > 0 
                ? [...task.logs].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.result_message 
                : null;
              const isCancelled = task.status === 'CANCELLED';

              return (
                <div key={task.id} className="p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', opacity: isCancelled ? 0.75 : 1 }}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold ${isCancelled ? 'line-through text-gray-400' : ''}`} style={{ color: isCancelled ? 'var(--color-text-muted)' : 'var(--color-text-title)' }}>
                        {task.employees?.name}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>({task.employees?.department})</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ 
                        backgroundColor: isCancelled 
                           ? '#F3F4F6' 
                          : (task.task_type === 'ONBOARDING' ? 'var(--color-success-bg)' : 'var(--color-error-bg)'),
                        color: isCancelled 
                          ? '#6B7280' 
                          : (task.task_type === 'ONBOARDING' ? 'var(--color-success-text)' : 'var(--color-error-text)')
                      }}>
                        {isCancelled ? '작업 철회됨' : (task.task_type === 'ONBOARDING' ? '입사 세팅' : '퇴사 차단')}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: isCancelled ? 'var(--color-text-muted)' : 'var(--color-text-title)' }}>
                      {latestMessage || (task.status === 'PENDING' ? '예약 대기 중 (D+1 실행 예정)' : '작업 진행 중')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* 감사 증빙서 출력 버튼 */}
                    <button
                      onClick={() => {
                        const isOff = task.task_type === 'OFFBOARDING' || task.task_type === 'REVOKE_ACCESS';
                        setAuditPrintData({
                          type: isOff ? "OFFBOARDING_REVOKE_CERTIFICATE" : "ONBOARDING_CERTIFICATE",
                          empName: task.employees?.name || '임직원',
                          department: task.employees?.department || '부서',
                          targetDate: new Date(task.created_at).toISOString().split("T")[0],
                          completedDate: new Date(task.created_at).toISOString().split("T")[0],
                          docNo: `PWN-AUDIT-${new Date().getFullYear()}-${task.id.slice(0, 6).toUpperCase()}`,
                          location: "suwon",
                          progressPercent: 100
                        });
                      }}
                      className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Printer size={12} /> 증빙서 출력
                    </button>
                    {isCancelled ? (
                      <span className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-500 font-bold border border-neutral-200">
                        철회 완료
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCancelTask(
                          task.id, 
                          task.employees?.name, 
                          task.task_type === 'ONBOARDING' ? '신규 입사 세팅' : '퇴사 권한 회수'
                        )}
                        disabled={cancellingTaskId === task.id}
                        className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold transition-all"
                      >
                        {cancellingTaskId === task.id ? '철회 중...' : '철회하기'}
                      </button>
                    )}
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: 'var(--color-text-title)' }}>
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {historyData.length === 0 && !isHistoryLoading && (
              <div className="py-12 text-center text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>
                아직 기록된 작업 이력이 없거나 검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ITGC 공식 증빙서 인쇄/PDF 모달 */}
      <DocumentPrintModal 
        data={auditPrintData} 
        onClose={() => setAuditPrintData(null)} 
      />

      {/* 사용자 & 관리자 가이드 매뉴얼 팝업 모달 (초기 접속 시 자동 팝업) */}
      <UserManualModal 
        isOpen={isManualOpen} 
        onClose={() => setIsManualOpen(false)} 
      />

    </div>
  );
}
