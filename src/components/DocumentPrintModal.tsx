"use client";

import React, { useRef } from "react";
import { Printer, X, Download, ShieldCheck, CheckCircle2, Building2 } from "lucide-react";

export interface PrintDocumentData {
  type: "ONBOARDING_CERTIFICATE" | "OFFBOARDING_REVOKE_CERTIFICATE";
  empName: string;
  department: string;
  rank?: string;
  role?: string;
  location?: string;
  targetDate: string;
  completedDate?: string;
  docNo: string;
  // Specific fields
  systems?: string[];
  equipmentSummary?: string;
  progressPercent?: number;
  signatoryTitle?: string;
}

interface DocumentPrintModalProps {
  data: PrintDocumentData | null;
  onClose: () => void;
}

export default function DocumentPrintModal({ data, onClose }: DocumentPrintModalProps) {
  if (!data) return null;

  const isOffboarding = data.type === "OFFBOARDING_REVOKE_CERTIFICATE";
  const title = isOffboarding ? "계정 및 사내 시스템 권한 회수 확인서" : "신규 입사 온보딩 및 장비 지급 완료 증명서";
  const subTitle = isOffboarding ? "(내부회계관리제도 ITGC 및 정보보안 감사 증빙용)" : "(주)파워넷 공식 온보딩 여정 완료 및 자산 불출 확인증";

  // 단 1장의 문서만 격리 인쇄하는 iframe 전용 인쇄 함수 (백그라운드 리스트 출력 완전 방지)
  const handlePrint = () => {
    const printArea = document.getElementById("powernet-print-area");
    if (!printArea) {
      window.print();
      return;
    }

    // 1. 페이지 내 모든 스타일시트 복제
    const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map(el => el.outerHTML)
      .join("\n");

    // 2. 비가시적 전용 인쇄 iframe 생성
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) {
      window.print();
      return;
    }

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="utf-8" />
          <title>${title} - ${data.empName}</title>
          ${styles}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 15mm;
            }
            html, body {
              background: #ffffff !important;
              color: #111827 !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #powernet-print-area {
              display: block !important;
              width: 100% !important;
              max-width: none !important;
              background: #ffffff !important;
              color: #111827 !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          </style>
        </head>
        <body>
          <div id="powernet-print-area">
            ${printArea.innerHTML}
          </div>
        </body>
      </html>
    `);
    frameDoc.close();

    // 3. 렌더링 완료 후 정확히 해당 iframe만 단독 인쇄
    setTimeout(() => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      } catch (err) {
        console.error("Print error:", err);
      } finally {
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1500);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      
      {/* 백그라운드 인쇄 누출 방지 전역 스타일 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body > * {
            visibility: hidden !important;
          }
        }
      ` }} />

      {/* 모달 윈도우 컨테이너 */}
      <div className="w-full max-w-3xl flex flex-col max-h-[95vh] rounded-2xl border overflow-hidden shadow-2xl bg-neutral-900 border-neutral-700">
        
        {/* 상단 툴바 (인쇄 시 제외) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">공식 증빙 문서 인쇄 및 PDF 저장</h3>
              <p className="text-[11px] text-neutral-400">브라우저 인쇄 창에서 [PDF로 저장]을 선택하시면 깔끔한 1장의 공식 문서로 출력됩니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer size={15} /> 1장 인쇄 / PDF 저장
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 실제 문서 본문 (A4 1장 최적화 레이아웃) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-neutral-900 font-sans">
          
          <div id="powernet-print-area">
            {/* 1. 공문서 헤더 */}
            <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3 mb-5">
              <div className="w-28 sm:w-32">
                <img src="/logo.png" alt="POWER NET" className="w-full h-auto object-contain" />
              </div>
              <div className="text-right text-[11px] text-neutral-500 font-mono space-y-0.5">
                <div>문서번호: <span className="font-bold text-neutral-800">{data.docNo}</span></div>
                <div>발행일자: {data.completedDate || new Date().toISOString().split("T")[0]}</div>
                <div>보존연한: 영구 (ITGC 회계감사 증빙)</div>
              </div>
            </div>

            {/* 2. 대제목 */}
            <div className="text-center my-5">
              <h1 className="text-2xl sm:text-2xl font-black tracking-tight text-neutral-900 mb-1">
                {title}
              </h1>
              <p className="text-xs text-neutral-500 font-medium tracking-wide">
                {subTitle}
              </p>
            </div>

            {/* 3. 대상 임직원 기본 인적사항 표 */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                ■ 대상 임직원 기본 정보
              </h3>
              <table className="w-full text-xs border border-neutral-300 border-collapse">
                <tbody>
                  <tr className="border-b border-neutral-300">
                    <th className="w-1/4 p-2 bg-neutral-100 font-bold text-neutral-700 text-left">성 명</th>
                    <td className="w-1/4 p-2 font-bold text-neutral-900">{data.empName}</td>
                    <th className="w-1/4 p-2 bg-neutral-100 font-bold text-neutral-700 text-left">소속 부서</th>
                    <td className="w-1/4 p-2 text-neutral-900">{data.department}</td>
                  </tr>
                  <tr className="border-b border-neutral-300">
                    <th className="p-2 bg-neutral-100 font-bold text-neutral-700 text-left">직급 / 직책</th>
                    <td className="p-2 text-neutral-900">{data.rank || "Staff"} {data.role ? `/ ${data.role}` : ""}</td>
                    <th className="p-2 bg-neutral-100 font-bold text-neutral-700 text-left">근무 사업장</th>
                    <td className="p-2 text-neutral-900">{data.location === "seoul" ? "서울사업장 (본사)" : "수원사업장 (연구소/제조)"}</td>
                  </tr>
                  <tr>
                    <th className="p-2 bg-neutral-100 font-bold text-neutral-700 text-left">
                      {isOffboarding ? "퇴사 예정일" : "입사일자"}
                    </th>
                    <td className="p-2 font-bold text-neutral-900">{data.targetDate}</td>
                    <th className="p-2 bg-neutral-100 font-bold text-neutral-700 text-left">
                      {isOffboarding ? "권한 차단 일시" : "온보딩 진척도"}
                    </th>
                    <td className="p-2 text-neutral-900 font-bold">
                      {isOffboarding ? `${data.targetDate} 익일 00:00 (D+1)` : `${data.progressPercent || 100}% 완료`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. 세부 조치 및 시스템 회수/부여 내역 */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                ■ {isOffboarding ? "계정 차단 및 IT 자산 회수 확인 내역" : "IT 장비 및 사내 권한 지급 현황"}
              </h3>

              {isOffboarding ? (
                <table className="w-full text-xs border border-neutral-300 border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-700">
                      <th className="p-2 text-left font-bold w-10">No.</th>
                      <th className="p-2 text-left font-bold">통제 대상 시스템 및 자산</th>
                      <th className="p-2 text-left font-bold">통제 내용</th>
                      <th className="p-2 text-center font-bold w-20">처리 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="p-2 text-neutral-500">1</td>
                      <td className="p-2 font-bold text-neutral-800">그룹웨어 및 사내 메일 (@gopowernet.com)</td>
                      <td className="p-2 text-neutral-600">계정 잠금 및 로그인 영구 비활성화 (보안 아카이빙)</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">회수 완료</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-neutral-500">2</td>
                      <td className="p-2 font-bold text-neutral-800">ERP & MES 전산 회계/생산 시스템</td>
                      <td className="p-2 text-neutral-600">전표 입력, 결재선 및 데이터베이스 접근 권한 회수</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">회수 완료</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-neutral-500">3</td>
                      <td className="p-2 font-bold text-neutral-800">사내 고정 IP 및 방화벽/VPN 정책</td>
                      <td className="p-2 text-neutral-600">원격 접속 및 인트라넷 보안 정책 즉시 차단</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">회수 완료</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-neutral-500">4</td>
                      <td className="p-2 font-bold text-neutral-800">업무용 PC/노트북 및 모니터 장비</td>
                      <td className="p-2 text-neutral-600">하드디스크 완전 포맷(Degaussing/데이터 파기) 및 반납</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">반납 확인</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-neutral-500">5</td>
                      <td className="p-2 font-bold text-neutral-800">에스원(S1) 사내 출입증 / 보안카드</td>
                      <td className="p-2 text-neutral-600">사업장 정문 및 연구동 출입 통제 권한 무효화 및 실물 회수</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">회수 완료</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs border border-neutral-300 border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-700">
                      <th className="p-2 text-left font-bold w-10">No.</th>
                      <th className="p-2 text-left font-bold">지급 및 준비 항목</th>
                      <th className="p-2 text-left font-bold">세부 규격 및 안내</th>
                      <th className="p-2 text-center font-bold w-20">지급 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="p-2 text-neutral-500">1</td>
                      <td className="p-2 font-bold text-neutral-800">업무용 PC / 노트북 단말기</td>
                      <td className="p-2 text-neutral-600">OS 초기 세팅, 사내 보안 소프트웨어 설치 완료</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">지급 완료</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-neutral-500">2</td>
                      <td className="p-2 font-bold text-neutral-800">사내 고정 IP 및 네트워크 환경</td>
                      <td className="p-2 text-neutral-600">이더넷 포트 연결 및 인트라넷 방화벽 포트 승인</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">부여 완료</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-neutral-500">3</td>
                      <td className="p-2 font-bold text-neutral-800">그룹웨어 & 메일 (@gopowernet.com)</td>
                      <td className="p-2 text-neutral-600">공식 계정 생성 및 초기 로그인 안내장 발송</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">생성 완료</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-neutral-500">4</td>
                      <td className="p-2 font-bold text-neutral-800">웰컴 패키지 및 사무용품</td>
                      <td className="p-2 text-neutral-600">파워넷 다이어리, 노트, 필기구, 사내 규정집</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">지급 완료</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-neutral-500">5</td>
                      <td className="p-2 font-bold text-neutral-800">사원증 발주 및 공식 명함 시안</td>
                      <td className="p-2 text-neutral-600">에스원(S1) 출입증 제작 접수 및 명함 스튜디오 인쇄 발주</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">발주 완료</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* 5. 증빙 문구 및 서명 확인 */}
            <div className="my-6 p-3 border border-neutral-300 rounded bg-neutral-50 text-[11px] text-neutral-600 leading-relaxed text-center">
              {isOffboarding ? (
                <p>
                  위 직원은 당사 규정 및 외부 감사 기준(ITGC)에 의거하여 사내 전산 자원, 그룹웨어, ERP 권한 및<br />
                  출입 보안카드가 정해진 기한 내에 완전하게 회수 및 차단되었음을 공식 확인합니다.
                </p>
              ) : (
                <p>
                  위 직원은 (주)파워넷의 신규 입사 온보딩 프로세스를 정상적으로 이수하고,<br />
                  업무 수행에 필요한 필수 IT 자산 및 사내 시스템 계정을 수령하였음을 증명합니다.
                </p>
              )}
            </div>

            {/* 6. 회사 직인 및 서명란 */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-neutral-300 text-xs">
              <div>
                <div className="text-neutral-500 text-[11px]">인사기획팀 / 전산총무팀 확인자:</div>
                <div className="font-bold text-neutral-800 text-sm mt-0.5">김예슬 (인사기획 & 전산총무 관리자) (인)</div>
              </div>

              {/* 회사 인감 직인 박스 */}
              <div className="relative text-right pr-6">
                <div className="text-sm font-extrabold tracking-tight text-neutral-900">
                  주식회사 파워넷
                </div>
                <div className="text-[11px] font-semibold text-neutral-600">
                  대표이사 및 인사총괄
                </div>
                {/* 빨간 도장 UI */}
                <div className="absolute -top-2.5 -right-2 w-14 h-14 border-2 border-red-600 rounded-full flex items-center justify-center rotate-[-12deg] pointer-events-none opacity-85">
                  <span className="text-[9px] font-black text-red-600 text-center leading-tight">
                    주식회사<br />파워넷<br />인
                  </span>
                </div>
              </div>
            </div>

            {/* 7. 인쇄 바닥글 */}
            <div className="mt-6 text-center text-[9px] text-neutral-400 font-mono">
              POWER NET CO., LTD. · HR Lifecycle Sync Portal · 본 문서는 감사 증빙용 법적 효력을 갖는 전자 기록물입니다.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
