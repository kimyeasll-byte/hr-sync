import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const { name, department, targetDate } = await request.json();

    if (!name || !department || !targetDate) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 1. 임직원 정보 테이블에 저장 (상태를 OFFBOARDING으로 기록)
    const { data: employee, error: empError } = await supabaseAdmin
      .from('employees')
      .insert({
        name,
        department,
        status: 'OFFBOARDING',
        target_date: targetDate
      })
      .select('id')
      .single();

    if (empError) throw empError;

    // 2. 권한 회수 작업을 Tasks 테이블에 등록 (PENDING 상태로 예약)
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({
        employee_id: employee.id,
        task_type: 'REVOKE_ACCESS',
        status: 'PENDING' 
      })
      .select('id')
      .single();

    if (taskError) throw taskError;

    // TODO: 원래는 여기서 Upstash QStash의 delay 옵션을 사용해 targetDate + 1일에 워커를 실행하도록 메시지를 예약합니다.
    // MVP 로컬 환경에서는 DB에 PENDING 상태로 밀어넣는 것까지만 진행합니다.

    return NextResponse.json({ success: true, taskId: task.id });
  } catch (error: any) {
    console.error('Offboarding Error:', error);
    return NextResponse.json({ error: '서버 예약 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
