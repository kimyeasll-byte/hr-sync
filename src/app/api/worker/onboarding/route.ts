import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'mock');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, empName, department } = body;

    if (!taskId) return NextResponse.json({ error: 'No taskId' }, { status: 400 });

    // 1. DB 업데이트 (COMPLETED)
    await supabaseAdmin.from('tasks').update({ status: 'COMPLETED' }).eq('id', taskId);

    // 2. 이메일 발송 (Resend)
    // MVP 데모를 위해 무조건 기획자 메일로 발송되도록 하드코딩
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'mock') {
      await resend.emails.send({
        from: 'HR Sync <onboarding@resend.dev>',
        to: 'yskim@gopowernet.com',
        subject: `[HR Sync] ${empName}님, ${department} 입사를 환영합니다! 🎉`,
        html: `
          <div style="font-family: sans-serif; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; max-width: 500px; margin: 0 auto; background-color: #ffffff;">
            <h2 style="color: #1a1a1a; margin-top: 0;">${empName}님, 환영합니다! 🎉</h2>
            <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
              <strong>${department}</strong> 부서로의 입사 세팅이 모두 완료되었습니다.<br/>
              첫 출근일에 뵙기를 고대하고 있겠습니다.
            </p>
            <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">📋 온보딩 필수 체크리스트</h3>
              <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0; color: #334155; line-height: 2;">
                <li>✅ 그룹웨어 (다우오피스) 계정 발급 완료</li>
                <li>✅ 사내 출입증 및 장비 세팅 완료</li>
                <li>✅ HR Sync 자동화 등록 완료</li>
                <li>⬜ 1주차 신규 입사자 OT (진행 예정)</li>
              </ul>
            </div>
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;">
              본 메일은 HR Sync 시스템에 의해 자동 발송되었습니다.
            </p>
          </div>
        `
      });
    }

    // 3. 로그 기록
    await supabaseAdmin.from('logs').insert({
      task_id: taskId,
      system_name: 'Email (Resend)',
      result_message: `${empName} (${department}) 자동 웰컴 이메일 발송 완료!`,
      is_success: true
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Worker Error:', error);
    return NextResponse.json({ error: 'Worker failed' }, { status: 500 });
  }
}
