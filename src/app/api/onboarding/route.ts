import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { Client } from "@upstash/qstash";

const qstashClient = new Client({ token: process.env.QSTASH_TOKEN || 'mock' });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, department, target_date, targetDate, email } = body;
    const finalTargetDate = target_date || targetDate;

    // 1. employees 테이블 인서트
    const { data: empData, error: empError } = await supabaseAdmin
      .from('employees')
      .insert({ name, department, status: 'ONBOARDING', target_date: finalTargetDate })
      .select()
      .single();

    if (empError) throw empError;

    // 2. tasks 테이블 인서트
    const { data: taskData, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({ employee_id: empData.id, task_type: 'ONBOARDING', status: 'IN_PROGRESS' })
      .select()
      .single();

    if (taskError) throw taskError;

    // 3. Upstash QStash 큐 발송 (Vercel 환경일 때)
    if (process.env.QSTASH_TOKEN && process.env.QSTASH_TOKEN !== 'mock') {
      await qstashClient.publishJSON({
        url: `https://hr-sync-delta.vercel.app/api/worker/onboarding`,
        body: { taskId: taskData.id, empName: name, department, hireEmail: email },
        delay: 3
      });
    } else {
      // 로컬 테스트용 폴백
      setTimeout(async () => {
        await supabaseAdmin.from('tasks').update({ status: 'COMPLETED' }).eq('id', taskData.id);
        await supabaseAdmin.from('logs').insert({
          task_id: taskData.id,
          system_name: 'ERP / Groupware',
          result_message: `${name} (${department}) 계정 발급 완료 (Local Mock)`,
          is_success: true
        });
      }, 3000);
    }

    return NextResponse.json({ success: true, employee: empData, task: taskData });
  } catch (error: any) {
    console.error('Onboarding Error:', error);
    return NextResponse.json({ error: error.message || '서버 오류' }, { status: 500 });
  }
}
