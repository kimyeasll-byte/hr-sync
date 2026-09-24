# 2. 데이터베이스 구조 (ERD)

## ERD (Mermaid)
```mermaid
erDiagram
    ADMIN_USERS {
        uuid id PK
        string email "담당자 이메일 (@gopowernet.com)"
        boolean is_approved "최고 관리자 승인 여부"
        timestamp created_at
    }

    EMPLOYEES {
        uuid id PK
        string name "이름"
        string department "소속"
        string status "상태 (ONBOARDING, OFFBOARDING)"
        date target_date "출근일 / 퇴사일(D-day)"
        timestamp created_at
    }
    
    TASKS {
        uuid id PK
        uuid employee_id FK
        string task_type "CREATE_ACCOUNTS, REVOKE_ACCESS 등"
        string status "PENDING, IN_PROGRESS, COMPLETED, FAILED"
        timestamp created_at
    }
    
    LOGS {
        uuid id PK
        uuid task_id FK
        string system_name "그룹웨어, ERP 등"
        string result_message "성공 내역 또는 실패 사유"
        boolean is_success
        timestamp created_at "보관 기간: 3년"
    }
    
    ADMIN_USERS ||--o{ TASKS : "지시한다 (담당자 추적용)"
    EMPLOYEES ||--o{ TASKS : "가진다"
    TASKS ||--o{ LOGS : "남긴다"
```

## 도메인 문서 매핑
- **ADMIN_USERS (담당자)**: 시스템에 접속하는 인사/전산팀 4명의 계정. 관리자의 승인(`is_approved = true`)이 없으면 업무 화면 접근이 차단됨.
- **EMPLOYEES (직원)**: 신규 입사자와 퇴사자의 기본 정보.
- **TASKS (작업 덩어리)**: 계정 생성, 권한 회수 등의 백그라운드 작업 단위. 
- **LOGS (성공/실패 기록)**: 알림 패널에 띄울 성공/에러 메시지 및 내부 감사(ITGC)용 3년 보관 데이터.
