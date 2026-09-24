import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // 1. 도메인 검증
    if (!email || !email.endsWith('@gopowernet.com')) {
      return NextResponse.json({ error: '유효하지 않은 이메일입니다.' }, { status: 400 });
    }

    // 2. admin_users 테이블에서 이메일 조회
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('is_approved')
      .eq('email', email)
      .single();

    // 사용자가 없는 경우 (처음 접속)
    if (fetchError && fetchError.code === 'PGRST116') {
      // is_approved를 false(승인 대기)로 DB에 저장
      await supabaseAdmin.from('admin_users').insert({ email, is_approved: false });
      return NextResponse.json({ status: 'pending' });
    }

    if (fetchError) throw fetchError;

    // 3. 이미 승인된 사용자인지 확인
    if (user && user.is_approved) {
      return NextResponse.json({ status: 'approved' });
    } else {
      return NextResponse.json({ status: 'pending' });
    }
  } catch (error) {
    console.error('Auth Check Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
