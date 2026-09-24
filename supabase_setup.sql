-- HR Sync 데이터베이스 테이블 생성 스크립트

-- 1. 관리자(인사팀) 테이블
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 임직원(입/퇴사자) 테이블
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL, -- 'ONBOARDING', 'OFFBOARDING'
    target_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 작업(Task) 테이블
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    task_type TEXT NOT NULL, -- 'CREATE_ACCOUNTS', 'REVOKE_ACCESS' 등
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 로그(Log) 테이블 (내부 감사용 3년 보관)
CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    system_name TEXT NOT NULL,
    result_message TEXT,
    is_success BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
