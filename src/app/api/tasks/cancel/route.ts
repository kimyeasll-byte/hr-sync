import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const { taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: 'taskId가 필요합니다.' }, { status: 400 });
    }

    // 1. 해당 Task 조회
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .select('*, employees(*)')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: '작업을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (task.status === 'CANCELLED') {
      return NextResponse.json({ error: '이미 철회된 작업입니다.' }, { status: 400 });
    }

    // 2. Task 상태를 CANCELLED로 변경
    const { error: updateError } = await supabaseAdmin
      .from('tasks')
      .update({ status: 'CANCELLED' })
      .eq('id', taskId);

    if (updateError) throw updateError;

    const emp = task.employees;
    const isRevoke = task.task_type === 'REVOKE_ACCESS' || task.task_type === 'OFFBOARDING';

    // 3. 임직원 상태 복원 또는 취소
    if (emp) {
      if (isRevoke) {
        // 퇴사 권한 회수 철회 -> 정상 재직으로 복원
        await supabaseAdmin
          .from('employees')
          .update({ status: 'ACTIVE' })
          .eq('id', emp.id);

        await supabaseAdmin.from('logs').insert({
          task_id: taskId,
          system_name: '관리자 작업',
          result_message: `${emp.name} (${emp.department}) 퇴사 권한 회수 예약이 철회되었습니다. (정상 재직 복원)`,
          is_success: true,
        });
      } else {
        // 신규 입사 세팅 철회
        await supabaseAdmin
          .from('employees')
          .update({ status: 'CANCELLED' })
          .eq('id', emp.id);

        await supabaseAdmin.from('logs').insert({
          task_id: taskId,
          system_name: '관리자 작업',
          result_message: `${emp.name} (${emp.department}) 신규 입사 세팅이 철회되었습니다.`,
          is_success: true,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cancel Task Error:', error);
    return NextResponse.json({ error: error.message || '서버 오류' }, { status: 500 });
  }
}
