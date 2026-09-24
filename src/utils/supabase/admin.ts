import { createClient } from '@supabase/supabase-js';

// 프론트엔드가 아닌, 오직 백엔드 서버(API)에서만 사용하는 마스터 클라이언트입니다.
// RLS를 우회하여 모든 테이블에 접근할 수 있습니다.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
