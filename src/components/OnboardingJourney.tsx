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
  Download,
  Camera,
  X,
  HeartPulse,
  Check
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
    type: 'DAY_1' | 'WEEK_1' | 'MONTH_1' | 'MONTH_3' | 'MONTH_6' | 'YEAR_1';
    title: string;
    subtitle: string;
    items: string[];
    tip: string;
    date: string;
  } | null>(null);
  const [sentMilestones, setSentMilestones] = useState<{ [key: string]: boolean }>({});
  
  // 신입사원 셀프 온보딩 포털 제출 내역: { [empId]: submissionData }
  const [portalSubmissions, setPortalSubmissions] = useState<Record<string, any>>({});
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

  // 신입사원 펄스 서베이 & AI 적응도 진단 내역: { [empId]: surveyData }
  const [pulseSurveys, setPulseSurveys] = useState<Record<string, any>>({});
  const [isSurveysLoading, setIsSurveysLoading] = useState(false);

  // IT 자산 실시간 연동 상태
  const [assignedAssets, setAssignedAssets] = useState<any[]>([]);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  const loadAssignedAssets = (empName?: string) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("powernet_it_assets");
      if (raw) {
        const allAssets = JSON.parse(raw);
        if (empName) {
          setAssignedAssets(allAssets.filter((a: any) => a.empName === empName));
        }
      } else {
        setAssignedAssets([]);
      }
    } catch (e) {
      setAssignedAssets([]);
    }
  };

  const fetchPortalSubmissions = async () => {
    setIsSubmissionsLoading(true);
    try {
      const res = await fetch('/api/portal/submissions');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.submissions) {
          setPortalSubmissions(data.submissions);
        }
      }
    } catch (e) {
      console.error("Failed to load portal submissions", e);
    } finally {
      setIsSubmissionsLoading(false);
    }
  };

  const fetchPulseSurveys = async () => {
    setIsSurveysLoading(true);
    try {
      const res = await fetch('/api/onboarding/survey');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.surveys) {
          setPulseSurveys(data.surveys);
        }
      }
    } catch (e) {
      console.error("Failed to load pulse surveys", e);
    } finally {
      setIsSurveysLoading(false);
    }
  };

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
    fetchPortalSubmissions();
    fetchPulseSurveys();
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

  const getMilestoneDetails = (type: 'DAY_1' | 'WEEK_1' | 'MONTH_1' | 'MONTH_3' | 'MONTH_6' | 'YEAR_1', emp: JourneyEmployee) => {
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
          title: "입사 1개월차: 조직 적응도 펄스 서베이 참여 안내",
          subtitle: "파워넷의 소중한 일원으로 한 달간 함께해 주셔서 감사합니다! 1개월차 적응도 설문에 참여해주세요.",
          items: [
            "온보딩 1개월차 조직 적응도 3문항 펄스 서베이 참여 (약 3분 소요)",
            "인쇄 제작 완료된 정규 사원증 및 공식 명함 실물 수령 확인",
            "팀장님과의 1개월차 중간 업무 방향성 1:1 면담",
            "인사팀 온보딩 담당자와의 캐주얼 커피챗 (고충 및 건의사항)"
          ],
          tip: "💡 초기 적응 과정에서 겪는 어려운 점이나 필요한 장비가 있다면 펄스 서베이에 솔직히 기재해주세요. AI가 분석하여 인사팀 맞춤 케어를 지원합니다.",
          date: calculateMilestoneDate(emp.target_date, 30)
        };
      case 'MONTH_3':
        return {
          type,
          title: "입사 3개월차: 수습 평가 & 펄스 서베이 안내",
          subtitle: "3개월간의 수습 온보딩 여정을 훌륭히 마쳐가고 계십니다! 수습 온보딩 평가 설문에 참여해주세요.",
          items: [
            "수습 3개월차 온보딩 피드백 및 적응도 펄스 서베이 참여 (약 3분 소요)",
            "수습기간 직무 수행 자체 점검표 작성 및 부서장 면담",
            "인사총괄 정규직 전환 인터뷰 진행",
            "정규직 임용 발령 및 수습 온보딩 최종 수료"
          ],
          tip: "💡 정규직 전환 인터뷰 일정은 인사기획팀에서 부서장님과 조율 후 별도 캘린더 초대를 드립니다.",
          date: calculateMilestoneDate(emp.target_date, 90)
        };
      case 'MONTH_6':
        return {
          type,
          title: "입사 6개월차: 반기 직무 몰입 & 성장 서베이 안내",
          subtitle: "파워넷에 안착하여 의미 있는 성과를 만들어가고 계신 6개월차를 축하드립니다! 직무 몰입도 점검에 참여해주세요.",
          items: [
            "입사 6개월차 직무 몰입 & 조직 안착 펄스 서베이 참여 (약 3분 소요)",
            "상반기/하반기 업무 목표 진행도 자체 점검 및 피드백",
            "팀 멘토 및 동료들과의 반기 리프레시 티타임",
            "직무 성장 지원 프로그램(도서/교육) 신청 검토"
          ],
          tip: "💡 업무 매너리즘을 예방하고 지속적인 성장을 지원하기 위해 6개월차 설문 결과를 바탕으로 부서 맞춤 케어를 진행합니다.",
          date: calculateMilestoneDate(emp.target_date, 180)
        };
      case 'YEAR_1':
        return {
          type,
          title: "입사 1주년: 조직 안착 & 리텐션 서베이 안내",
          subtitle: "파워넷과 함께한 자랑스러운 1주년을 진심으로 축하드립니다! 1주년 리텐션 진단 설문에 참여해주세요.",
          items: [
            "입사 1주년 조직 안착 & 직무 리텐션 펄스 서베이 참여 (약 3분 소요)",
            "입사 1주년 축하 기념품/리워드 수령",
            "부서장과의 연간 직무 성과 리뷰 및 차기 연도 CDP(커리어 개발) 면담",
            "차년도 연봉 계약 및 인사 평가 프로세스 안내 확인"
          ],
          tip: "💡 1년간의 소중한 경험과 파워넷 조직 문화에 대한 솔직한 의견은 회사의 더 나은 미래를 만드는 귀중한 밑거름이 됩니다.",
          date: calculateMilestoneDate(emp.target_date, 365)
        };
    }
  };

  const handleSendMilestone = async (emp: JourneyEmployee, milestoneType: 'DAY_1' | 'WEEK_1' | 'MONTH_1' | 'MONTH_3' | 'MONTH_6' | 'YEAR_1') => {
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

  useEffect(() => {
    if (selectedEmployee?.name) {
      loadAssignedAssets(selectedEmployee.name);
    }
  }, [selectedEmployee?.name]);

  const handleProvisionDefaultAssets = () => {
    if (!selectedEmployee) return;

    const today = new Date().toISOString().split("T")[0];
    const dept = selectedEmployee.department || "";
    const isLab = dept.includes("연구소") || dept.includes("개발") || dept.includes("HW") || dept.includes("SW");

    const defaultAssets = [
      {
        id: `ast-${Date.now()}-1`,
        empName: selectedEmployee.name,
        department: selectedEmployee.department,
        category: "LAPTOP",
        modelName: isLab ? "삼성 갤럭시북4 Pro 16인치 (i7/32GB/SSD 1TB)" : "LG 그램 15 (15ZD90R)",
        serialNumber: `SN-PWN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        assignedDate: today,
        fixedIp: `192.168.10.${Math.floor(50 + Math.random() * 150)}`,
        macAddress: `00:E0:4C:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
        status: "ACTIVE",
        notes: "온보딩 자동 패키지 지급"
      },
      {
        id: `ast-${Date.now()}-2`,
        empName: selectedEmployee.name,
        department: selectedEmployee.department,
        category: "MONITOR",
        modelName: "삼성 27인치 FHD 모니터 (듀얼)",
        serialNumber: `SN-MON-27-${Math.floor(1000 + Math.random() * 9000)}`,
        assignedDate: today,
        status: "ACTIVE",
        notes: "HDMI 듀얼 연결"
      },
      {
        id: `ast-${Date.now()}-3`,
        empName: selectedEmployee.name,
        department: selectedEmployee.department,
        category: "SECURITY_CARD",
        modelName: "에스원(S1) 보안 출입카드",
        serialNumber: `S1-KEY-${Math.floor(10000 + Math.random() * 90000)}`,
        assignedDate: today,
        status: "ACTIVE",
        notes: "수원/서울 출입 권한 등록"
      }
    ];

    try {
      const raw = localStorage.getItem("powernet_it_assets");
      const existing = raw ? JSON.parse(raw) : [];
      const updated = [...defaultAssets, ...existing];
      localStorage.setItem("powernet_it_assets", JSON.stringify(updated));
      setAssignedAssets(defaultAssets);

      // 온보딩 체크리스트의 PC세팅, 네트워크, 사원증 발주 항목을 자동 완료(true) 처리
      const empChecks = checklists[selectedEmployee.id] || {};
      const updatedEmpChecks = {
        ...empChecks,
        pre_pc_setup: true,
        pre_network: true,
        day1_pass_s1: true
      };
      const updatedFull = {
        ...checklists,
        [selectedEmployee.id]: updatedEmpChecks
      };
      saveChecklistsToStorage(updatedFull);

      alert(`🎉 ${selectedEmployee.name} 님에게 기본 IT 장비 3종(노트북, 듀얼 모니터, 에스원 카드)이 성공적으로 배정되었습니다!\n\n관련 온보딩 체크리스트(PC 세팅, 고정 IP, 출입증 발주) 3건이 자동으로 완료 처리되었습니다.`);
      setIsAssetModalOpen(false);
    } catch (err: any) {
      alert("장비 지급 중 오류가 발생했습니다: " + err.message);
    }
  };

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

                      {/* 셀프 포털 접수 완료 뱃지 */}
                      {portalSubmissions[emp.id] && (
                        <div className="mt-2 pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                          <span className="px-1.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <CheckCircle2 size={10} /> 포털 접수 완료
                          </span>
                          <span className="text-neutral-400 font-medium">
                            {new Date(portalSubmissions[emp.id].submittedAt).toLocaleDateString([], { month: '2-digit', day: '2-digit' })}
                          </span>
                        </div>
                      )}

                      {/* AI 조직 적응도 펄스 서베이 위험 신호 뱃지 */}
                      {pulseSurveys[emp.id] && (() => {
                        const s = pulseSurveys[emp.id];
                        const flag = s.analysis?.flag || 'GREEN';
                        return (
                          <div className="mt-1 pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                            <span className={`px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 ${
                              flag === 'RED'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : flag === 'YELLOW'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                flag === 'RED' ? 'bg-red-500 animate-ping' : flag === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                              {flag === 'RED' ? '🚨 Red Flag' : flag === 'YELLOW' ? '⚠️ Yellow Flag' : '✨ Green Flag'}
                            </span>
                            <span className="text-neutral-500 font-medium">
                              위험도 {s.analysis?.riskScore ?? 0}%
                            </span>
                          </div>
                        );
                      })()}
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
                      loadAssignedAssets(selectedEmployee.name);
                      setIsAssetModalOpen(true);
                    }}
                    className={`text-xs px-3 py-2 rounded-xl border font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
                      assignedAssets.length > 0 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                        : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                    }`}
                    title="IT 자산 대장과 실시간 연동된 장비 지급 및 조회"
                  >
                    <Laptop size={13} className={assignedAssets.length > 0 ? "text-emerald-600" : "text-indigo-600"} />
                    {assignedAssets.length > 0 ? `IT 장비 현황 (${assignedAssets.length}건)` : "⚡ IT 장비 원클릭 지급"}
                  </button>
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

                {/* 7대 온보딩 타임라인 스테퍼 (D-7 ~ D+365) */}
                {(() => {
                  const dDayInfo = getDDayInfo(selectedEmployee.target_date);
                  const diffDays = dDayInfo.diffDays;

                  const steps = [
                    { key: "D-7", label: "사전 준비", dDay: "D-7", days: -7, date: calculateMilestoneDate(selectedEmployee.target_date, -7) },
                    { key: "DAY_1", label: "첫 출근", dDay: "D-Day", days: 0, date: selectedEmployee.target_date || '-' },
                    { key: "WEEK_1", label: "1주차 런치", dDay: "D+7", days: 7, date: calculateMilestoneDate(selectedEmployee.target_date, 7) },
                    { key: "MONTH_1", label: "1개월 적응", dDay: "D+30", days: 30, date: calculateMilestoneDate(selectedEmployee.target_date, 30), isSurvey: true },
                    { key: "MONTH_3", label: "3개월 수습", dDay: "D+90", days: 90, date: calculateMilestoneDate(selectedEmployee.target_date, 90), isSurvey: true },
                    { key: "MONTH_6", label: "6개월 몰입", dDay: "D+180", days: 180, date: calculateMilestoneDate(selectedEmployee.target_date, 180), isSurvey: true },
                    { key: "YEAR_1", label: "1년차 안착", dDay: "D+365", days: 365, date: calculateMilestoneDate(selectedEmployee.target_date, 365), isSurvey: true },
                  ];

                  let activeIndex = 0;
                  if (diffDays > 0) {
                    activeIndex = 0;
                  } else if (diffDays === 0) {
                    activeIndex = 1;
                  } else {
                    const el = Math.abs(diffDays);
                    if (el <= 7) activeIndex = 2;
                    else if (el <= 30) activeIndex = 3;
                    else if (el <= 90) activeIndex = 4;
                    else if (el <= 180) activeIndex = 5;
                    else activeIndex = 6;
                  }

                  return (
                    <div className="mt-4 pt-3 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#0071E3]" />
                          온보딩 라이프사이클 마일스톤 (D-7 ~ 1주년)
                        </span>
                        <span className="text-[11px] font-bold text-[#0071E3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                          현재: {steps[activeIndex].dDay} ({steps[activeIndex].label})
                        </span>
                      </div>

                      <div className="relative pt-2 pb-1 overflow-x-auto">
                        <div className="min-w-[620px] flex items-center justify-between relative px-2">
                          {/* Background Connecting Line */}
                          <div className="absolute left-8 right-8 top-3.5 h-0.5 bg-[#E5E5EA] -z-0" />
                          
                          {/* Active Progress Line */}
                          <div 
                            className="absolute left-8 top-3.5 h-0.5 bg-[#0071E3] transition-all duration-500 -z-0" 
                            style={{ width: `${(activeIndex / (steps.length - 1)) * 92}%` }}
                          />

                          {steps.map((step, idx) => {
                            const isPassed = idx < activeIndex;
                            const isCurrent = idx === activeIndex;

                            return (
                              <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                                <div 
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                    isCurrent 
                                      ? "bg-[#0071E3] text-white ring-4 ring-blue-100 scale-110" 
                                      : isPassed 
                                      ? "bg-emerald-500 text-white" 
                                      : "bg-white text-neutral-400 border border-neutral-300"
                                  }`}
                                >
                                  {isPassed ? <Check size={13} className="stroke-[3]" /> : idx + 1}
                                </div>
                                
                                <span className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${
                                  isCurrent ? "text-[#0071E3]" : isPassed ? "text-neutral-800" : "text-neutral-400"
                                }`}>
                                  {step.dDay}
                                </span>

                                <span className="text-[10px] text-neutral-500 font-medium whitespace-nowrap">
                                  {step.label}
                                </span>

                                <span className="text-[9px] text-neutral-400 font-mono mt-0.5 whitespace-nowrap">
                                  {step.date}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 🤖 피플 애널리틱스: AI 신입사원 조직 적응도 & 조기퇴사 위험 신호 진단 리포트 */}
              {(() => {
                const survey = pulseSurveys[selectedEmployee.id];
                const analysis = survey?.analysis;
                const flag = analysis?.flag || 'NONE';
                const riskScore = analysis?.riskScore ?? 0;
                const totalScore = analysis?.totalScore ?? 0;

                return (
                  <div 
                    className="p-5 rounded-2xl border space-y-4 shadow-xs transition-all"
                    style={{ 
                      backgroundColor: survey ? '#FFFFFF' : '#F8F9FA',
                      borderColor: flag === 'RED' ? '#EF4444' : flag === 'YELLOW' ? '#F59E0B' : flag === 'GREEN' ? '#10B981' : 'var(--color-border)',
                      borderWidth: survey ? '1.5px' : '1px'
                    }}
                  >
                    {/* 카드 헤더 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${
                          flag === 'RED' ? 'bg-red-50 text-red-600' : flag === 'YELLOW' ? 'bg-amber-50 text-amber-600' : flag === 'GREEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          <HeartPulse size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-neutral-900">
                              피플 애널리틱스: AI 조직 적응도 & 조기퇴사 위험 신호 진단
                            </h3>
                            {survey ? (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border flex items-center gap-1 shadow-xs ${
                                flag === 'RED' 
                                  ? 'bg-red-50 text-red-700 border-red-200' 
                                  : flag === 'YELLOW' 
                                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${flag === 'RED' ? 'bg-red-500 animate-ping' : flag === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                {analysis.flagTitle}
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
                                설문 미응답 (진단 대기)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            입사 1개월, 3개월, 6개월, 1년차 자동 발송 펄스 서베이 데이터를 기반으로 조기 이탈 위험을 선제 포착합니다.
                          </p>
                        </div>
                      </div>

                      {survey && (
                        <button
                          onClick={fetchPulseSurveys}
                          disabled={isSurveysLoading}
                          className="text-xs px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 flex items-center gap-1 self-start sm:self-auto transition-colors"
                        >
                          <RefreshCw size={12} className={isSurveysLoading ? 'animate-spin' : ''} /> AI 재진단
                        </button>
                      )}
                    </div>

                    {survey && analysis ? (
                      <div className="space-y-4">
                        {/* 1. 위험도 게이지 및 종합 지표 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          
                          {/* 위험도 게이지 박스 */}
                          <div className={`p-3.5 rounded-2xl border ${
                            flag === 'RED' ? 'bg-red-50/50 border-red-200' : flag === 'YELLOW' ? 'bg-amber-50/50 border-amber-200' : 'bg-emerald-50/50 border-emerald-200'
                          }`}>
                            <div className="flex items-center justify-between text-xs font-bold mb-1">
                              <span className="text-neutral-700">조기퇴사 위험 지수</span>
                              <span className={`text-sm font-black ${
                                flag === 'RED' ? 'text-red-600' : flag === 'YELLOW' ? 'text-amber-600' : 'text-emerald-600'
                              }`}>
                                {riskScore}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 rounded-full ${
                                  flag === 'RED' ? 'bg-red-500' : flag === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${riskScore}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-1.5 flex justify-between font-medium">
                              <span>0% (안정)</span>
                              <span>50% (주의)</span>
                              <span>100% (위험)</span>
                            </div>
                          </div>

                          {/* 총점 및 평가 회차 */}
                          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                            <span className="text-[11px] text-neutral-500 font-medium">서베이 회차 및 총점</span>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-xl font-black text-neutral-900">{totalScore}</span>
                              <span className="text-xs text-neutral-500">/ 15점 만점</span>
                            </div>
                            <span className="text-[11px] font-bold text-neutral-700 mt-1">
                              {survey.stage === 'YEAR_1' ? '입사 1주년 안착 진단' : survey.stage === 'MONTH_6' ? '6개월차 직무 몰입 점검' : survey.stage === 'MONTH_3' || survey.stage === 'D_90' ? '수습 3개월차 최종 평가' : '입사 1개월차 안착 점검'}
                            </span>
                          </div>

                          {/* 3문항 세부 점수 */}
                          {(() => {
                            const labels = analysis.scores?.labels || {
                              score1: survey.stage === 'MONTH_3' || survey.stage === 'D_90' ? '직무 R&R/목표 명확성' : survey.stage === 'MONTH_6' ? '직무 역량 성장감' : survey.stage === 'YEAR_1' ? '중장기 커리어 비전' : '초기 업무 난이도',
                              score2: survey.stage === 'MONTH_3' || survey.stage === 'D_90' ? '부서·협업 원활성' : survey.stage === 'MONTH_6' ? '성과 피드백·인정' : survey.stage === 'YEAR_1' ? '평가/보상·조직문화' : '사수·팀원 소통',
                              score3: survey.stage === 'MONTH_3' || survey.stage === 'D_90' ? '업무 자율성/주도권' : survey.stage === 'MONTH_6' ? '업무 몰입·워라밸' : survey.stage === 'YEAR_1' ? '회사 추천(eNPS)' : 'IT·장비 인프라',
                            };
                            const icon1 = survey.stage === 'MONTH_3' || survey.stage === 'D_90' ? '🎯' : survey.stage === 'MONTH_6' ? '📈' : survey.stage === 'YEAR_1' ? '🧭' : '💼';
                            const icon2 = survey.stage === 'MONTH_3' || survey.stage === 'D_90' ? '👥' : survey.stage === 'MONTH_6' ? '🏆' : survey.stage === 'YEAR_1' ? '🏛️' : '🤝';
                            const icon3 = survey.stage === 'MONTH_3' || survey.stage === 'D_90' ? '✨' : survey.stage === 'MONTH_6' ? '⚖️' : survey.stage === 'YEAR_1' ? '🎁' : '💻';

                            return (
                              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-neutral-600 truncate mr-2">{icon1} {labels.score1}</span>
                                  <span className="font-bold text-neutral-900 shrink-0">{analysis.scores?.workScore ?? 0} / 5</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-neutral-600 truncate mr-2">{icon2} {labels.score2}</span>
                                  <span className="font-bold text-neutral-900 shrink-0">{analysis.scores?.teamScore ?? 0} / 5</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-neutral-600 truncate mr-2">{icon3} {labels.score3}</span>
                                  <span className="font-bold text-neutral-900 shrink-0">{analysis.scores?.equipScore ?? 0} / 5</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* 2. AI 심층 진단 브리핑 (Apple-style Highlight Quote Card) */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-white border border-blue-100 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                            <Sparkles size={14} />
                            <span>AI 피플 애널리틱스 종합 진단 소견</span>
                          </div>
                          <p className="text-xs text-neutral-800 leading-relaxed font-normal">
                            {analysis.aiDiagnosis}
                          </p>
                          {survey.feedbackText && (
                            <div className="pt-1 mt-2 border-t border-blue-100 text-[11px] text-neutral-600">
                              <strong className="text-neutral-800">입사자 전달 메시지:</strong> &ldquo;{survey.feedbackText}&rdquo;
                            </div>
                          )}
                        </div>

                        {/* 3. 위험 징후 및 추천 HR 액션 플랜 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* 위험/주의 요인 */}
                          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-2">
                            <span className="font-bold text-neutral-800 flex items-center gap-1.5 text-[11px]">
                              <AlertCircle size={13} className={flag === 'RED' ? 'text-red-500' : 'text-amber-500'} />
                              주요 관찰 징후 & 요인
                            </span>
                            <ul className="space-y-1 text-[11px] text-neutral-600">
                              {(analysis.riskFactors || []).map((factor: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-neutral-400 mt-0.5">•</span>
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 추천 액션 플랜 */}
                          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-2">
                            <span className="font-bold text-neutral-800 flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 size={13} className="text-blue-600" />
                              인사팀 추천 즉각 실행 플랜
                            </span>
                            <ul className="space-y-1 text-[11px] text-neutral-600">
                              {(analysis.actionItems || []).map((action: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-blue-500 mt-0.5">✔</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* 4. 빠른 조치 버튼 바 */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100">
                          <button
                            type="button"
                            onClick={() => {
                              alert(`[1:1 긴급 케어 면담 예약]\n\n대상자: ${selectedEmployee.name} (${selectedEmployee.department})\n진단 신호: ${analysis.flagTitle}\n\n사내 그룹웨어 캘린더에 인사기획팀 1:1 케어 미팅 일정이 예약 요청되었습니다.`);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                              flag === 'RED'
                                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                                : 'bg-[#0071E3] hover:bg-blue-600 text-white'
                            }`}
                          >
                            <UserCheck size={13} /> 1:1 긴급 케어 면담 예약
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              alert(`[멘토(사수) 티타임 알림 발송]\n\n대상자: ${selectedEmployee.name}\n멘토에게 사내 메신저로 1:1 커피챗 지원 및 애로사항 청취 요청이 전송되었습니다.`);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <HeartHandshake size={13} /> 멘토 커피챗 알림
                          </button>

                          <a
                            href={`/onboard/survey/${selectedEmployee.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 transition-all shadow-xs flex items-center gap-1.5 ml-auto"
                          >
                            <ExternalLink size={13} /> 모바일 펄스 서베이 열기
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* 설문 미응답 대기 상태 안내 */
                      <div className="p-4 rounded-xl bg-white border border-dashed border-neutral-200 text-center space-y-2">
                        <p className="text-xs text-neutral-500">
                          아직 {selectedEmployee.name} 님의 정기(1개월, 3개월, 6개월, 1년) 조직 적응도 펄스 서베이가 접수되지 않았습니다. 입사일 기준 해당 시점에 자동 이메일이 발송됩니다.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const surveyUrl = `${window.location.origin}/onboard/survey/${selectedEmployee.id}`;
                              navigator.clipboard.writeText(surveyUrl);
                              alert(`신입사원 펄스 서베이 링크가 복사되었습니다!\n\n${surveyUrl}\n\n입사자에게 전달하여 3문항 설문 참여를 안내하세요.`);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <FileText size={12} /> 설문 참여 링크 복사하기
                          </button>
                          <a
                            href={`/onboard/survey/${selectedEmployee.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <ExternalLink size={12} /> 모바일 설문 페이지 바로가기
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 신입사원 셀프 온보딩 접수 현황 카드 */}
              {(() => {
                const submission = portalSubmissions[selectedEmployee.id];
                return (
                  <div 
                    className="p-5 rounded-2xl border space-y-4 shadow-xs transition-all"
                    style={{ 
                      backgroundColor: submission ? '#FFFFFF' : '#F8F9FA', 
                      borderColor: submission ? '#0071E3' : 'var(--color-border)',
                      borderWidth: submission ? '1.5px' : '1px'
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${submission ? 'bg-blue-50 text-blue-600' : 'bg-neutral-100 text-neutral-500'}`}>
                          <IdCard size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-neutral-900">
                              신입사원 셀프 온보딩 포털 접수 현황
                            </h3>
                            {submission ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-xs">
                                <CheckCircle2 size={11} /> 서류/사진 접수 완료
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-neutral-200/70 text-neutral-600 border border-neutral-300">
                                ⏳ 미제출 (작성 대기)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500">
                            {submission 
                              ? `입사자가 모바일 포털에서 사전 서류를 확인하고 사원증 사진을 접수했습니다. (제출일시: ${new Date(submission.submittedAt).toLocaleString()})`
                              : "입사자가 아직 셀프 온보딩 포털에서 필수 준비물을 확인하거나 사원증 사진을 등록하지 않았습니다."
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={fetchPortalSubmissions}
                          title="접수 내역 새로고침"
                          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors shadow-xs"
                        >
                          <RefreshCw size={13} className={isSubmissionsLoading ? "animate-spin" : ""} />
                        </button>
                        <a
                          href={`/onboard/portal/${selectedEmployee.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <ExternalLink size={12} /> 입사자 포털 화면
                        </a>
                      </div>
                    </div>

                    {submission ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        {/* 1. 사원증 사진 프리뷰 & 다운로드 (4 cols) */}
                        <div className="md:col-span-4 bg-[#F8F9FA] p-3.5 rounded-2xl border border-neutral-200 text-center space-y-2">
                          <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">
                            사원증 / 에스원 출입증 사진
                          </span>
                          
                          <div className="w-28 h-36 mx-auto rounded-xl bg-neutral-900 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                            {submission.photoData ? (
                              <img src={submission.photoData} alt={`${selectedEmployee.name} 증명사진`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center p-2 text-neutral-400 text-xs">
                                <Camera size={24} className="mx-auto mb-1 opacity-50" />
                                사진 미등록
                              </div>
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <div className="font-bold text-xs text-neutral-900">{selectedEmployee.name}</div>
                            <div className="text-[10px] text-neutral-500">{selectedEmployee.department}</div>
                          </div>

                          {submission.photoData && (
                            <div className="pt-1">
                              <a
                                href={submission.photoData}
                                download={`${selectedEmployee.name}_사원증사진.jpg`}
                                className="w-full py-1.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                              >
                                <Download size={12} /> 사진 원본 다운로드
                              </a>
                              <span className="text-[9px] text-neutral-400 block mt-1">에스원(S1) 출입증 발주용</span>
                            </div>
                          )}
                        </div>

                        {/* 2. 입사 각오 메시지 및 준비물 현황 (8 cols) */}
                        <div className="md:col-span-8 space-y-3">
                          {/* 입사자 각오 한마디 */}
                          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                            <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1">
                              <Sparkles size={11} /> 신입사원 입사 소감 & 인사팀 전달 메시지
                            </span>
                            <p className="text-xs text-neutral-900 font-medium leading-relaxed italic bg-white p-3 rounded-xl border border-blue-100/80 shadow-xs">
                              &ldquo;{submission.welcomeNote || "파워넷 가족이 되어 매우 기쁩니다. 첫 출근일에 뵙겠습니다!"}&rdquo;
                            </p>
                          </div>

                          {/* 5대 서류 & 준비물 체크 상태 */}
                          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-neutral-200 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-neutral-700">입사자 서류 및 사전 준비물 체크 현황</span>
                              <span className="text-blue-600 font-bold">
                                {submission.completedCount || Object.values(submission.checklist || {}).filter(Boolean).length} / {submission.totalCount || 5} 확인 완료
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                              {[
                                { key: 'id_card', label: '본인 신분증 지참' },
                                { key: 'bank_book', label: '급여 계좌 통장 사본' },
                                { key: 'graduation', label: '최종 학력 증명서' },
                                { key: 'dress_code', label: '비즈니스 캐주얼 확인' },
                                { key: 'lunch_guide', label: '첫날 웰컴 런치 확인' },
                              ].map((it) => {
                                const checked = submission.checklist && submission.checklist[it.key];
                                return (
                                  <div key={it.key} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-neutral-200 text-[11px]">
                                    <span className={checked ? "text-emerald-600 font-bold" : "text-neutral-400"}>
                                      {checked ? "✔" : "○"}
                                    </span>
                                    <span className={checked ? "font-semibold text-neutral-900" : "text-neutral-500"}>
                                      {it.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white border border-dashed border-neutral-200 text-center space-y-2">
                        <p className="text-xs text-neutral-500">
                          아직 입사자가 셀프 온보딩 포털을 제출하지 않았습니다. 입사자에게 문자/메일로 링크를 전달하세요.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const portalUrl = `${window.location.origin}/onboard/portal/${selectedEmployee.id}`;
                              navigator.clipboard.writeText(portalUrl);
                              alert(`신입사원 온보딩 포털 링크가 복사되었습니다!\n\n${portalUrl}\n\n입사자에게 문자, 카카오톡 또는 이메일로 전달하세요.`);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <FileText size={12} /> 포털 링크 복사하기
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 신입사원 자동 미션 안내 이메일 스케줄러 (입사일 기준 자동 발송) */}
              <div className="p-5 rounded-2xl border space-y-4 shadow-xs" style={{ backgroundColor: '#F8F9FA', borderColor: 'rgba(0, 113, 227, 0.2)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text-title)' }}>
                      <Mail size={16} className="text-blue-600" />
                      입사일 기준 신입사원 자동 미션 & 정기 펄스 서베이 스케줄러
                    </h3>
                    <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                      입사일({selectedEmployee.target_date}) 기준으로 출근 1일차/1주차 미션 및 1개월/3개월/6개월/1년차 정기 펄스 서베이를 신입사원 이메일로 자동 스케줄링 발송합니다.
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
                    <Clock size={12} /> 자동 스케줄러 가동 중
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {[
                    { type: 'DAY_1' as const, label: '1일차 웰컴 안내', phase: 'D-Day', isSurvey: false, date: selectedEmployee.target_date, summary: '웰컴 키트 수령, PC 초기화, 제휴 사진관(패밀리포토하우스) 촬영 안내 (제작 약 2주 소요)' },
                    { type: 'WEEK_1' as const, label: '1주차 멘토링 & 런치', phase: 'D+7', isSurvey: false, date: calculateMilestoneDate(selectedEmployee.target_date, 7), summary: '멘토 1:1 티타임, 사내 프로필 사진 등록, 전자결재 가이드' },
                    { type: 'MONTH_1' as const, label: '1개월차 적응도 설문', phase: 'D+30', isSurvey: true, date: calculateMilestoneDate(selectedEmployee.target_date, 30), summary: '📊 조직 적응도 자가진단(3분), 정규 사원증/명함 수령 확인' },
                    { type: 'MONTH_3' as const, label: '3개월차 수습 평가', phase: 'D+90', isSurvey: true, date: calculateMilestoneDate(selectedEmployee.target_date, 90), summary: '📊 수습 3개월차 온보딩 피드백(3분), 정규직 전환 인터뷰' },
                    { type: 'MONTH_6' as const, label: '6개월차 직무 몰입 설문', phase: 'D+180', isSurvey: true, date: calculateMilestoneDate(selectedEmployee.target_date, 180), summary: '📊 반기 직무 몰입도 & 성장 점검(3분), 목표 달성도 피드백' },
                    { type: 'YEAR_1' as const, label: '1년차 안착 & 리텐션 설문', phase: 'D+365', isSurvey: true, date: calculateMilestoneDate(selectedEmployee.target_date, 365), summary: '📊 입사 1주년 안착 & 리텐션 진단(3분), 연간 성과 리뷰 & CDP' },
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
                {['MONTH_1', 'MONTH_3', 'MONTH_6', 'YEAR_1'].includes(previewMilestone.type) ? (
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-sm hover:bg-purple-800 transition-colors"
                  >
                    📊 펄스 서베이 참여하기 (소요시간 약 3분) →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-blue-700 text-white font-bold text-xs shadow-sm hover:bg-blue-800 transition-colors"
                  >
                    신입사원 온보딩 전용 포털 바로가기 →
                  </button>
                )}
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

      {/* IT 자산 실시간 지급 및 관리 연동 모달 */}
      {isAssetModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#F8F9FA] border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Laptop size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-900">
                    신입사원 IT 기본 장비 패키지 연동 관리
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    IT 자산 대장 및 온보딩 체크리스트와 100% 실시간 연동됩니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssetModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* 본문 */}
            <div className="p-6 space-y-4 text-xs">
              {/* 대상자 박스 */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-semibold">지급 대상자</span>
                  <strong className="text-sm text-neutral-900 font-bold">
                    {selectedEmployee.name} ({selectedEmployee.department})
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block font-semibold">입사 예정일</span>
                  <span className="font-bold text-neutral-700">{selectedEmployee.target_date || "-"}</span>
                </div>
              </div>

              {assignedAssets.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      현재 배정된 IT 자산 목록 ({assignedAssets.length}건)
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      정상 지급 완료
                    </span>
                  </div>

                  <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead className="bg-[#F8F9FA] border-b text-neutral-500 font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">분류</th>
                          <th className="py-2.5 px-3">모델명</th>
                          <th className="py-2.5 px-3">시리얼 번호</th>
                          <th className="py-2.5 px-3">IP / MAC</th>
                          <th className="py-2.5 px-3">상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {assignedAssets.map((asset: any) => (
                          <tr key={asset.id} className="hover:bg-neutral-50">
                            <td className="py-2 px-3">
                              <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-neutral-100 text-neutral-700">
                                {asset.category === 'LAPTOP' ? '노트북' : asset.category === 'MONITOR' ? '모니터' : asset.category === 'SECURITY_CARD' ? '출입카드' : asset.category}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-bold text-neutral-800">{asset.modelName}</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-neutral-500">{asset.serialNumber}</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-neutral-500">{asset.fixedIp || "-"}</td>
                            <td className="py-2 px-3">
                              <span className="text-emerald-600 font-bold text-[10px]">운용중</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-700 leading-relaxed">
                    💡 이미 기본 장비가 배정되어 있습니다. 추가 지급이나 반납 관리는 상단 <strong>[IT 자산 관리]</strong> 탭에서 언제든 진행하실 수 있습니다.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-600" />
                      신입사원 표준 IT 패키지 (3종 자동 구성)
                    </span>
                    <span className="text-[11px] font-bold text-neutral-500">원클릭 자동 발급 대기</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        1. 노트북 PC
                      </span>
                      <div className="font-bold text-xs text-neutral-900 pt-1">
                        {(selectedEmployee.department || "").includes("연구소") || (selectedEmployee.department || "").includes("개발")
                          ? "갤럭시북4 Pro 16인치"
                          : "LG 그램 15 (15ZD90R)"}
                      </div>
                      <p className="text-[10px] text-neutral-500">고성능 SSD / OS 설치 / IP 할당</p>
                    </div>

                    <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        2. 듀얼 모니터
                      </span>
                      <div className="font-bold text-xs text-neutral-900 pt-1">
                        삼성 27인치 FHD (듀얼)
                      </div>
                      <p className="text-[10px] text-neutral-500">HDMI 케이블 & 거치대 세트</p>
                    </div>

                    <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                        3. 보안 출입카드
                      </span>
                      <div className="font-bold text-xs text-neutral-900 pt-1">
                        에스원(S1) 보안 출입증
                      </div>
                      <p className="text-[10px] text-neutral-500">수원 본사 / 서울 연구소 출입</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-[11px] text-indigo-800 leading-relaxed">
                    ✨ <strong>원클릭 지급 시 자동 연동 혜택:</strong><br />
                    1. 사내 IT 자산 대장에 해당 직원의 장비 3종(고유 S/N, IP 포함)이 즉시 영구 등록됩니다.<br />
                    2. 온보딩 체크리스트의 <strong>'PC 세팅', '고정 IP 할당', '출입증 발주' 3개 항목이 자동으로 완료(✔)</strong> 처리됩니다.
                  </div>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t bg-[#F8F9FA] border-neutral-200">
              <button
                type="button"
                onClick={() => setIsAssetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-200/50 transition-colors"
              >
                닫기
              </button>
              {assignedAssets.length === 0 && (
                <button
                  type="button"
                  onClick={handleProvisionDefaultAssets}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0071E3] hover:bg-blue-600 text-white transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles size={14} /> 기본 3종 패키지 즉시 지급 및 체크리스트 자동 완료
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
