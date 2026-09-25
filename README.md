# 🏢 (주)파워넷 HR Sync - 통합 인사 & 계정 관리 포털

> **PowerNet HR Sync**는 신규 입사자의 **원터치 5-in-1 입사 프로비저닝**, **모바일 셀프 온보딩 포털**, **회차별 펄스 서베이 & AI 조기퇴사 위험 분석**, **IT 자산 대장 관리**, **원터치 종합 퇴사 정산** 및 **ITGC 내부통제 감사 증빙**을 지원하는 올인원 엔터프라이즈 인사 관리 시스템입니다.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://hr-sync-delta.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.6%20(Turbopack)-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 과제 제출 및 접속 정보 (Submission Info)

* **🌐 운영 배포 사이트 (Vercel)**: [https://hr-sync-delta.vercel.app](https://hr-sync-delta.vercel.app)
* **🐙 GitHub 공개 저장소 (Public)**: [https://github.com/kimyeasll-byte/hr-sync](https://github.com/kimyeasll-byte/hr-sync)
* **🔑 공식 관리자 계정 (Demo)**:
  - **아이디**: `yskim@gopowernet.com`
  - **비밀번호**: `power0700!!`
* **🏢 사내 표준 정책**: 이메일 도메인 `@gopowernet.com` (수원 사업장 / 서울 본사 듀얼 거점)

---

## 📚 프로젝트 공식 문서 바로가기

| 문서명 | 주요 내용 | 링크 |
| :--- | :--- | :---: |
| **🚀 [신규] 비개발자를 위한 AI 웹서비스 제작 바이블** | 아이디어만으로 3일 만에 웹서비스를 구축하는 범용 5단계 프레임워크 | [docs/UNIVERSAL_WEB_BUILDER_GUIDE.md](./docs/UNIVERSAL_WEB_BUILDER_GUIDE.md) |
| **🎓 팀내 교육용 교안 & 워크숍 가이드** | AI 페어 프로그래밍 실전, 5단계 커리큘럼, 30분 팀원 핸즈온 실습 | [docs/TRAINING_GUIDE.md](./docs/TRAINING_GUIDE.md) |
| **📖 사용자 & 관리자 운영 매뉴얼** | 원터치 입사/퇴사, 모바일 포털, AI 서베이, IT 자산 관리 상세 가이드 | [docs/MANUAL.md](./docs/MANUAL.md) |
| **📐 시스템 아키텍처 & 재현 설계명세서** | ERD, API 명세, 알고리즘, 환경 변수 및 동일 앱 재현 가이드 | [docs/SPECIFICATION.md](./docs/SPECIFICATION.md) |
| **📅 상세 개발 이력서 (CHANGELOG)** | 일자별/기능별 누적 개발 이력 및 변경점 상세 기록 | [docs/CHANGELOG.md](./docs/CHANGELOG.md) |
| **🎯 현재 개발 진행 현황 (STATUS)** | 가동 중인 핵심 기능 요약 및 시스템 상태 | [docs/STATUS.md](./docs/STATUS.md) |

---

## 🌟 핵심 구현 기능

### 1. ⚡ 원터치 종합 입사 자동화 (5-in-1 One-Touch Onboarding)
* **단 1번의 클릭**으로 5대 전산/인사 업무 동시 완결:
  1. **사내 계정 및 사번 자동 발급**: 임직원 사번(`2026xxxx`), 공식 메일(`[이름].[성]@gopowernet.com`), 임시 비밀번호 및 SSO 연동.
  2. **부서 맞춤 IT 장비 3종 자동 배정 & 고정 IP 채번**: 연구소(갤럭시북4 Pro 32GB) vs 일반(LG 그램 16GB), 삼성 27인치 FHD 듀얼 모니터, 에스원(S1) 보안 출입카드, 고정 IP(`192.168.10.xxx`) 채번 후 **IT 자산 대장 실시간 자동 등록**.
  3. **온보딩 체크리스트 자동 동기화**: PC 세팅, 고정 IP, 계정 생성, 출입증 발주 4종 체크리스트 자동 완료(✔).
  4. **모바일 온보딩 포털 URL 발급 & 웰컴 이메일 즉시 발송**: 개인 메일함으로 모바일 셀프 온보딩 포털(`/onboard/portal/[token]`) 링크 실시간 발송 (Resend 연동).
  5. **ITGC 감사 로그 기록 & 입사 확인서 자동 발급**: 문서 번호 채번 및 A4 증빙서 즉시 출력 지원.
* **1초 시연용 빠른 프리셋 지원**: [🚀 연구소 HW선임], [💼 경영지원 인사담당], [🌐 기술영업(서울)] 원클릭 입력.

### 2. 📱 신규 입사자 전용 Day-1 모바일 셀프 온보딩 포털 (`/onboard/portal/[token]`)
* 첫 출근 D-Day 카운트다운 & 수원/서울 사업장 네이버/카카오 지도 길안내.
* **사원증 지정 사진관(패밀리포토하우스) 네이버 지도 연동 & 실물 사원증 시뮬레이터** (실물 제작 2주 소요 사전 안내).
* 5대 필수 서류/준비물 인터랙티브 체크리스트 및 실시간 진행률.
* **(주)파워넷 임직원 복리후생 가이드 (4개 카테고리 12개 혜택) 인터랙티브 탐색**.
* 입사 각오 작성 후 [온보딩 준비 전송하기] 시 **관리자 대시보드에 실시간 동기화 (사원증 원본 사진 다운로드 지원)**.

### 3. 🧠 회차별 맞춤형 펄스 서베이 & AI 피플 애널리틱스 (`/onboard/survey/[token]`)
* **시기별 특화 4단계 마이크로 서베이**: 1개월(초기 적응/장비), 3개월(직무 R&R/협업), 6개월(성장/워라밸), 1년(비전/eNPS).
* **AI 조기퇴사 위험 신호(Flag) 분석 엔진**:
  - `🚨 Red Flag` (고위험군 / 즉시 1:1 케어 면담)
  - `⚠️ Yellow Flag` (주의군 / 멘토링 커피챗)
  - `✨ Green Flag` (안정군 / 자율 성장 지원)
* 주관식 의견 감성 키워드 분석 및 AI 추천 실행 권고사항(Action Plan) 자동 제시.

### 4. 💻 IT 자산 및 비품 관리 대장 (`/dashboard` - 자산 탭)
* 사내 PC/노트북, 모니터, 고정 IP, MAC, 에스원 출입카드 수불 관리.
* **표준 서식 다운로드 및 엑셀(CSV) 일괄 등록(Bulk Import)**: 정규식 라인 파서 및 실시간 유효성 검사 모달.
* 한글 깨짐 방지 UTF-8 BOM 지원 **실시간 자산 원장 엑셀 내보내기**.

### 5. 🚨 원터치 종합 퇴사 권한 회수 및 자산 정산
* 퇴사자 선택 시 보유 IT 장비(노트북, 모니터, 출입카드, 고정 IP) 실시간 감지.
* **⚡ [🚨 원터치 종합 퇴사 즉시 실행]**:
  - 다우오피스/사내메일 계정 즉시 비활성화 & 활성 SSO 세션 강제 종료.
  - 사내 ERP/MES/VPN 접근 권한 일괄 박탈.
  - 대여 IT 자산 전체 `RETURNED(반납 완료)` 처리 및 PC 포맷 대기 전환.
  - 에스원(S1) 출입 권한 즉시 파기.
  - **공식 A4 퇴사/권한회수 확인서(`OFFBOARDING_REVOKE_CERTIFICATE`) 즉시 인쇄/PDF 보존**.
* **📅 [퇴사일 예약]**: D+1 익일 자동 차단 예약 및 자산 반납 대기(`PENDING_RETURN`) 전환.

### 6. 📑 ITGC 내부회계관리제도 감사 로그 및 A4 독립 인쇄
* 전산 및 인사 변경 이력 최대 3년간 영구 보존.
* 한글 깨짐 방지 UTF-8 BOM 지원 ITGC 엑셀 다운로드.
* 브라우저 인쇄 깨짐 없는 **A4 단 1장 독립 iframe 무결점 인쇄/PDF 엔진**.

---

## 🛠️ 기술 스택 및 아키텍처

```
Frontend:  Next.js 16 (App Router / Turbopack), React 19, Tailwind CSS v4, Lucide React
Backend:   Next.js Server API Routes, TypeScript 5
Database:  Supabase (PostgreSQL 15+), Client LocalStorage Hybrid Cache
Services:  Resend (Email API), Vercel (Edge CI/CD Deployment)
```

---

## 🚀 빠른 시작 (Quick Start)

```bash
# 1. 저장소 클론
git clone https://github.com/kimyeasll-byte/hr-sync.git
cd hr-sync

# 2. 패키지 설치
npm install

# 3. 로컬 개발 서버 실행
npm run dev

# 4. 빌드 검증
npm run build
```

---

© 2026 POWERNET Co., Ltd. All Rights Reserved.
