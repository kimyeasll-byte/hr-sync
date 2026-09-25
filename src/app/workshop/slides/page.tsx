"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Download, 
  Home, 
  Monitor, 
  FileText, 
  BookOpen, 
  Sparkles,
  Zap,
  Play,
  RotateCcw
} from "lucide-react";

interface SlideData {
  id: number;
  category: string;
  title: string;
  subtitle?: string;
  type: "cover" | "two_col" | "grid_3" | "grid_4" | "grid_6" | "prompt_box" | "closing";
  content: any;
  speakerNotes: string;
}

const SLIDES: SlideData[] = [
  // Slide 1
  {
    id: 1,
    category: "AI ENGINEERING WORKSHOP",
    title: "아이디어만 있으면 3일 만에\n실제 웹 서비스를 만드는 법",
    subtitle: "코딩 문법 대신 AI를 내 파트너(Pair Programmer)로 부리는 5단계 실전 가이드",
    type: "cover",
    content: {
      tagline: "사내 업무 혁신을 위한 비개발자 대상 실전 세미나",
      author: "(주)파워넷 인사기획팀 / HR Sync 개발 TF",
      badges: ["90분 참여형 워크숍", "비개발자 환영", "실전 핸즈온"]
    },
    speakerNotes: "안녕하세요, 팀원 여러분! 오늘 워크숍의 제목은 '아이디어만 있으면 누구나 웹서비스를 만드는 법'입니다. 오늘 파이썬이나 자바스크립트 문법은 단 한 줄도 외우지 않습니다. 대신 우리가 매일 겪는 귀찮은 업무를 AI라는 천재 개발자에게 명확하게 지시해서 단 며칠 만에 실제 서비스로 만들어내는 디렉팅 방법을 마스터하실 겁니다!"
  },
  // Slide 2
  {
    id: 2,
    category: "PART 1. PROBLEM SHARING",
    title: "우리의 하루는 왜 엑셀과 카톡으로 끝나는가?",
    type: "two_col",
    content: {
      left: {
        title: "❌ 엑셀 수작업과 사내 IT의 현실",
        color: "red",
        bullets: [
          "입퇴사, 비품 대여, 일정 취합, 경비 정산의 무한 반복",
          "전산팀 요청 시: '우선순위 밀렸습니다. 6개월 뒤 검토'",
          "외주 SI 개발 견적: 수천만 원 & 긴 결재 과정",
          "결국 담당자는 오늘도 엑셀을 열고 수작업 야근 시작..."
        ]
      },
      right: {
        title: "💬 3분 참여 미션: 채팅창에 적어주세요!",
        color: "blue",
        bullets: [
          "\"내 업무 중 가장 전산화하고 싶은 귀찮은 일 1가지\"",
          "예시 1: 법인차량 / 회의실 실시간 예약 및 중복 방지",
          "예시 2: 신규 입사자 PC/계정/출입증 원터치 배정",
          "예시 3: 표준 계약서 필수 조항 자동 검토",
          "👉 지금 채팅창에 남겨주신 아이디어가 오늘 실습의 재료가 됩니다!"
        ]
      }
    },
    speakerNotes: "우리가 회사에서 일하다 보면 이런 생각 진짜 많이 하죠. 지금 채팅창에 여러분이 매일 하면서 귀찮은 업무 하나씩만 남겨주세요. 그 아이디어가 오늘 우리 실습의 진짜 주인공이 될 겁니다!"
  },
  // Slide 3
  {
    id: 3,
    category: "PART 2. PARADIGM SHIFT",
    title: "코더(Coder)가 아닌 디렉터(Director)가 되자",
    type: "two_col",
    content: {
      left: {
        title: "과거: 개발자가 왕이었던 시대",
        color: "gray",
        bullets: [
          "문법(Syntax)을 외워야 서비스 개발 가능",
          "기획자 ➔ 디자이너 ➔ 개발자 ➔ QA의 긴 파이프라인",
          "수정 한 번 하려면 개발자 눈치 봐야 함",
          "현업의 맥락을 모르는 개발자가 엉뚱한 화면을 만듦"
        ]
      },
      right: {
        title: "현재: 업무를 아는 기획자가 왕인 시대",
        color: "emerald",
        bullets: [
          "코딩은 AI가 1초 만에 100줄씩 대신 작성",
          "진짜 중요한 것: '업무 규칙과 사용자 동선 정의'",
          "현업 실무자 = AI 개발팀을 지휘하는 수석 PM",
          "'이 버튼 위치 바꿔줘', '엑셀 다운로드 추가해줘'로 즉시 개선"
        ]
      }
    },
    speakerNotes: "AI 시대에는 공식이 완전히 바뀌었습니다. 코딩은 AI가 1초 만에 짭니다. 진짜 중요한 건 사내 업무 룰과 사용자 동선입니다. 여러분은 코더가 아니라 AI 개발팀을 거느린 수석 PM입니다!"
  },
  // Slide 4
  {
    id: 4,
    category: "PART 2. THE BLUEPRINT",
    title: "웹서비스 제작 6단계 엔드투엔드(End-to-End) 지도",
    type: "grid_6",
    content: {
      steps: [
        { num: "0단계", title: "아이디어 발제", desc: "현업의 고통과 비효율 털어놓기" },
        { num: "1단계", title: "AI 심층 역인터뷰", desc: "AI가 나를 인터뷰해 빈틈을 파냄" },
        { num: "2단계", title: "도메인 & PRD 문서", desc: "할 일과 안 할 일의 경계 긋기" },
        { num: "3단계", title: "UX/UI 디자인 토큰", desc: "애플 스타일 라이트 모드 규칙" },
        { num: "4단계", title: "기술 아키텍처 (ADR)", desc: "무료 클라우드 스택 (0원) 결정" },
        { num: "5단계", title: "점진적 구현 (Iteration)", desc: "벽돌 쌓듯이 5일 만에 완성" }
      ]
    },
    speakerNotes: "우리가 실제로 밟았던 6단계 지도입니다. 많은 분들이 아이디어에서 바로 코딩으로 점프하다 망합니다. 가장 중요한 마법은 1단계, AI에게 나를 인터뷰하게 만드는 기술입니다."
  },
  // Slide 5
  {
    id: 5,
    category: "PART 2. CORE METHOD",
    title: "1급 비밀: AI에게 나를 집요하게 취조(Grill-Me)하게 하라",
    type: "prompt_box",
    content: {
      promptTitle: "🎯 마법의 인터뷰 요청 프롬프트 (Golden Prompt)",
      promptText: "\"너는 15년 차 수석 프로덕트 매니저(PM)이자 아키텍트야. 내가 말한 아이디어를 웹서비스로 만들기 위해 필요한 질문을 나에게 5개씩 던져줘. 기술 용어 쓰지 말고, 현업의 업무 프로세스, 대상 사용자, 예외 상황에 대해 나를 인터뷰해줘. 내 답변을 들은 뒤 다음 질문을 해.\"",
      examples: [
        { q: "질문 1. 사업장과 도메인은?", a: "수원 연구소, 서울 본사 2곳이며 @gopowernet.com 체계 도출" },
        { q: "질문 2. 화면 분리는 어떻게?", a: "신입사원은 스마트폰 모바일 포털, 관리자는 PC 대시보드로 분리" },
        { q: "질문 3. 설문 주기는 언제?", a: "첫날엔 필요 없고, 1M/3M/6M/1Y 주기로 이메일 자동 발송" }
      ]
    },
    speakerNotes: "비개발자는 본인이 뭘 모르는지 모릅니다. 그래서 AI에게 역으로 나를 집요하게 인터뷰해달라고 해야 합니다. 이 질문에 답을 하다 보면 머릿속의 안개가 걷힙니다."
  },
  // Slide 6
  {
    id: 6,
    category: "PART 2. PRD PHASE",
    title: "PRD로 선 긋기: 할 일(In-Scope)과 안 할 일(Out-of-Scope)",
    type: "two_col",
    content: {
      left: {
        title: "⭕ 이번에 반드시 해결할 일 (In-Scope)",
        color: "emerald",
        bullets: [
          "1. 원터치 계정 & 사번 자동 발급 (다우오피스/SSO)",
          "2. IT 장비 3종(노트북, 모니터, 출입증) 자동 배정",
          "3. 신입사원 Day-1 모바일 포털 (준비물, 사진 접수)",
          "4. 4단계 펄스 서베이 & AI 조기퇴사 위험 신호 분석",
          "5. 퇴사 시 원클릭 계정 차단 & 자산 일괄 반납"
        ]
      },
      right: {
        title: "❌ 이번에 절대 안 할 일 (Out-of-Scope)",
        color: "red",
        bullets: [
          "1. 실물 택배 배송 실시간 트래킹 (과도한 복잡도)",
          "2. 사내 급여/퇴직금 자동 연동 (인사 보안 정책)",
          "3. 대면 OJT 동영상 스트리밍 플랫폼 구축",
          "",
          "💡 성공의 비결: 욕심부리지 않고 안 할 일을 확실히 쳐내야 3일 만에 완성할 수 있습니다!"
        ]
      }
    },
    speakerNotes: "프로젝트가 망하는 1위 원인은 '이것도 넣고 저것도 넣자'입니다. 안 할 일을 확실히 쳐내야 3일 만에 배포할 수 있습니다."
  },
  // Slide 7
  {
    id: 7,
    category: "PART 2. DESIGN RULES",
    title: "디자인 룰 먼저 박기: 애플 스타일 라이트 모드",
    type: "grid_3",
    content: {
      cards: [
        {
          title: "규칙 1. 배경 & 표면 대비",
          desc: "배경: 소프트 라이트 그레이 (#F5F5F7)\n카드/표면: 순백색 (#FFFFFF)\n부드럽고 눈이 편안한 전문가용 캔버스"
        },
        {
          title: "규칙 2. 포인트 컬러 (Accent)",
          desc: "핵심 액션: 애플 시스템 블루 (#0071E3)\n성공/완료: 에메랄드 그린 (#10B981)\n주의/경고: 로즈 레드 (#EF4444)"
        },
        {
          title: "규칙 3. 형태 및 아이콘",
          desc: "모서리 둥글기: 12px ~ 16px (Card Radius)\n아이콘: Lucide Icons 일관 적용\n그리드: 4px 단위 패딩 & 마진"
        }
      ]
    },
    speakerNotes: "디자인 감각이 없어도 됩니다. AI에게 딱 3단어만 던지세요. 'Apple 스타일, 라이트 그레이 배경, 카드형 UI'. 규칙을 미리 정해주면 AI가 페이지를 10개 만들어도 일관되게 세련됩니다."
  },
  // Slide 8
  {
    id: 8,
    category: "PART 3. HANDS-ON DEMO",
    title: "실습 1 (Hands-on): 파워넷 HR Sync 10분 투어",
    type: "grid_4",
    content: {
      banner: "🌐 지금 브라우저를 열고 접속하세요! 👉 https://hr-sync-delta.vercel.app",
      cards: [
        {
          title: "미션 1. 원터치 입사 실행",
          desc: "우측 상단 [🚀 연구소 HW개발] 프리셋 클릭 ➔ [⚡ 원터치 입사 자동화 일괄 실행] 클릭! 1초 만에 사번, 이메일, 장비, 고정 IP가 배정되는 5단계 콘솔 확인!"
        },
        {
          title: "미션 2. 신입사원 모바일 포털",
          desc: "완료 카드의 [📱 모바일 포털 바로 열기] 클릭! 첫 출근 D-Day, 제휴 사진관(패밀리포토하우스) 네이버 지도, 사원증 촬영, 12대 복리후생 탐색 후 각오 전송!"
        },
        {
          title: "미션 3. 관리자 실시간 접수 & AI",
          desc: "[온보딩 여정] 탭 이동 ➔ 좌측 입사자 클릭 ➔ 방금 보낸 사원증 사진 원본 다운로드 & AI 피플 애널리틱스 조기퇴사 위험 신호(Red Flag) 분석 확인!"
        },
        {
          title: "미션 4. 원터치 퇴사 처리",
          desc: "[퇴사자 권한 회수] 탭 ➔ 직원 선택 ➔ [🚨 원터치 종합 퇴사 즉시 실행] 클릭! 계정 즉시 잠금 + 자산 100% 일괄 반납(RETURNED) + [🖨️ A4 퇴사 확인서] 인쇄 확인!"
        }
      ]
    },
    speakerNotes: "백문이 불여일견입니다. 지금 노트북을 여시고 주소로 접속해주세요! 로그인 없이 바로 열리고 가이드 팝업이 뜹니다. 미션 1번부터 4번까지 직접 눌러보세요!"
  },
  // Slide 9
  {
    id: 9,
    category: "PART 3. TECH STACK",
    title: "이 모든 게 0원(무료)으로 돌아간다고?",
    type: "grid_4",
    content: {
      cards: [
        {
          title: "Next.js 16 (App Router)",
          sub: "초고속 모던 웹 프레임워크",
          desc: "• React 19 기반 반응형 웹\n• PC/태블릿/모바일 완벽 지원\n• Turbopack 번들러로 0.8초 빌드"
        },
        {
          title: "Supabase (PostgreSQL)",
          sub: "무료 클라우드 데이터베이스",
          desc: "• 글로벌 1위 오픈소스 DB\n• 실시간 데이터 영구 보존\n• 강력한 보안(RLS) 및 Admin API"
        },
        {
          title: "Vercel Edge Cloud",
          sub: "클릭 한 번에 전 세계 배포",
          desc: "• GitHub 푸시 시 30초 무중단 배포\n• 글로벌 CDN 초고속 로딩\n• 도메인 자동 발급 (HTTPS 지원)"
        },
        {
          title: "Resend Email API",
          sub: "신입사원 알림장 자동 발송",
          desc: "• 매달 3,000건 무료 이메일\n• 웰컴 메일 및 모바일 포털 링크\n• 회차별 설문 안내장 실시간 발송"
        }
      ]
    },
    speakerNotes: "많은 분들이 '이런 거 만들면 서버비 얼마 나와요?' 물어보십니다. 놀랍게도 현재 서버 유지비는 0원입니다. 회사 예산 결재 품의 올릴 필요 없이 내 아이디어를 무료로 검증할 수 있습니다."
  },
  // Slide 10
  {
    id: 10,
    category: "PART 4. TEAM WORKSHOP",
    title: "실습 2 (Hands-on): 2인 1조 '내 업무 기획서 10분 만에 뽑기'",
    type: "prompt_box",
    content: {
      promptTitle: "📋 짝꿍과 함께 AI에게 복사해 넣을 프롬프트 (ChatGPT / Claude / Gemini)",
      promptText: "\"나는 [우리 부서명] 담당자야. 우리 팀의 [아까 채팅창에 쓴 귀찮은 업무]를 웹 시스템으로 만들고 싶어. 너는 15년 차 수석 PM이야. 기술 용어 쓰지 말고, 현업의 업무 프로세스를 파악하기 위한 질문 3가지만 나에게 해줘.\"",
      examples: [
        { q: "1단계 (1분)", a: "AI 챗봇을 열고 위 프롬프트를 붙여넣는다." },
        { q: "2단계 (4분)", a: "AI가 던진 3가지 질문에 짝꿍과 상의하여 답을 적어준다." },
        { q: "3단계 (3분)", a: "\"이 내용을 바탕으로 1장짜리 PRD를 작성해줘\"라고 요청한다." }
      ]
    },
    speakerNotes: "이제 여러분 차례입니다! 짝꿍과 2인 1조가 되어 슬라이드의 프롬프트를 AI에게 던져보세요. 10분 뒤에 여러분만의 1장짜리 PRD가 완성될 겁니다. 타이머 시작합니다!"
  },
  // Slide 11
  {
    id: 11,
    category: "PART 5. SHARING",
    title: "실습 결과 공유: 우리가 10분 만에 만든 것들",
    type: "grid_3",
    content: {
      cards: [
        {
          title: "총무팀 아이디어: 법인차량 포털",
          desc: "• 모바일 캘린더 실시간 차량 현황\n• 미반납 시 카톡 알림 자동 발송\n• 유류비 영수증 자동 집계"
        },
        {
          title: "영업팀 아이디어: 1초 견적서 생성기",
          desc: "• 고객사 및 수량 선택 시 단가 자동 계산\n• 회사 직인이 찍힌 A4 PDF 즉시 출력\n• 견적 이력 엑셀 다운로드"
        },
        {
          title: "법무팀 아이디어: 계약서 체크 웹",
          desc: "• 계약서 PDF 드래그앤드롭 업로드\n• AI가 필수 누락 조항 3단계 검토\n• 독소 조항 발견 시 경고 배너 표시"
        }
      ]
    },
    speakerNotes: "자, 어느 팀에서 먼저 자랑해주실까요? 단 10분 만에 실제 시스템을 만들 수 있는 설계도가 나왔습니다. 이제 AI에게 이 PRD대로 첫 화면 코드를 짜달라고 하면 끝납니다!"
  },
  // Slide 12
  {
    id: 12,
    category: "PART 5. BEST PRACTICES",
    title: "AI 협업 성공을 위한 꿀팁 (Do & Don't)",
    type: "two_col",
    content: {
      left: {
        title: "⭕ 반드시 해야 할 것 (DO)",
        color: "emerald",
        bullets: [
          "• '화면 1개, 버튼 1개'씩 벽돌 쌓듯이 대화하기",
          "• 눈에 보이는 UI(화면)부터 먼저 만들어 검증하기",
          "• 에러 나면 에러 메시지 통째로 복사해서 던지기",
          "• '왜 이렇게 짰는지 설명해줘' 물어보며 배우기"
        ]
      },
      right: {
        title: "❌ 절대 하지 말아야 할 것 (DON'T)",
        color: "red",
        bullets: [
          "• 한 번에 모든 기능을 다 넣으려고 욕심부리기",
          "• DB 설치나 서버 인프라부터 고민하다 지치기",
          "• 에러 떴을 때 혼자 고민하다 포기하기",
          "• 기획 문서(PRD) 없이 바로 코딩부터 시작하기"
        ]
      }
    },
    speakerNotes: "실제 만들어보실 때 마주칠 함정 3가지만 기억하세요. 첫째, 욕심내지 말고 벽돌 쌓기. 둘째, 에러 나면 에러 복붙해서 AI 던지기!"
  },
  // Slide 13
  {
    id: 13,
    category: "PART 5. GOVERNANCE",
    title: "엔터프라이즈의 마침표: 문서화와 팝업 매뉴얼",
    type: "grid_3",
    content: {
      cards: [
        {
          title: "1. 사용자 & 관리자 매뉴얼",
          sub: "MANUAL.md",
          desc: "• 누가 봐도 1분 만에 이해하는 사용 가이드\n• 신입사원 모바일 포털 및 관리자 대시보드\n• 회차별 설문 및 IT 자산 관리 매뉴얼"
        },
        {
          title: "2. 시스템 재현 설계명세서",
          sub: "SPECIFICATION.md",
          desc: "• 데이터베이스 ERD 및 API 규격서\n• AI 위험 분석 알고리즘 수식 정의\n• 누구나 동일 시스템을 다시 만들 수 있는 청사진"
        },
        {
          title: "3. 대시보드 30초 팝업 가이드",
          sub: "UserManualModal",
          desc: "• 사이트 접속 즉시 30초 체험 팝업 자동 호출\n• 별도 교육 없이도 동료들이 즉시 사용\n• 언제든 다시 열어볼 수 있는 상시 매뉴얼 버튼"
        }
      ]
    },
    speakerNotes: "혼자 쓰고 버리는 장난감과 진짜 사내 프로젝트의 차이는 문서화에 있습니다. 팀원들이 쓸 수 있도록 팝업 매뉴얼을 만드는 것이 프로덕트의 완성입니다."
  },
  // Slide 14
  {
    id: 14,
    category: "PART 5. Q&A",
    title: "자주 묻는 질문 (FAQ) & 자유 Q&A",
    type: "grid_3",
    content: {
      cards: [
        {
          title: "Q1. 사내 보안 규정상 클라우드 써도 되나요?",
          desc: "➔ 프로토타입 단계에선 더미(가상) 데이터로 무료 클라우드를 활용하고, 전사 도입 시 사내 On-Premise 서버나 사내망으로 이전할 수 있습니다."
        },
        {
          title: "Q2. 내부망 ERP나 그룹웨어와 붙일 수 있나요?",
          desc: "➔ 네! REST API나 사내 DB View/Stored Procedure 연계로 100% 연동 가능합니다. (HR Sync에 실제 연동 엔드포인트 설계 완료)"
        },
        {
          title: "Q3. 코드를 모르는데 유지보수는 어떻게 하나요?",
          desc: "➔ 코드를 직접 고칠 필요 없이, AI에게 '이 부분 글자 크기 키워줘', '필터 추가해줘'라고 말하고 복사-붙여넣기만 하면 됩니다."
        }
      ]
    },
    speakerNotes: "지금까지 80분 동안 전과정을 살펴보셨습니다. 평소 궁금하셨던 점이나 내 업무에 적용할 때 고민되는 점 편하게 질문해주세요!"
  },
  // Slide 15
  {
    id: 15,
    category: "WORKSHOP CLOSING",
    title: "\"가장 훌륭한 시스템은,\n현업에서 매일 고통받는 당신의 머릿속에 있습니다.\"",
    subtitle: "오늘 작성하신 1장의 기획서로 오늘 퇴근 전 AI에게 첫 화면을 요청해보세요!",
    type: "closing",
    content: {
      quote: "다음 주 월요일, 우리 팀의 일하는 방식이 완전히 달라질 것입니다.",
      links: [
        "🌐 라이브 사이트: https://hr-sync-delta.vercel.app",
        "🐙 GitHub 오픈소스: https://github.com/kimyeasll-byte/hr-sync"
      ]
    },
    speakerNotes: "오늘 워크숍의 마지막 메시지입니다. 가장 훌륭한 아이디어는 현업의 여러분 고민에서 출발합니다. 오늘 뽑아내신 그 1장의 PRD로 오늘 퇴근 전에 AI에게 '첫 화면 만들어줘'라고 한마디만 던져보세요. 경청해주셔서 감사합니다!"
  }
];

