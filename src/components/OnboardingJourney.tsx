"use client";

import React, { useState, useEffect } from "react";
import DocumentPrintModal, { PrintDocumentData } from "./DocumentPrintModal";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  User, 
  Briefcase, 
  Award, 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  IdCard, 
  Laptop, 
  ShieldCheck, 
  HeartHandshake, 
  UserCheck,
  Search,
  Filter,
  CheckSquare,
  FileText,
  AlertCircle,
  Printer,
  Mail,
  Send,
  Eye,
  Loader2,
  ExternalLink,
  X
} from "lucide-react";

export interface JourneyEmployee {
  id: string;
  name: string;
  department: string;
  status: string;
  target_date: string;
  created_at: string;
}

export interface JourneyMilestone {
  id: string;
  phase: 'pre' | 'day1' | 'month1' | 'month3';
  phaseTitle: string;
  phaseBadge: string;
  title: string;
  description: string;
  category: 'IT/전산' | '총무/복지' | '인사/조직';
}

const MILESTONES: JourneyMilestone[] = [
  // 1단계: 사전 준비 (D-7 ~ D-1)
  {
    id: 'pre_email',
    phase: 'pre',
    phaseTitle: '1단계: 입사 사전 준비 (D-7 ~ D-1)',
    phaseBadge: '사전 준비',
    title: '입사 안내 웰컴 메일 발송 및 출근일 확정',
    description: '출근 일시, 사업장(수원/서울), 첫날 준비물 및 일정 사전 안내 완료',
    category: '인사/조직',
  },
  {
    id: 'pre_pc',
    phase: 'pre',
    phaseTitle: '1단계: 입사 사전 준비 (D-7 ~ D-1)',
    phaseBadge: '사전 준비',
    title: '업무용 PC/노트북 초기화 및 자리 배선 세팅',
    description: '창고 여유 PC 포맷 또는 기존 자리 초기화, 필수 OS 및 듀얼모니터 배선 완료',
    category: 'IT/전산',
  },
  {
    id: 'pre_network',
    phase: 'pre',
    phaseTitle: '1단계: 입사 사전 준비 (D-7 ~ D-1)',
    phaseBadge: '사전 준비',
    title: '사내 고정 IP 할당 및 네트워크/방화벽 보안 설정',
    description: '이더넷 MAC 주소 등록, 고정 IP 부여 및 인트라넷 방화벽 포트 허용',
    category: 'IT/전산',
  },
  {
    id: 'pre_accounts',
    phase: 'pre',
    phaseTitle: '1단계: 입사 사전 준비 (D-7 ~ D-1)',
    phaseBadge: '사전 준비',
    title: '그룹웨어 및 ERP / MES 시스템 계정 사전 생성',
    description: '회사 이메일(@gopowernet.com) 및 초기 임시 패스워드 발급 완료',
    category: 'IT/전산',
  },

  // 2단계: 첫 출근 & 웰컴 데이 (D-Day)
  {
    id: 'day1_welcome_kit',
    phase: 'day1',
    phaseTitle: '2단계: 첫 출근 & 웰컴 데이 (D-Day)',
    phaseBadge: '출근 D-Day',
    title: '웰컴 기프트 패키지 및 사무용품 지급',
    description: '파워넷 다이어리, 노트, 펜 세트 및 복리후생 매뉴얼 전달',
    category: '총무/복지',
  },
  {
    id: 'day1_pass_s1',
    phase: 'day1',
    phaseTitle: '2단계: 첫 출근 & 웰컴 데이 (D-Day)',
    phaseBadge: '출근 D-Day',
    title: '사원증 사진 촬영 안내 및 에스원(S1) 출입증 발주',
    description: '제휴 사진관(패밀리포토하우스) 촬영 및 에스원 정규 출입증 신청 접수 (제작 약 2주 소요)',
    category: '총무/복지',
  },
  {
    id: 'day1_business_card',
    phase: 'day1',
    phaseTitle: '2단계: 첫 출근 & 웰컴 데이 (D-Day)',
    phaseBadge: '출근 D-Day',
    title: '공식 명함 정보 확정 및 외주 제작 발주',
    description: '영문명, 직책, 사업장 정보 확인 후 명함 스튜디오에서 시안 확정',
    category: '총무/복지',
  },
  {
    id: 'day1_ojt',
    phase: 'day1',
    phaseTitle: '2단계: 첫 출근 & 웰컴 데이 (D-Day)',
    phaseBadge: '출근 D-Day',
    title: '첫날 사내 기본 규정 OJT 및 부서원 대면 소개',
    description: '근태/보안 규정 안내, 자리 안내 및 부서 팀원 상견례 진행',
    category: '인사/조직',
  },

  // 3단계: 업무 적응 & 멘토링 (1주차 ~ 1개월차)
  {
    id: 'month1_mentor',
    phase: 'month1',
    phaseTitle: '3단계: 업무 적응 & 멘토링 (1주차 ~ 1개월차)',
    phaseBadge: '적응 멘토링',
    title: '전담 멘토(사수) 배정 및 부서 웰컴 런치',
    description: '1:1 OJT 멘토링 프로그램 가동 및 팀원 환영 식사 진행',
    category: '인사/조직',
  },
  {
    id: 'month1_it_check',
    phase: 'month1',
    phaseTitle: '3단계: 업무 적응 & 멘토링 (1주차 ~ 1개월차)',
    phaseBadge: '적응 멘토링',
    title: '사내 그룹웨어/ERP/MES 권한 정상 작동 점검',
    description: '실제 업무용 결재선, 권한 그룹 정상 접근 여부 IT 점검',
    category: 'IT/전산',
  },
  {
    id: 'month1_items_delivery',
    phase: 'month1',
    phaseTitle: '3단계: 업무 적응 & 멘토링 (1주차 ~ 1개월차)',
    phaseBadge: '적응 멘토링',
    title: '에스원 정규 사원증 및 실물 명함 수령/전달',
    description: '제작 완료된 정규 사원증 및 인쇄 명함 실물 수령 및 직원 전달 완료',
    category: '총무/복지',
  },
  {
    id: 'month1_feedback',
    phase: 'month1',
    phaseTitle: '3단계: 업무 적응 & 멘토링 (1주차 ~ 1개월차)',
    phaseBadge: '적응 멘토링',
    title: '1개월차 조직 적응도 체크 및 인사팀 피드백 면담',
    description: '업무 환경 및 직무 적응 상태 모니터링, 고충 사항 청취 및 조치',
    category: '인사/조직',
  },

  // 4단계: 수습 평가 & 정규직 전환 (3개월차)
  {
    id: 'month3_eval',
    phase: 'month3',
    phaseTitle: '4단계: 수습 평가 & 정규직 전환 (3개월차)',
    phaseBadge: '수습 평가',
    title: '3개월 수습기간 부서장 평가표 접수',
    description: '부서장 1차 직무 평가 및 태도/협업 평가 점수 취합',
    category: '인사/조직',
  },
  {
    id: 'month3_interview',
    phase: 'month3',
    phaseTitle: '4단계: 수습 평가 & 정규직 전환 (3개월차)',
    phaseBadge: '수습 평가',
    title: '정규직 전환 최종 면담 및 내부 품의 승인',
    description: '인사총괄 최종 인터뷰 및 수습 해제/정규 전환 인사 발령 완료',
    category: '인사/조직',
  },
];

