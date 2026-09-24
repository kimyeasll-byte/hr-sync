import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  // 퇴사자(OFFBOARDING)가 아닌 현재 재직중인 사람만 긁어옵니다.
  let query = supabaseAdmin
    .from('employees')
    .select('id, name, department')
    .neq('status', 'OFFBOARDING')
    .order('created_at', { ascending: false })
    .limit(10); // 성능을 위해 최대 10명

  // 검색어가 있으면 이름이나 부서로 필터링
  if (q) {
    query = query.or(`name.ilike.%${q}%,department.ilike.%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Search Error:', error);
    return NextResponse.json({ error: '검색 중 오류가 발생했습니다.' }, { status: 500 });
  }

  return NextResponse.json(data);
}
