# (주)파워넷 HR Sync - 통합 인사 & 계정 관리 포털

> **PowerNet HR Sync**: 신규 입사자 온보딩 여정 관리, IT 자산 관리, 퇴사자 권한 회수 및 ITGC 감사 로그를 지원하는 올인원 엔터프라이즈 인사 관리 시스템입니다.

- **운영 배포 URL**: [https://hr-sync-delta.vercel.app](https://hr-sync-delta.vercel.app)
- **공식 관리자 계정**: `yskim@gopowernet.com` / `power0700!!`
- **사내 공식 도메인**: `@gopowernet.com` (수원 본사 / 서울 연구소 사업장 지원)

---

## 🌟 주요 핵심 기능

### 1. 신규 입사자 온보딩 & AI 피플 애널리틱스
- **Apple 스타일 클린 미니멀 화이트 UI**: 간결하고 눈이 편안한 라이트 모드 디자인 (`#F5F5F7`, `#FFFFFF`, `#0071E3`).
- **신입사원 Day-1 셀프 온보딩 포털 (`/onboard/portal/[token]`)**:
  - 첫 출근 D-Day, 사업장 길안내(네이버/카카오 지도 연동), 주차 및 대중교통 가이드.
  - 5대 필수 서류/준비물 체크리스트 및 실시간 진행률.
  - 사원증 지정 사진관(패밀리포토하우스) 네이버지도 연동 & 실물 사원증 시뮬레이터.
  - 임직원 복리후생 가이드 (4개 카테고리 12개 혜택) 인터랙티브 탐색.
  - 신입사원 접수 현황 관리자 대시보드 실시간 연동 (프로필 사진 원본 다운로드 지원).
- **회차별 맞춤형 펄스 서베이 (`/onboard/survey/[token]`)**:
  - 입사 1개월(D+30), 3개월(D+90), 6개월(D+180), 1년(D+365) 주기별 맞춤 질문과 전용 리커트 척도 제공.
  - 3분 이내 모바일 Micro Survey로 높은 응답률 확보.
- **AI 조기퇴사 위험 신호(Flag) 분석 엔진 (`/api/onboarding/survey`)**:
  - 위험도 지수(0~100점) 및 3단계 신호(`🚨 Red Flag`, `⚠️ Yellow Flag`, `✨ Green Flag`) 자동 판정.
  - 감성 사전 기반 주관식 키워드 감지 및 회차별 맞춤 실행 플랜(Action Plan) 제시.
- **자동 마일스톤 이메일 스케줄러 (Resend 연동)**:
  - Day 1(출근 웰컴), Week 1(멘토링), Month 1, Month 3, Month 6, Year 1 단계별 자동 이메일 발송.

### 2. IT 자산 및 비품 관리
- PC, 모니터, 고정 IP, MAC 주소, 에스원(S1) 출입 카드 지급 및 반납 추적.
- 사용자별 할당 현황 및 자산 이력 관리.

### 3. 퇴사자 권한 회수 워크플로우
- 퇴사 예정자 조회, 그룹웨어/ERP/메일 계정 즉시 비활성화.
- 자산 반납 확인 및 ITGC 컴플라이언스 준수.

### 4. ITGC 감사 로그 및 리포팅
- 전산 및 인사 작업 실시간 감사 로그 기록.
- UTF-8 BOM 지원 엑셀 한글 깨짐 방지 CSV 내보내기.
- A4 규격 온보딩 수료증 및 확인서 독립 iframe 무결점 인쇄/PDF 지원.

---

## 🛠️ 기술 스택

- **Frontend & Backend**: Next.js 16 (App Router / Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Database & Storage**: Supabase (PostgreSQL)
- **Mailing Service**: Resend API
- **Deployment**: Vercel (CI/CD 자동 배포)

---

## 📁 주요 문서 링크

- [상세 변경 이력 (CHANGELOG.md)](./docs/CHANGELOG.md)
- [현재 개발 진행 현황 (STATUS.md)](./docs/STATUS.md)

---

© 2026 POWERNET Co., Ltd. All Rights Reserved.
