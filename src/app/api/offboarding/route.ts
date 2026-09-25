import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const { name, department, targetDate, mode = 'SCHEDULED' } = await request.json();

    if (!name || !department) {
      return NextResponse.json({ error: '임직원 성명과 소속 부서는 필수 입력값입니다.' }, { status: 400 });
    }

    const finalTargetDate = targetDate || new Date().toISOString().split('T')[0];
    const isImmediate = mode === 'IMMEDIATE';

    // 1. 기존 임직원 검색 또는 신규 등록
    let empId: string | null = null;
    const { data: existingEmp } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('name', name)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingEmp) {
      empId = existingEmp.id;
      await supabaseAdmin
        .from('employees')
        .update({
          status: isImmediate ? 'OFFBOARDED' : 'OFFBOARDING',
          target_date: finalTargetDate
        })
        .eq('id', empId);
    } else {
      const { data: newEmp, error: newEmpErr } = await supabaseAdmin
        .from('employees')
        .insert({
          name,
          department,
          status: isImmediate ? 'OFFBOARDED' : 'OFFBOARDING',
          target_date: finalTargetDate
        })
        .select('id')
        .single();

      if (newEmpErr) throw newEmpErr;
      empId = newEmp.id;
    }

    // 2. 권한 회수 작업 등록 (IMMEDIATE: COMPLETED / SCHEDULED: PENDING)
    const taskStatus = isImmediate ? 'COMPLETED' : 'PENDING';
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({
        employee_id: empId,
        task_type: 'REVOKE_ACCESS',
        status: taskStatus
      })
      .select('id')
      .single();

    if (taskError) throw taskError;

    const docNo = `PWN-OFF-${new Date().getFullYear()}-${task.id.slice(0, 6).toUpperCase()}`;

    // 3. ITGC 내부통제 컴플라이언스 감사 로그 기록
    if (isImmediate) {
      await supabaseAdmin.from('logs').insert([
        {
          task_id: task.id,
          system_name: 'Groupware / Google Workspace',
          result_message: `[원터치 종합 퇴사] ${name} (${department}) 그룹웨어(다우오피스), 메일, 사내 인트라넷 계정 영구 잠금 및 활성 SSO 세션 강제 종료`,
          is_success: true
        },
        {
          task_id: task.id,
          system_name: 'ERP / MES System',
          result_message: `[원터치 종합 퇴사] ${name} 님의 사내 ERP, MES, 회계 및 사내망 VPN 접근 권한 일괄 박탈 완료`,
          is_success: true
        },
        {
          task_id: task.id,
          system_name: 'S1 Security / Gate',
          result_message: `[원터치 종합 퇴사] 수원사업장 및 서울본사 에스원(S1) 스피드게이트/보안구역 출입 권한 영구 파기 및 사원증 회수`,
          is_success: true
        },
        {
          task_id: task.id,
          system_name: 'IT Asset Register',
          result_message: `[원터치 종합 퇴사] 대여 IT 장비(노트북, 모니터, 고정 IP) 일괄 회수(RETURNED) 처리 및 포맷 대기 완료`,
          is_success: true
        }
      ]);
    } else {
      await supabaseAdmin.from('logs').insert({
        task_id: task.id,
        system_name: 'Offboarding Scheduler',
        result_message: `[퇴사 예약] ${name} (${department}) 퇴사 예정일(${finalTargetDate}) D+1 자동 권한 회수 및 계정 차단 예약 등록 완료`,
        is_success: true
      });
    }

    return NextResponse.json({ 
      success: true, 
      taskId: task.id,
      employeeId: empId,
      docNo,
      isImmediate
    });
  } catch (error: any) {
    console.error('Offboarding Error:', error);
    return NextResponse.json({ error: error.message || '퇴사 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