export default function WorkshopSlidesPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const currentSlide = SLIDES[currentSlideIndex];

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        prevSlide();
      } else if (e.key === "s" || e.key === "S") {
        setShowNotes((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex]);

  const nextSlide = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-neutral-900 flex flex-col font-sans select-none">
      
      {/* Top Slide Control Bar */}
      <header className="h-14 bg-white border-b border-neutral-200 px-4 flex items-center justify-between shadow-2xs z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Home size={16} />
            <span className="hidden sm:inline">대시보드</span>
          </Link>
          <div className="h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              SLIDE {currentSlide.id} / {SLIDES.length}
            </span>
            <span className="text-xs font-bold text-neutral-700 hidden md:inline truncate max-w-md">
              {currentSlide.title.replace('\n', ' ')}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* PPTX File Download Link */}
          <a
            href="/AI_Web_Service_Workshop.pptx"
            download="AI_Web_Service_Workshop.pptx"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download size={13} />
            <span className="hidden sm:inline">파워포인트(.pptx) 다운로드</span>
            <span className="sm:hidden">PPTX</span>
          </a>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              showNotes 
                ? "bg-amber-100 text-amber-900 border-amber-300" 
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <FileText size={13} />
            <span>강사 대본 ({showNotes ? "ON" : "OFF"})</span>
          </button>
        </div>
      </header>

      {/* Main Slide Stage (16:9 Presentation Canvas) */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        <div 
          className="w-full max-w-[1280px] aspect-[16/9] bg-white rounded-2xl shadow-xl border border-neutral-200/80 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden animate-in fade-in duration-150"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Slide Category Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              • {currentSlide.category}
            </span>
            <span className="text-xs font-mono font-bold text-neutral-400">
              {currentSlide.id.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Slide Title */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 leading-tight whitespace-pre-line tracking-tight">
              {currentSlide.title}
            </h1>
            {currentSlide.subtitle && (
              <p className="text-sm sm:text-base text-neutral-500 mt-2 font-medium">
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* Slide Body Content Dynamic Rendering */}
          <div className="flex-1 flex flex-col justify-center">
            
            {/* TYPE 1: COVER SLIDE */}
            {currentSlide.type === "cover" && (
              <div className="space-y-6 pt-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-100 flex flex-col gap-3">
                  <span className="text-sm font-bold text-blue-600">
                    {currentSlide.content.tagline}
                  </span>
                  <div className="text-xs font-semibold text-neutral-600">
                    {currentSlide.content.author}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentSlide.content.badges.map((b: string) => (
                      <span key={b} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-neutral-200 font-bold text-neutral-700 shadow-2xs">
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 2: TWO COLUMNS */}
            {currentSlide.type === "two_col" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${
                  currentSlide.content.left.color === "red" 
                    ? "bg-red-50/50 border-red-200 text-red-950" 
                    : currentSlide.content.left.color === "emerald"
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                    : "bg-neutral-50/70 border-neutral-200 text-neutral-800"
                }`}>
                  <h3 className="text-base font-bold mb-4">{currentSlide.content.left.title}</h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    {currentSlide.content.left.bullets.map((b: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>

                <div className={`p-6 rounded-2xl border ${
                  currentSlide.content.right.color === "blue" 
                    ? "bg-blue-50/50 border-blue-200 text-blue-950" 
                    : currentSlide.content.right.color === "emerald"
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                    : "bg-red-50/50 border-red-200 text-red-950"
                }`}>
                  <h3 className="text-base font-bold mb-4">{currentSlide.content.right.title}</h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    {currentSlide.content.right.bullets.map((b: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TYPE 3: GRID 6 */}
            {currentSlide.type === "grid_6" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {currentSlide.content.steps.map((s: any) => (
                  <div key={s.num} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-blue-600 block">{s.num}</span>
                    <h4 className="text-sm font-bold text-neutral-900">{s.title}</h4>
                    <p className="text-xs text-neutral-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TYPE 4: PROMPT BOX */}
            {currentSlide.type === "prompt_box" && (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-xl bg-neutral-900 text-white font-mono text-xs sm:text-sm leading-relaxed border border-neutral-800 shadow-md">
                  <div className="text-blue-400 font-bold mb-2 flex items-center gap-1.5">
                    <Sparkles size={14} /> {currentSlide.content.promptTitle}
                  </div>
                  <p className="text-neutral-200 whitespace-pre-line">
                    {currentSlide.content.promptText}
                  </p>
                </div>
                {currentSlide.content.examples && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentSlide.content.examples.map((ex: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs space-y-1">
                        <div className="font-bold text-blue-700">{ex.q}</div>
                        <div className="text-neutral-600">{ex.a}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TYPE 5: GRID 3 */}
            {currentSlide.type === "grid_3" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentSlide.content.cards.map((c: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/60 hover:bg-white transition-all space-y-2">
                    <h4 className="text-sm font-bold text-blue-700">{c.title}</h4>
                    {c.sub && <div className="text-[11px] font-mono font-bold text-neutral-500">{c.sub}</div>}
                    <p className="text-xs text-neutral-600 whitespace-pre-line leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TYPE 6: GRID 4 */}
            {currentSlide.type === "grid_4" && (
              <div className="space-y-4">
                {currentSlide.content.banner && (
                  <div className="p-3.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs sm:text-sm text-center">
                    {currentSlide.content.banner}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {currentSlide.content.cards.map((c: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs space-y-2">
                      <h4 className="text-xs font-bold text-neutral-900">{c.title}</h4>
                      {c.sub && <div className="text-[10px] font-bold text-blue-600">{c.sub}</div>}
                      <p className="text-[11px] text-neutral-600 whitespace-pre-line leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TYPE 7: CLOSING */}
            {currentSlide.type === "closing" && (
              <div className="text-center py-6 space-y-6">
                <p className="text-base sm:text-lg font-bold text-neutral-700 italic">
                  "{currentSlide.content.quote}"
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  {currentSlide.content.links.map((link: string, idx: number) => (
                    <span key={idx} className="text-xs px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 font-mono font-bold text-blue-700">
                      {link}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Slide Footer */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <span>(주)파워넷 HR Sync AI 엔지니어링 세미나</span>
            <span>단축키: [← / →] 슬라이드 이동, [S] 강사 대본 켜기/끄기</span>
          </div>
        </div>
      </main>

      {/* Floating Speaker Notes Panel (Bottom Drawer) */}
      {showNotes && (
        <aside className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-neutral-950/95 text-white p-4 rounded-2xl shadow-2xl border border-neutral-800 z-40 backdrop-blur-md animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-neutral-800">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <FileText size={14} /> 강사 발화 대본 (Speaker Script) - 슬라이드 {currentSlide.id}
            </span>
            <button onClick={() => setShowNotes(false)} className="text-xs text-neutral-400 hover:text-white">닫기 ✕</button>
          </div>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
            {currentSlide.speakerNotes}
          </p>
        </aside>
      )}

      {/* Bottom Floating Navigation Toolbar */}
      <footer className="h-16 bg-white border-t border-neutral-200 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentSlideIndex(0)}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 text-xs font-bold transition-colors flex items-center gap-1"
            title="처음으로"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Next / Prev Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
          >
            <ChevronLeft size={16} /> 이전 슬라이드
          </button>

          <span className="text-xs font-mono font-bold text-neutral-500">
            {currentSlideIndex + 1} / {SLIDES.length}
          </span>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === SLIDES.length - 1}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs flex items-center gap-1"
          >
            다음 슬라이드 <ChevronRight size={16} />
          </button>
        </div>

        <div className="text-xs font-bold text-neutral-400 hidden sm:block">
          프레젠테이션 모드
        </div>
      </footer>

    </div>
  );
}
