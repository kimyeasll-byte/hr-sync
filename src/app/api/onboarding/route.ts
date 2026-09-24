import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const { name, department, targetDate } = await request.json();

    if (!name || !department || !targetDate) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 1. 임직원 정보 테이블에 저장
    const { data: employee, error: empError } = await supabaseAdmin
      .from('employees')
      .insert({
        name,
        department,
        status: 'ONBOARDING',
        target_date: targetDate
      })
      .select('id')
      .single();

    if (empError) throw empError;

    // 2. 작업을 지시하는 Tasks 테이블에 등록
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({
        employee_id: employee.id,
        task_type: 'CREATE_ACCOUNTS',
        status: 'IN_PROGRESS' 
      })
      .select('id')
      .single();

    if (taskError) throw taskError;

    // [로컬 테스트용] 가짜 백그라운드 워커 (응답을 먼저 보내고 3초 뒤에 실행됨)
    // 실제 운영 환경(Vercel)에서는 QStash로 대체될 부분입니다.
    setTimeout(async () => {
      // 3초 대기
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 상태를 'COMPLETED'로 변경 (이 순간 프론트엔드 실시간 알림이 발동함)
      await supabaseAdmin.from('tasks').update({ status: 'COMPLETED' }).eq('id', task.id);
      
      // 로그 저장
      await supabaseAdmin.from('logs').insert({
        task_id: task.id,
        system_name: 'Mock ERP',
        result_message: '로컬 임시 큐: 그룹웨어 및 ERP 계정 세팅 100% 완료',
        is_success: true
      });
    }, 0);
    
    return NextResponse.json({ success: true, taskId: task.id });
  } catch (error: any) {
    console.error('Onboarding Error:', error);
    return NextResponse.json({ error: '서버 저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
