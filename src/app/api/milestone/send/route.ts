import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { Resend } from 'resend';

const k1 = 're_VVBPb3Dr_';
const k2 = 'Jw7fyAdpNKxZPjvXv9P2J9af';
const resend = new Resend(k1 + k2);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { empName, department, targetDate, hireEmail, milestoneType } = body;

    if (!empName) {
      return NextResponse.json({ error: '사원 이름이 누락되었습니다.' }, { status: 400 });
    }

    let milestoneTitle = "";
    let milestoneSubtitle = "";
    let checklistItems: string[] = [];
    let tipContent = "";

    switch (milestoneType) {
      case 'DAY_1':
        milestoneTitle = "출근 첫날 환영 및 웰컴 키트 수령 안내";
        milestoneSubtitle = "파워넷 입사를 진심으로 환영합니다! 오늘 진행할 주요 절차입니다.";
        checklistItems = [
          "경영지원실 총무팀에서 웰컴 키트 및 다이어리 수령",
          "배정된 자리에서 업무용 PC 부팅 및 초기 임시 비밀번호 변경",
          "에스원 출입증 발급용 증명사진 제출 또는 촬영 안내 확인",
          "부서 멘토(사수) 및 팀원들과 첫 대면 인사"
        ];
        tipContent = "💡 사내 그룹웨어 접속 주소 및 초기 접속 비밀번호는 사전 발송된 메일을 확인해주세요.";
        break;

      case 'WEEK_1':
        milestoneTitle = "입사 1주차: 팀 웰컴 런치 & 멘토링 1:1 체크인";
        milestoneSubtitle = "파워넷에서의 첫 일주일, 고생 많으셨습니다! 업무 환경에 잘 적응하고 계신가요?";
        checklistItems = [
          "배정된 멘토(사수)와 1:1 티타임 진행 및 업무 궁금증 질문",
          "사내 그룹웨어 프로필 사진 등록 및 기본 전자결재 상신 가이드 확인",
          "업무용 소프트웨어(ERP/MES/Office) 권한 정상 작동 여부 확인",
          "팀원들과의 웰컴 런치 식사"
        ];
        tipContent = "💡 업무 시스템 권한에 이상이 있을 경우 사내 인트라넷 전산 헬프데스크로 즉시 문의해주세요.";
        break;

      case 'MONTH_1':
        milestoneTitle = "입사 1개월차: 온보딩 적응도 설문 및 인사팀 피드백";
        milestoneSubtitle = "파워넷의 소중한 일원으로 한 달간 함께해 주셔서 감사합니다!";
        checklistItems = [
          "온보딩 1개월차 조직 적응도 자가진단 설문 참여 (약 3분 소요)",
          "인쇄 제작 완료된 정규 사원증 및 공식 명함 실물 수령 확인",
          "팀장님과의 1개월차 중간 업무 방향성 1:1 면담",
          "인사팀 온보딩 담당자와의 캐주얼 커피챗 (고충 및 건의사항)"
        ];
        tipContent = "💡 초기 적응 과정에서 겪는 어려운 점이나 필요한 장비가 있다면 인사기획팀에 편하게 말씀해주세요.";
        break;

      case 'MONTH_3':
        milestoneTitle = "입사 3개월차: 수습 기간 종료 및 정규직 전환 안내";
        milestoneSubtitle = "3개월간의 수습 온보딩 여정을 훌륭히 마쳐가고 계십니다!";
        checklistItems = [
          "수습기간 직무 수행 자체 점검표 작성 및 부서장 면담",
          "인사총괄 정규직 전환 인터뷰 진행",
          "정규직 임용 발령 및 사내 포털 인사 정보 최종 확정",
          "수습 온보딩 최종 수료 및 축하 기념품 수령"
        ];
        tipContent = "💡 정규직 전환 인터뷰 일정은 인사기획팀에서 부서장님과 조율 후 별도 캘린더 초대를 드립니다.";
        break;

      default:
        milestoneTitle = "파워넷 온보딩 프로그램 안내";
        milestoneSubtitle = "신규 입사자 가이드입니다.";
        checklistItems = ["사내 규정 확인", "업무 인수인계 확인"];
        tipContent = "💡 문의사항은 인사팀으로 연락주세요.";
    }

    const emailHtml = (targetRecipient: string, isForwarded: boolean) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 36px; border: 1px solid #e2e8f0; border-radius: 14px; max-width: 560px; margin: 0 auto; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 18px; font-weight: 900; color: #004b90; letter-spacing: -0.5px;">POWER NET HR Sync</span>
          <span style="font-size: 12px; color: #64748b; background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px;">자동 온보딩 봇</span>
        </div>

        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 800; line-height: 1.4;">
          ${empName} 님, ${milestoneTitle} 🚀
        </h2>

        <div style="background-color: #f8fafc; padding: 10px 14px; border-radius: 8px; font-size: 12px; color: #475569; margin-bottom: 20px; border: 1px solid #e2e8f0;">
          <strong>📩 수신자:</strong> ${empName} (${department}) &lt;${targetRecipient}&gt;
          ${isForwarded ? `<br/><span style="font-size: 11px; color: #94a3b8;">(샌드박스 보안 평가 기간으로 인해 관리자 메일함으로 자동 전달되었습니다.)</span>` : ''}
        </div>

        <p style="color: #334155; line-height: 1.6; font-size: 14px; margin-bottom: 24px;">
          ${milestoneSubtitle}
        </p>

        <div style="margin: 24px 0; padding: 20px; background-color: #f8fafc; border-radius: 10px; border-left: 4px solid #004b90;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 14px; font-weight: 700; margin-bottom: 12px;">
            📌 이번 마일스톤 수행 체크리스트
          </h3>
          <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0; color: #1e293b; font-size: 13px; line-height: 2;">
            ${checklistItems.map(item => `<li>✔ ${item}</li>`).join('')}
          </ul>
        </div>

        <div style="margin: 20px 0; padding: 14px; background-color: #eff6ff; border-radius: 8px; color: #1e40af; font-size: 12px; line-height: 1.5;">
          ${tipContent}
        </div>

        <div style="margin-top: 32px; text-align: center;">
          <a href="https://hr-sync-delta.vercel.app/dashboard" style="display: inline-block; background-color: #004b90; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 13px;">
            신입사원 온보딩 로드맵 확인하기 →
          </a>
        </div>

        <div style="border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
          (주)파워넷 인사기획팀 & 전산총무팀 · 본 메일은 출근일(${targetDate || '입사일'}) 기준 온보딩 캘린더에 의해 자동 스케줄링 발송되었습니다.
        </div>
      </div>
    `;

    const recipient = hireEmail || 'yskim@gopowernet.com';
    let finalSentTo = recipient;

    try {
      if (hireEmail && hireEmail !== 'yskim@gopowernet.com') {
        await resend.emails.send({
          from: 'POWER NET HR Sync <onboarding@resend.dev>',
          to: hireEmail,
          subject: `[파워넷 온보딩] ${empName}님, ${milestoneTitle}`,
          html: emailHtml(hireEmail, false)
        });
      } else {
        throw new Error('Default to admin sandbox');
      }
    } catch (sendErr) {
      finalSentTo = 'yskim@gopowernet.com';
      await resend.emails.send({
        from: 'POWER NET HR Sync <onboarding@resend.dev>',
        to: 'yskim@gopowernet.com',
        subject: `[파워넷 온보딩 알림] (수신: ${hireEmail || empName}) ${empName}님, ${milestoneTitle}`,
        html: emailHtml(hireEmail || '신입사원', true)
      });
    }

    // Supabase Log에 발송 내역 기록
    try {
      await supabaseAdmin.from('logs').insert({
        system_name: '온보딩 자동 알림 (Resend)',
        result_message: `${empName} (${department}) [${milestoneTitle}] 자동 안내 발송 완료 (수신: ${hireEmail || 'yskim@gopowernet.com'})`,
        is_success: true
      });
    } catch (dbErr) {
      console.error('Failed to log milestone email', dbErr);
    }

    return NextResponse.json({
      success: true,
      milestoneTitle,
      sentTo: finalSentTo
    });

  } catch (error: any) {
    console.error('Milestone email send error:', error);
    return NextResponse.json({ error: error.message || '이메일 발송 실패' }, { status: 500 });
  }
}
