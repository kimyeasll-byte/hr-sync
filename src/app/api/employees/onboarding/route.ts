import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    let query = supabaseAdmin
      .from('employees')
      .select('id, name, department, status, target_date, created_at')
      .neq('status', 'CANCELLED')
      .order('created_at', { ascending: false })
      .limit(30);

    if (q) {
      query = query.or(`name.ilike.%${q}%,department.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching onboarding employees:', error);
      return NextResponse.json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error('Unexpected error in onboarding API:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
