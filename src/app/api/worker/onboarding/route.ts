import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, empName, department } = body;

    if (!taskId) return NextResponse.json({ error: 'No taskId' }, { status: 400 });

    // DB 업데이트
    await supabaseAdmin.from('tasks').update({ status: 'COMPLETED' }).eq('id', taskId);

    // 로그 기록
    await supabaseAdmin.from('logs').insert({
      task_id: taskId,
      system_name: 'ERP / Groupware',
      result_message: `${empName} (${department}) 계정 발급 완료 (QStash)`,
      is_success: true
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Worker Error:', error);
    return NextResponse.json({ error: 'Worker failed' }, { status: 500 });
  }
}
