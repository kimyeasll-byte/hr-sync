import { createClient } from '@supabase/supabase-js';

// 프론트엔드(화면)에서 실시간 알림 등을 받기 위해 사용하는 클라이언트입니다.
// 퍼블릭 키를 사용하므로 브라우저에 노출되어도 안전합니다.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