interface OnboardingJourneyProps {
  onSelectEmployeeForCard?: (emp: { name: string; department: string }) => void;
}

export default function OnboardingJourney({ onSelectEmployeeForCard }: OnboardingJourneyProps) {
  const [employees, setEmployees] = useState<JourneyEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "BEFORE" | "TODAY" | "ACTIVE">("ALL");
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  // Per-employee checklist state map: { [empId]: { [milestoneId]: boolean } }
  const [checklists, setChecklists] = useState<{ [empId: string]: { [key: string]: boolean } }>({});
  
  // Per-employee notes state: { [empId]: string }
  const [notes, setNotes] = useState<{ [empId: string]: string }>({});
  const [printData, setPrintData] = useState<PrintDocumentData | null>(null);

  // 자동 안내 이메일 발송 & 미리보기 관련 상태
  const [sendingMilestone, setSendingMilestone] = useState<string | null>(null);
  const [previewMilestone, setPreviewMilestone] = useState<{
    type: 'DAY_1' | 'WEEK_1' | 'MONTH_1' | 'MONTH_3';
    title: string;
    subtitle: string;
    items: string[];
    tip: string;
    date: string;
  } | null>(null);
  const [sentMilestones, setSentMilestones] = useState<{ [key: string]: boolean }>({});

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/employees/onboarding');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
        if (data.length > 0 && !selectedEmpId) {
          setSelectedEmpId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load onboarding employees", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // Load cached checklists from localStorage
    try {
      const savedChecklists = localStorage.getItem("powernet_onboarding_checklists");
      if (savedChecklists) {
        setChecklists(JSON.parse(savedChecklists));
      }
      const savedNotes = localStorage.getItem("powernet_onboarding_notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
      const savedSent = localStorage.getItem("powernet_sent_milestones");
      if (savedSent) {
        setSentMilestones(JSON.parse(savedSent));
      }
    } catch (e) {
      console.error("Failed to load saved journey state", e);
    }
  }, []);

  const getMilestoneDetails = (type: 'DAY_1' | 'WEEK_1' | 'MONTH_1' | 'MONTH_3', emp: JourneyEmployee) => {
    switch (type) {
      case 'DAY_1':
        return {
          type,
          title: "출근 첫날 환영 및 웰컴 키트 수령 안내",
          subtitle: "파워넷 입사를 진심으로 환영합니다! 오늘 진행할 주요 절차입니다.",
          items: [
            "경영지원실 총무팀에서 웰컴 키트 및 다이어리 수령",
            "배정된 자리에서 업무용 PC 부팅 및 초기 임시 비밀번호 변경",
            "에스원 출입증 발급용 증명사진 제출 또는 제휴 사진관(패밀리포토하우스) 촬영 안내 (제작 약 2주 소요)",
            "부서 멘토(사수) 및 팀원들과 첫 대면 인사"
          ],
          tip: "💡 사내 그룹웨어 접속 주소 및 초기 접속 비밀번호는 사전 발송된 메일을 확인해주세요.",
          date: emp.target_date || '입사 당일'
        };
      case 'WEEK_1':
        return {
          type,
          title: "입사 1주차: 팀 웰컴 런치 & 멘토링 1:1 체크인",
          subtitle: "파워넷에서의 첫 일주일, 고생 많으셨습니다! 업무 환경에 잘 적응하고 계신가요?",
          items: [
            "배정된 멘토(사수)와 1:1 티타임 진행 및 업무 궁금증 질문",
            "사내 그룹웨어 프로필 사진 등록 및 기본 전자결재 상신 가이드 확인",
            "업무용 소프트웨어(ERP/MES/Office) 권한 정상 작동 여부 확인",
            "팀원들과의 웰컴 런치 식사"
          ],
          tip: "💡 업무 시스템 권한에 이상이 있을 경우 사내 인트라넷 전산 헬프데스크로 즉시 문의해주세요.",
          date: calculateMilestoneDate(emp.target_date, 7)
        };
      case 'MONTH_1':
        return {
          type,
          title: "입사 1개월차: 온보딩 적응도 설문 및 인사팀 피드백",
          subtitle: "파워넷의 소중한 일원으로 한 달간 함께해 주셔서 감사합니다!",
          items: [
            "온보딩 1개월차 조직 적응도 자가진단 설문 참여 (약 3분 소요)",
            "인쇄 제작 완료된 정규 사원증 및 공식 명함 실물 수령 확인",
            "팀장님과의 1개월차 중간 업무 방향성 1:1 면담",
            "인사팀 온보딩 담당자와의 캐주얼 커피챗 (고충 및 건의사항)"
          ],
          tip: "💡 초기 적응 과정에서 겪는 어려운 점이나 필요한 장비가 있다면 인사기획팀에 편하게 말씀해주세요.",
          date: calculateMilestoneDate(emp.target_date, 30)
        };
      case 'MONTH_3':
        return {
          type,
          title: "입사 3개월차: 수습 기간 종료 및 정규직 전환 안내",
          subtitle: "3개월간의 수습 온보딩 여정을 훌륭히 마쳐가고 계십니다!",
          items: [
            "수습기간 직무 수행 자체 점검표 작성 및 부서장 면담",
            "인사총괄 정규직 전환 인터뷰 진행",
            "정규직 임용 발령 및 사내 포털 인사 정보 최종 확정",
            "수습 온보딩 최종 수료 및 축하 기념품 수령"
          ],
          tip: "💡 정규직 전환 인터뷰 일정은 인사기획팀에서 부서장님과 조율 후 별도 캘린더 초대를 드립니다.",
          date: calculateMilestoneDate(emp.target_date, 90)
        };
    }
  };

  const handleSendMilestone = async (emp: JourneyEmployee, milestoneType: 'DAY_1' | 'WEEK_1' | 'MONTH_1' | 'MONTH_3') => {
    const key = `${emp.id}_${milestoneType}`;
    setSendingMilestone(key);
    try {
      const res = await fetch('/api/milestone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empName: emp.name,
          department: emp.department,
          targetDate: emp.target_date,
          hireEmail: 'yskim@gopowernet.com',
          milestoneType,
          empId: emp.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || '발송 중 오류가 발생했습니다.');
        return;
      }

      const data = await res.json();
      const updated = { ...sentMilestones, [key]: true };
      setSentMilestones(updated);
      localStorage.setItem("powernet_sent_milestones", JSON.stringify(updated));
      alert(`[${data.milestoneTitle}] 안내 이메일이 ${emp.name} 님에게 성공적으로 발송되었습니다!\n(수신처: ${data.sentTo})`);
    } catch (err) {
      alert('서버 통신 오류가 발생했습니다.');
    } finally {
      setSendingMilestone(null);
    }
  };

  const saveChecklistsToStorage = (updated: { [empId: string]: { [key: string]: boolean } }) => {
    setChecklists(updated);
    try {
      localStorage.setItem("powernet_onboarding_checklists", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveNotesToStorage = (empId: string, content: string) => {
    const updated = { ...notes, [empId]: content };
    setNotes(updated);
    try {
      localStorage.setItem("powernet_onboarding_notes", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMilestone = (empId: string, milestoneId: string) => {
    const empChecks = checklists[empId] || {};
    const updatedEmpChecks = {
      ...empChecks,
      [milestoneId]: !empChecks[milestoneId],
    };
    const updated = {
      ...checklists,
      [empId]: updatedEmpChecks,
    };
    saveChecklistsToStorage(updated);
  };

  const completeAllMilestones = (empId: string) => {
    const fullChecks: { [key: string]: boolean } = {};
    MILESTONES.forEach(m => fullChecks[m.id] = true);
    const updated = {
      ...checklists,
      [empId]: fullChecks,
    };
    saveChecklistsToStorage(updated);
  };

  const resetAllMilestones = (empId: string) => {
    if (!confirm("해당 직원의 온보딩 체크리스트를 초기화하시겠습니까?")) return;
    const updated = {
      ...checklists,
      [empId]: {},
    };
    saveChecklistsToStorage(updated);
  };

  const getDDayInfo = (targetDateStr: string) => {
    if (!targetDateStr) return { text: '-', color: '#86868b', bg: '#f5f5f7', diffDays: 0, phaseDesc: '-' };
    const target = new Date(targetDateStr);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return { 
        text: `D-${diffDays}일`, 
        color: '#0071e3', 
        bg: '#ebf5ff', 
        diffDays,
        phaseDesc: '입사 사전 준비 단계'
      };
    } else if (diffDays === 0) {
      return { 
        text: 'D-Day (오늘)', 
        color: '#1e8e3e', 
        bg: '#eaf8ee', 
        diffDays,
        phaseDesc: '첫 출근 & 웰컴 데이'
      };
    } else {
      const elapsed = Math.abs(diffDays);
      return { 
        text: `D+${elapsed}일차`, 
        color: '#7c3aed', 
        bg: '#f5f3ff', 
        diffDays,
        phaseDesc: elapsed <= 7 ? '1주차 적응 기간' : elapsed <= 30 ? '1개월차 온보딩 기간' : '3개월차 수습 평가'
      };
    }
  };

  const selectedEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];
  const selectedEmpChecks = selectedEmployee ? (checklists[selectedEmployee.id] || {}) : {};
  const completedCount = MILESTONES.filter(m => selectedEmpChecks[m.id]).length;
  const progressPercent = Math.round((completedCount / MILESTONES.length) * 100);

  // Group milestones by phase
  const phases = [
    { key: 'pre', label: '1단계: 입사 사전 준비 (D-7 ~ D-1)', icon: Laptop, badge: '사전 준비', color: '#0071e3' },
    { key: 'day1', label: '2단계: 첫 출근 & 웰컴 데이 (D-Day)', icon: Sparkles, badge: '출근 당일', color: '#1e8e3e' },
    { key: 'month1', label: '3단계: 업무 적응 & 멘토링 (1주차 ~ 1개월차)', icon: HeartHandshake, badge: '적응 멘토링', color: '#7c3aed' },
    { key: 'month3', label: '4단계: 수습 평가 & 정규직 전환 (3개월차)', icon: Award, badge: '수습 평가', color: '#d97706' },
  ];

  // Filtering
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const dDay = getDDayInfo(emp.target_date);
    if (filterType === 'BEFORE') return dDay.diffDays > 0;
    if (filterType === 'TODAY') return dDay.diffDays === 0;
    if (filterType === 'ACTIVE') return dDay.diffDays < 0;
    return true;
  });

  // Calculate Key Dates for selected employee
  const calculateMilestoneDate = (targetDateStr: string, addDays: number) => {
    if (!targetDateStr) return '-';
    const d = new Date(targetDateStr);
    d.setDate(d.getDate() + addDays);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. 상단 통계 현황판 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>총 관리 입사자</span>
            <User size={15} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="text-2xl font-black" style={{ color: 'var(--color-text-title)' }}>
            {employees.length}<span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>명</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-blue-600">사전 준비 중 (D-Day 전)</span>
            <Clock size={15} className="text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">
            {employees.filter(e => getDDayInfo(e.target_date).diffDays > 0).length}
            <span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>명</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-emerald-600">오늘 첫 출근 (D-Day)</span>
            <Sparkles size={15} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {employees.filter(e => getDDayInfo(e.target_date).diffDays === 0).length}
            <span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>명</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-purple-600">적응 / 수습 중 (D+)</span>
            <HeartHandshake size={15} className="text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">
            {employees.filter(e => getDDayInfo(e.target_date).diffDays < 0).length}
            <span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-muted)' }}>명</span>
          </div>
        </div>
      </div>

      {/* 2. 메인 컨텐츠: 좌측 대상자 목록 & 우측 마일스톤 체크리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 좌측: 신규 입사자 목록 (4 컬럼, 와이드 3 컬럼) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-3">
          <div className="p-4 rounded-2xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--color-text-title)' }}>
                <Calendar size={16} /> 신규 입사자 명단
              </h3>
              <button 
                onClick={fetchEmployees}
                title="새로고침"
                className="p-1 rounded hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* 검색창 */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="이름 또는 부서 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: '#F5F5F7',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-title)'
                }}
              />
            </div>

            {/* 필터 칩 */}
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === "ALL" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterType("BEFORE")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === "BEFORE" ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70"
                }`}
              >
                사전 준비
              </button>
              <button
                onClick={() => setFilterType("TODAY")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === "TODAY" ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70"
                }`}
              >
                오늘 첫날
              </button>
              <button
                onClick={() => setFilterType("ACTIVE")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === "ACTIVE" ? "bg-purple-600 text-white" : "bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70"
                }`}
              >
                적응 중
              </button>
            </div>

            {/* 입사자 목록 스크롤 */}
            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-8 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  입사자 목록을 불러오는 중...
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="py-8 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  해당 조건의 입사자가 없습니다.
                </div>
              ) : (
                filteredEmployees.map((emp) => {
                  const dDay = getDDayInfo(emp.target_date);
                  const isSelected = selectedEmployee?.id === emp.id;
                  const empChecks = checklists[emp.id] || {};
                  const doneCount = MILESTONES.filter(m => empChecks[m.id]).length;
                  const pct = Math.round((doneCount / MILESTONES.length) * 100);

                  return (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedEmpId(emp.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? "border-blue-500 shadow-xs ring-1 ring-blue-500/30" 
                          : "hover:border-neutral-300 hover:bg-neutral-50/60"
                      }`}
                      style={{
                        backgroundColor: isSelected ? '#F0F7FF' : '#FFFFFF',
                        borderColor: isSelected ? '#0071E3' : 'var(--color-border)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <span className="font-bold text-sm truncate" style={{ color: 'var(--color-text-title)' }}>
                          {emp.name}
                        </span>
                        <span 
                          className="px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap flex-shrink-0"
                          style={{ backgroundColor: dDay.bg, color: dDay.color }}
                        >
                          {dDay.text}
                        </span>
                      </div>
                      
                      <p className="text-xs truncate mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        {emp.department}
                      </p>

                      <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
                        <span style={{ color: 'var(--color-text-muted)' }}>온보딩 여정</span>
                        <span className="font-bold text-blue-600">{pct}% ({doneCount}/{MILESTONES.length})</span>
                      </div>

                      {/* 미니 프로그레스 바 */}
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 우측: 선택된 입사자의 온보딩 상세 여정 타임라인 & 마일스톤 (8 컬럼, 와이드 9 컬럼) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {selectedEmployee ? (
            <div className="p-6 rounded-xl border space-y-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              
              {/* 상단 프로필 헤더 */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h2 className="text-xl font-black whitespace-nowrap" style={{ color: 'var(--color-text-title)' }}>
                      {selectedEmployee.name}
                    </h2>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0"
                      style={{ 
                        backgroundColor: getDDayInfo(selectedEmployee.target_date).bg, 
                        color: getDDayInfo(selectedEmployee.target_date).color 
                      }}
                    >
                      {getDDayInfo(selectedEmployee.target_date).text}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200 whitespace-nowrap flex-shrink-0 font-medium">
                      {getDDayInfo(selectedEmployee.target_date).phaseDesc}
                    </span>
                  </div>
                  <p className="text-xs whitespace-nowrap truncate" style={{ color: 'var(--color-text-muted)' }}>
                    소속: {selectedEmployee.department} · 입사(예정)일: {selectedEmployee.target_date}
                  </p>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  {onSelectEmployeeForCard && (
                    <button
                      onClick={() => onSelectEmployeeForCard({
                        name: selectedEmployee.name,
                        department: selectedEmployee.department
                      })}
                      className="text-xs px-3.5 py-2 rounded-xl font-bold bg-[#0071E3] hover:bg-blue-600 text-white flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap"
                    >
                      <IdCard size={14} /> 명함 제작 바로가기
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setPrintData({
                        type: "ONBOARDING_CERTIFICATE",
                        empName: selectedEmployee.name,
                        department: selectedEmployee.department,
                        targetDate: selectedEmployee.target_date,
                        completedDate: new Date().toISOString().split("T")[0],
                        docNo: `PWN-ONB-${new Date().getFullYear()}-${(selectedEmployee.id || 'EMP').slice(0, 6).toUpperCase()}`,
                        progressPercent,
                        location: "suwon"
                      });
                    }}
                    className="text-xs px-3 py-2 rounded-xl border font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                    style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-border)', color: 'var(--color-text-title)' }}
                  >
                    <Printer size={13} className="text-blue-600" /> 증명서 인쇄/PDF
                  </button>
                  <a
                    href={`/onboard/portal/${selectedEmployee.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                  >
                    <ExternalLink size={13} /> 셀프 포털 열기
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const portalUrl = `${window.location.origin}/onboard/portal/${selectedEmployee.id}`;
                      navigator.clipboard.writeText(portalUrl);
                      alert(`신입사원 온보딩 포털 링크가 복사되었습니다!\n\n${portalUrl}\n\n입사자에게 문자, 카카오톡 또는 이메일로 전달하세요.`);
                    }}
                    className="text-xs px-3 py-2 rounded-xl border font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                    style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-border)', color: 'var(--color-text-title)' }}
                  >
                    <FileText size={13} className="text-neutral-500" /> 링크 복사
                  </button>
                  <button
                    onClick={() => completeAllMilestones(selectedEmployee.id)}
                    className="text-xs px-3 py-2 rounded-xl border font-semibold hover:bg-neutral-50 transition-colors whitespace-nowrap shadow-xs"
                    style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-border)', color: 'var(--color-text-title)' }}
                  >
                    전체 완료
                  </button>
                  <button
                    onClick={() => resetAllMilestones(selectedEmployee.id)}
                    className="text-xs px-3 py-2 rounded-xl border font-semibold hover:bg-red-50 transition-colors text-red-600 whitespace-nowrap shadow-xs"
                    style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-border)' }}
                  >
                    초기화
                  </button>
                </div>
              </div>

              {/* 진행률 게이지 바 */}
              <div className="p-5 rounded-2xl border shadow-xs" style={{ backgroundColor: '#F8F9FA', borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--color-text-title)' }}>
                    <ShieldCheck size={16} className="text-blue-600" />
                    온보딩 총 진행률
                  </span>
                  <span className="text-blue-600 font-extrabold text-sm">
                    {progressPercent}% <span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>({completedCount}/{MILESTONES.length} 완료)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E5EA' }}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* 주요 마일스톤 도달 캘린더 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <span className="text-neutral-500 block">입사일 (D-Day)</span>
                    <span className="font-bold text-neutral-900">{selectedEmployee.target_date || '-'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">1주차 런치 (D+7)</span>
                    <span className="font-bold text-neutral-900">{calculateMilestoneDate(selectedEmployee.target_date, 7)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">1개월 면담 (D+30)</span>
                    <span className="font-bold text-neutral-900">{calculateMilestoneDate(selectedEmployee.target_date, 30)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">수습 평가 (D+90)</span>
                    <span className="font-bold text-neutral-900">{calculateMilestoneDate(selectedEmployee.target_date, 90)}</span>
                  </div>
                </div>
              </div>

              {/* 신입사원 자동 미션 안내 이메일 스케줄러 (입사일 기준 자동 발송) */}
              <div className="p-5 rounded-2xl border space-y-4 shadow-xs" style={{ backgroundColor: '#F8F9FA', borderColor: 'rgba(0, 113, 227, 0.2)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text-title)' }}>
                      <Mail size={16} className="text-blue-600" />
                      입사일 기준 신입사원 자동 미션 안내 스케줄러
                    </h3>
                    <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                      인사팀이 수동으로 챙길 필요 없이, 입사일({selectedEmployee.target_date}) 기준으로 1일차/1주차/1개월차/3개월차 미션을 신입사원 이메일로 자동 전송합니다.
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
                    <Clock size={12} /> 자동 스케줄러 가동 중
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {[
                    { type: 'DAY_1' as const, label: '출근 1일차 웰컴 안내', phase: 'D-Day', date: selectedEmployee.target_date, summary: '웰컴 키트 수령, PC 초기화, 제휴 사진관(패밀리포토하우스) 촬영 안내 (제작 약 2주 소요)' },
                    { type: 'WEEK_1' as const, label: '1주차 멘토링 & 런치', phase: 'D+7', date: calculateMilestoneDate(selectedEmployee.target_date, 7), summary: '멘토 1:1 티타임, 사내 프로필 사진 등록, 전자결재 가이드' },
                    { type: 'MONTH_1' as const, label: '1개월차 적응도 설문', phase: 'D+30', date: calculateMilestoneDate(selectedEmployee.target_date, 30), summary: '조직 적응도 자가진단(3분), 정규 사원증/명함 수령 확인' },
                    { type: 'MONTH_3' as const, label: '3개월차 수습 평가', phase: 'D+90', date: calculateMilestoneDate(selectedEmployee.target_date, 90), summary: '수습기간 직무 수행 자체 점검표 작성, 정규직 전환 인터뷰' },
                  ].map((m) => {
                    const key = `${selectedEmployee.id}_${m.type}`;
                    const isSent = !!sentMilestones[key];
                    const isSending = sendingMilestone === key;

                    return (
                      <div 
                        key={m.type}
                        className="p-3.5 rounded-xl border flex flex-col justify-between transition-colors shadow-xs"
                        style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-border)' }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-xs" style={{ color: 'var(--color-text-title)' }}>
                              {m.label}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              {m.phase} ({m.date})
                            </span>
                          </div>
                          <p className="text-[11px] mb-3 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                            {m.summary}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
                          <div>
                            {isSent ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 size={13} /> 자동 발송 완료
                              </span>
                            ) : (
                              <span className="text-neutral-500 flex items-center gap-1 text-[11px]">
                                <Clock size={12} /> 발송 예약 대기
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewMilestone(getMilestoneDetails(m.type, selectedEmployee))}
                              className="px-2 py-1 rounded-lg bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 font-semibold flex items-center gap-1 transition-colors shadow-xs"
                            >
                              <Eye size={11} /> 미리보기
                            </button>
                            <button
                              type="button"
                              disabled={isSending}
                              onClick={() => handleSendMilestone(selectedEmployee, m.type)}
                              className="px-2.5 py-1 rounded-lg bg-[#0071E3] hover:bg-blue-600 text-white font-bold flex items-center gap-1 transition-colors disabled:opacity-50 shadow-xs"
                            >
                              {isSending ? (
                                <><Loader2 size={11} className="animate-spin" /> 발송 중</>
                              ) : (
                                <><Send size={11} /> 지금 발송</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4단계 마일스톤 체크리스트 */}
              <div className="space-y-6">
                {phases.map((phase) => {
                  const phaseMilestones = MILESTONES.filter(m => m.phase === phase.key);
                  const PhaseIcon = phase.icon;
                  const phaseDoneCount = phaseMilestones.filter(m => selectedEmpChecks[m.id]).length;
                  const isPhaseComplete = phaseDoneCount === phaseMilestones.length;

                  return (
                    <div 
                      key={phase.key} 
                      className="rounded-2xl border overflow-hidden transition-all shadow-xs"
                      style={{ 
                        backgroundColor: '#FFFFFF', 
                        borderColor: isPhaseComplete ? 'rgba(30, 142, 62, 0.3)' : 'var(--color-border)' 
                      }}
                    >
                      {/* 단계 헤더 */}
                      <div 
                        className="px-4 py-3 flex items-center justify-between border-b"
                        style={{ 
                          backgroundColor: isPhaseComplete ? '#EAF8EE' : '#F8F9FA',
                          borderColor: 'var(--color-border)' 
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="p-1.5 rounded-lg"
                            style={{ 
                              backgroundColor: `${phase.color}15`, 
                              color: phase.color 
                            }}
                          >
                            <PhaseIcon size={16} />
                          </div>
                          <h4 className="text-sm font-bold" style={{ color: 'var(--color-text-title)' }}>
                            {phase.label}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span 
                            className="px-2 py-0.5 rounded-full font-bold text-[11px]"
                            style={{ 
                              backgroundColor: isPhaseComplete ? '#D1F2D9' : '#E5E5EA',
                              color: isPhaseComplete ? '#1E8E3E' : 'var(--color-text-body)'
                            }}
                          >
                            {phaseDoneCount} / {phaseMilestones.length} 완료
                          </span>
                        </div>
                      </div>

                      {/* 체크리스트 항목들 */}
                      <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                        {phaseMilestones.map((milestone) => {
                          const isChecked = !!selectedEmpChecks[milestone.id];
                          const catBadgeColor = 
                            milestone.category === 'IT/전산' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            milestone.category === '총무/복지' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200';

                          return (
                            <div
                              key={milestone.id}
                              onClick={() => toggleMilestone(selectedEmployee.id, milestone.id)}
                              className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                                isChecked ? 'opacity-70 bg-neutral-50/50' : 'hover:bg-neutral-50/80'
                              }`}
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {isChecked ? (
                                  <CheckCircle2 size={18} className="text-emerald-600" />
                                ) : (
                                  <Circle size={18} style={{ color: 'var(--color-text-muted)' }} />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span 
                                    className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${catBadgeColor}`}
                                  >
                                    {milestone.category}
                                  </span>
                                  <span 
                                    className={`text-xs font-bold ${
                                      isChecked ? 'line-through text-neutral-400' : 'text-neutral-900'
                                    }`}
                                  >
                                    {milestone.title}
                                  </span>
                                </div>
                                <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                  {milestone.description}
                                </p>
                              </div>

                              {/* 명함 관련 항목이면 원클릭 바로가기 버튼 제공 */}
                              {milestone.id === 'day1_business_card' && onSelectEmployeeForCard && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectEmployeeForCard({
                                      name: selectedEmployee.name,
                                      department: selectedEmployee.department
                                    });
                                  }}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1 transition-colors shadow-xs"
                                >
                                  <IdCard size={12} /> 명함 제작
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 하단 인사팀 특이사항 메모란 */}
              <div className="p-4 rounded-2xl border space-y-2 shadow-xs" style={{ backgroundColor: '#F8F9FA', borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--color-text-title)' }}>
                    <FileText size={14} className="text-neutral-500" />
                    인사/전산 특이사항 및 온보딩 메모
                  </h4>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>자동 저장</span>
                </div>
                <textarea
                  rows={2}
                  value={notes[selectedEmployee.id] || ""}
                  onChange={(e) => saveNotesToStorage(selectedEmployee.id, e.target.value)}
                  placeholder={`예: 에스원 출입증 발주 번호 #1092, 듀얼 모니터 지급 완료, 멘토: 박수석`}
                  className="w-full p-2.5 text-xs rounded-xl outline-none resize-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-title)'
                  }}
                />
              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
              입사자를 선택해주세요.
            </div>
          )}
        </div>

      </div>

      {/* 공식 인쇄/PDF 모달 */}
      <DocumentPrintModal 
        data={printData} 
        onClose={() => setPrintData(null)} 
      />

      {/* 신입사원 수신 이메일 미리보기 모달 */}
      {previewMilestone && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Mail size={16} />
                </span>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-title)' }}>
                  신입사원 수신 이메일 미리보기
                </h3>
              </div>
              <button
                onClick={() => setPreviewMilestone(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* 메일 뷰어 본체 */}
            <div className="p-4 rounded-xl border bg-white text-neutral-900 text-xs space-y-3 font-sans">
              <div className="border-b pb-2 text-[11px] text-neutral-500 space-y-0.5">
                <div>보낸사람: <strong>POWER NET HR Sync</strong> &lt;onboarding@resend.dev&gt;</div>
                <div>받는사람: <strong>{selectedEmployee.name}</strong> &lt;{selectedEmployee.name}@gopowernet.com&gt;</div>
                <div>발송예정일: <strong>{previewMilestone.date}</strong></div>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-neutral-900 mb-1">
                  {selectedEmployee.name} 님, {previewMilestone.title} 🚀
                </h4>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  {previewMilestone.subtitle}
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="font-bold text-neutral-800 text-[11px] mb-1.5">
                  📌 이번 마일스톤 수행 체크리스트
                </div>
                <ul className="space-y-1 text-neutral-700 text-[11px]">
                  {previewMilestone.items.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">✔</span> {it}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 bg-blue-50 text-blue-800 rounded text-[10px] leading-relaxed">
                {previewMilestone.tip}
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white font-bold text-xs shadow-sm hover:bg-blue-800 transition-colors"
                >
                  신입사원 온보딩 로드맵 확인하기 →
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewMilestone(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-neutral-100 transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
              >
                닫기
              </button>
              <button
                type="button"
                disabled={sendingMilestone === `${selectedEmployee.id}_${previewMilestone.type}`}
                onClick={() => {
                  const mType = previewMilestone.type;
                  setPreviewMilestone(null);
                  handleSendMilestone(selectedEmployee, mType);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Send size={12} /> 지금 즉시 테스트 발송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
