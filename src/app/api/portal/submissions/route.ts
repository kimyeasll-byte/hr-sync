import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const empId = searchParams.get('empId');

    let query = supabaseAdmin
      .from('logs')
      .select('id, system_name, result_message, created_at')
      .eq('system_name', 'PORTAL_SUBMISSION_PAYLOAD')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: logs, error } = await query;

    if (error) {
      console.error('Error fetching portal submissions:', error);
      return NextResponse.json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
    }

    // employeeId별 최신 제출 데이터 맵핑
    const submissionsMap: Record<string, any> = {};

    if (logs && logs.length > 0) {
      for (const log of logs) {
        try {
          const parsed = JSON.parse(log.result_message);
          const key = parsed.employeeId;
          if (key && !submissionsMap[key]) {
            submissionsMap[key] = {
              ...parsed,
              logId: log.id,
              submittedAt: parsed.submittedAt || log.created_at
            };
          }
        } catch (e) {
          // parse error fallback
        }
      }
    }

    if (empId) {
      return NextResponse.json({
        success: true,
        submission: submissionsMap[empId] || null
      });
    }

    return NextResponse.json({
      success: true,
      submissions: submissionsMap
    });
  } catch (err: any) {
    console.error('Unexpected error in submissions API:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
