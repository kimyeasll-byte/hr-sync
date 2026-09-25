import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    if (!token) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 400 });
    }

    const decodedToken = decodeURIComponent(token).trim();

    // 1. UUID 또는 ID로 직원 조회
    let { data: emp, error } = await supabaseAdmin
      .from('employees')
      .select('id, name, department, status, target_date, created_at')
      .eq('id', decodedToken)
      .maybeSingle();

    // 2. 만약 UUID가 아닌 이름으로 접근한 경우 폴백 조회 (테스트 편의)
    if (!emp) {
      const { data: empByName } = await supabaseAdmin
        .from('employees')
        .select('id, name, department, status, target_date, created_at')
        .eq('name', decodedToken)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      emp = empByName;
    }

    if (!emp) {
      return NextResponse.json(
        { error: '존재하지 않거나 만료된 입사자 온보딩 링크입니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee: emp
    });
  } catch (error: any) {
    console.error('Portal GET Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    const body = await request.json();
    const { checklist, photoData, welcomeNote, completedCount, totalCount } = body;

    const decodedToken = decodeURIComponent(token).trim();

    let { data: emp } = await supabaseAdmin
      .from('employees')
      .select('id, name, department')
      .eq('id', decodedToken)
      .maybeSingle();

    if (!emp) {
      const { data: empByName } = await supabaseAdmin
        .from('employees')
        .select('id, name, department')
        .eq('name', decodedToken)
        .limit(1)
        .maybeSingle();
      emp = empByName;
    }

    const empName = emp ? emp.name : '신규 입사자';
    const deptName = emp ? emp.department : '';
    const empId = emp ? emp.id : decodedToken;

    // 해당 직원의 최근 ONBOARDING 태스크 조회 (감사 로그 연동)
    const { data: task } = await supabaseAdmin
      .from('tasks')
      .select('id')
      .eq('employee_id', empId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const taskId = task?.id || null;

    // 1. 감사 로그(Audit Log)에 신입사원 셀프 온보딩 제출 내역 영구 기록
    await supabaseAdmin.from('logs').insert({
      task_id: taskId,
      system_name: '신규 입사자 셀프 포털',
      result_message: `${empName} (${deptName}) 님이 모바일 셀프 온보딩 포털에서 필수 준비물 확인 (${completedCount || 0}/${totalCount || 5}) 및 사원증 사진을 접수했습니다. 입사 각오: "${welcomeNote || '첫 출근 기대됩니다!'}"`,
      is_success: true
    });

    // 2. 관리자 대시보드 조회를 위한 상세 페이로드 보관 (사진, 세부 체크리스트, 입사 각오)
    await supabaseAdmin.from('logs').insert({
      task_id: taskId,
      system_name: 'PORTAL_SUBMISSION_PAYLOAD',
      result_message: JSON.stringify({
        employeeId: empId,
        employeeName: empName,
        department: deptName,
        checklist: checklist || {},
        photoData: photoData || null,
        welcomeNote: welcomeNote || '',
        completedCount: completedCount || 0,
        totalCount: totalCount || 5,
        submittedAt: new Date().toISOString()
      }),
      is_success: true
    });

    return NextResponse.json({
      success: true,
      message: '성공적으로 제출되었습니다. 인사기획팀에 알림이 전달되었습니다.'
    });
  } catch (error: any) {
    console.error('Portal POST Error:', error);
    return NextResponse.json({ error: '제출 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
