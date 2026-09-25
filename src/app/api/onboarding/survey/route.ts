import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

// AI 신입사원 조직 적응도 & 조기퇴사 위험 신호 분석 엔진
export function analyzePulseSurvey(params: {
  empName: string;
  department: string;
  stage: string;
  workScore: number;
  teamScore: number;
  equipScore: number;
  feedbackText: string;
}) {
  const { empName, department, stage, workScore, teamScore, equipScore, feedbackText } = params;
  const totalScore = workScore + teamScore + equipScore; // 3 ~ 15

  const text = (feedbackText || '').toLowerCase();

  // 감성 키워드 가중치 사전
  const highRiskKeywords = ['퇴사', '이직', '그만', '스트레스', '우울', '과부하', '압박', '힘들', '지침', '외롭', '무시', '불통', '포기', '못하겠', '적응 안', '후회', '괴롭'];
  const moderateKeywords = ['어려움', '부족', '불편', '모르겠', '답답', '지연', '야근', '혼란', '버벅', '소통'];
  const positiveKeywords = ['만족', '즐겁', '좋음', '친절', '기대', '도움', '보람', '성장', '감사', '환영', '쾌적', '든든'];

  const matchedHigh = highRiskKeywords.filter(k => text.includes(k));
  const matchedMod = moderateKeywords.filter(k => text.includes(k));
  const matchedPos = positiveKeywords.filter(k => text.includes(k));

  // 조기퇴사 위험도 점수 계산 (0 ~ 100점, 높을수록 위험)
  let riskScore = 0;

  // 점수 기반 (낮을수록 위험)
  riskScore += (5 - workScore) * 6;     // 최대 24점
  riskScore += (5 - teamScore) * 8;     // 최대 32점 (팀 소통/고립감에 최고 가중치)
  riskScore += (5 - equipScore) * 4;    // 최대 16점

  // 키워드 페널티
  riskScore += matchedHigh.length * 15;
  riskScore += matchedMod.length * 5;
  riskScore -= matchedPos.length * 5;
  riskScore = Math.max(0, Math.min(100, riskScore));

  // 플래그 결정 (RED / YELLOW / GREEN)
  let flag: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
  let flagTitle = '';
  let flagDescription = '';

  if (riskScore >= 55 || teamScore <= 2 || matchedHigh.length >= 2 || totalScore <= 7) {
    flag = 'RED';
    flagTitle = '🚨 조기 퇴사 고위험 신호 (Red Flag)';
    flagDescription = '업무 과부하 또는 팀 내 소통 단절로 인한 이탈 위험이 매우 높습니다. 48시간 이내 인사팀 긴급 면담이 필수적입니다.';
  } else if (riskScore >= 30 || totalScore <= 10 || matchedMod.length >= 2) {
    flag = 'YELLOW';
    flagTitle = '⚠️ 조직 적응 주의 신호 (Yellow Flag)';
    flagDescription = '기본적인 업무 몰입은 가능하나 특정 영역(장비/업무량/멘토링)에서 답답함을 겪고 있습니다. 선제적 케어가 필요합니다.';
  } else {
    flag = 'GREEN';
    flagTitle = '✨ 안정적 조직 안착 (Green Flag)';
    flagDescription = '팀 분위기와 업무 환경에 매우 긍정적이며, 파워넷 조직 문화에 안정적으로 스며들고 있습니다.';
  }

  // AI 심층 분석 요약 작성
  // AI 심층 분석 요약 작성 (회차별 질문 특성에 맞춘 리스크 팩터 도출)
  const riskFactors: string[] = [];
  const actionItems: string[] = [];

  let scoreLabels = {
    score1: '초기 업무 난이도',
    score2: '사수·팀원 소통',
    score3: 'IT·장비 인프라'
  };

  if (stage === 'MONTH_3' || stage === 'D_90') {
    scoreLabels = {
      score1: '직무 R&R/목표 명확성',
      score2: '부서·협업 원활성',
      score3: '업무 자율성/주도권'
    };

    if (workScore <= 2) {
      riskFactors.push('담당 직무 역할(R&R) 및 핵심 목표 모호함');
      actionItems.push('부서장 면담을 통해 직무 기술서(JD) 재정립 및 구체적 수습 KPI 공유');
    }
    if (teamScore <= 2) {
      riskFactors.push('팀 및 타 부서와의 협업 조율 갈등 또는 소통 난항');
      actionItems.push('유관 부서 인터페이스 조율 및 팀장 중재 미팅 진행');
    }
    if (equipScore <= 2) {
      riskFactors.push('업무 자율성 부족 및 지나친 수동적 업무 지시');
      actionItems.push('자기주도 과제 부여 및 단계적 의사결정 권한 위임');
    }
  } else if (stage === 'MONTH_6') {
    scoreLabels = {
      score1: '직무 역량 성장감',
      score2: '성과 피드백·인정',
      score3: '업무 몰입·워라밸'
    };

    if (workScore <= 2) {
      riskFactors.push('직무 전문성 성장 정체 및 업무 매너리즘 징후');
      actionItems.push('신규 프로젝트 참여 기회 제공 및 직무 교육/도서 구매 지원');
    }
    if (teamScore <= 2) {
      riskFactors.push('성과에 대한 피드백 및 상사의 인정 결여');
      actionItems.push('부서장 1:1 면담을 통한 중간 성과 칭찬 및 구체적 피드백 제공');
    }
    if (equipScore <= 2) {
      riskFactors.push('업무 과부하로 인한 피로 누적 및 번아웃 위험');
      actionItems.push('부서 내 업무 분장 재검토 및 리프레시 연차 사용 권장');
    }
  } else if (stage === 'YEAR_1') {
    scoreLabels = {
      score1: '중장기 커리어 비전',
      score2: '평가/보상·조직문화',
      score3: '회사 추천(eNPS)'
    };

    if (workScore <= 2) {
      riskFactors.push('파워넷에서의 중장기 커리어 비전 부재 및 이직 고민');
      actionItems.push('인사팀 리텐션 심층 면담 및 중장기 커리어 패스(CDP) 설계 지원');
    }
    if (teamScore <= 2) {
      riskFactors.push('평가/보상 체계 또는 사내 조직문화에 대한 불만족');
      actionItems.push('차기 연도 연봉/승진 프로세스 투명 안내 및 고충 수렴');
    }
    if (equipScore <= 2) {
      riskFactors.push('회사 추천 의향(eNPS) 저조 (외피적 소속감)');
      actionItems.push('조직문화 개선 TF 의견 수렴 및 1주년 축하 기념 케어 진행');
    }
  } else {
    // 1개월차 (MONTH_1 / 기본값)
    if (workScore <= 2) {
      riskFactors.push('초기 업무 난이도 과중 및 방향성 혼란');
      actionItems.push('멘토(사수)와의 업무량 조율 및 기본 OJT 보강');
    }
    if (teamScore <= 2) {
      riskFactors.push('팀원 및 멘토와의 소통 단절 및 고립감 호소');
      actionItems.push('사수와의 1:1 캐주얼 커피챗 및 멘토링 프로그램 점검');
    }
    if (equipScore <= 2) {
      riskFactors.push('필수 IT 장비(노트북/모니터) 또는 시스템 권한 지원 지연');
      actionItems.push('전산 총무팀에 고정 IP/ERP 계정 및 듀얼 모니터 긴급 불출 요청');
    }
  }

  if (matchedHigh.length > 0) {
    riskFactors.push(`주관식 의견 내 위험 징후 키워드 감지: "${matchedHigh.join(', ')}"`);
    actionItems.push('인사기획팀 온보딩 담당자의 비밀 보장 1:1 심층 고충 면담 진행');
  }

  if (flag === 'GREEN') {
    if (riskFactors.length === 0) riskFactors.push('특이 위험 요인 없음 (안정적 안착)');
    if (stage === 'MONTH_6') {
      actionItems.push('반기 직무 몰입도 우수 임직원 대상 성장 지원 프로그램(도서/교육) 적극 권장');
    } else if (stage === 'YEAR_1') {
      actionItems.push('입사 1주년 축하 리워드 지급 및 차기 연도 개인 커리어 개발 플랜(CDP) 수립 지원');
    } else {
      actionItems.push('현재 업무 성과에 대한 따뜻한 피드백과 격려 메시지 전달');
      actionItems.push('차주 예정된 팀 런치 및 멘토링 프로그램 정상 가동');
    }
  }

  let stageLabel = '1개월차 조직 적응 점검';
  if (stage === 'MONTH_3' || stage === 'D_90') {
    stageLabel = '3개월차 수습 평가';
  } else if (stage === 'MONTH_6') {
    stageLabel = '6개월차 직무 몰입 & 성장 점검';
  } else if (stage === 'YEAR_1') {
    stageLabel = '1년차 안착 & 리텐션 진단';
  }

  const aiDiagnosis = `${empName} 님(${department}, ${stageLabel})의 설문 분석 결과, 총점 ${totalScore}/15점(조기퇴사 위험지수 ${riskScore}점)으로 [${flag}] 상태로 진단되었습니다. ` +
    (flag === 'RED' 
      ? `특히 ${riskFactors[0] || '전반적인 만족도 저하'} 문제가 심각하여 조기 퇴사 및 이탈로 이어질 가능성이 감지됩니다. `
      : flag === 'YELLOW'
      ? `업무 수행 중 ${riskFactors[0] || '일부 애로사항'}이 관찰되어 가벼운 부서 차원의 조율이 권장됩니다. `
      : `전반적인 직무 만족도와 팀 친밀도가 매우 우수하여 모범적으로 안착하고 있습니다. `) +
    `인사팀은 추천 액션 플랜을 참고하여 ${flag === 'RED' ? '즉시 개입' : '맞춤 케어'}를 진행하시기 바랍니다.`;

  return {
    flag,
    flagTitle,
    flagDescription,
    riskScore,
    totalScore,
    aiDiagnosis,
    riskFactors,
    actionItems,
    scores: {
      workScore,
      teamScore,
      equipScore,
      labels: scoreLabels
    },
    analyzedAt: new Date().toISOString()
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const empId = searchParams.get('empId');

    const { data: logs, error } = await supabaseAdmin
      .from('logs')
      .select('id, system_name, result_message, created_at')
      .eq('system_name', 'PULSE_SURVEY_ANALYSIS')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching pulse survey records:', error);
      return NextResponse.json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' }, { status: 500 });
    }

    const surveysMap: Record<string, any> = {};

    if (logs && logs.length > 0) {
      for (const log of logs) {
        try {
          const parsed = JSON.parse(log.result_message);
          const key = parsed.employeeId;
          if (key && !surveysMap[key]) {
            surveysMap[key] = {
              ...parsed,
              logId: log.id,
              submittedAt: parsed.submittedAt || log.created_at
            };
          }
        } catch (e) {}
      }
    }

    if (empId) {
      return NextResponse.json({
        success: true,
        survey: surveysMap[empId] || null
      });
    }

    return NextResponse.json({
      success: true,
      surveys: surveysMap
    });
  } catch (err: any) {
    console.error('Unexpected error in survey GET:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      employeeId,
      employeeName,
      department,
      stage = 'D_30',
      workScore = 3,
      teamScore = 3,
      equipScore = 3,
      feedbackText = ''
    } = body;

    if (!employeeId && !employeeName) {
      return NextResponse.json({ error: '입사자 식별 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 1. 직원 정보 검증
    let empId = employeeId;
    let empName = employeeName;
    let dept = department;

    if (empId) {
      const { data: emp } = await supabaseAdmin
        .from('employees')
        .select('id, name, department')
        .eq('id', empId)
        .maybeSingle();
      if (emp) {
        empName = emp.name;
        dept = emp.department;
      }
    } else if (empName) {
      const { data: emp } = await supabaseAdmin
        .from('employees')
        .select('id, name, department')
        .eq('name', empName)
        .limit(1)
        .maybeSingle();
      if (emp) {
        empId = emp.id;
        dept = emp.department;
      }
    }

    // 2. AI 분석 엔진 가동
    const analysis = analyzePulseSurvey({
      empName: empName || '신규 입사자',
      department: dept || '부서',
      stage,
      workScore: Number(workScore),
      teamScore: Number(teamScore),
      equipScore: Number(equipScore),
      feedbackText: feedbackText || ''
    });

    // 3. 작업(Task) ID 연결
    const { data: task } = await supabaseAdmin
      .from('tasks')
      .select('id')
      .eq('employee_id', empId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const taskId = task?.id || null;

    // 4. 공식 감사 로그 기록
    await supabaseAdmin.from('logs').insert({
      task_id: taskId,
      system_name: '신입사원 조직 적응도 펄스 서베이',
      result_message: `[${analysis.flag}] ${empName} (${dept}) 펄스 서베이 완료 (총점 ${analysis.totalScore}/15, 위험도 ${analysis.riskScore}%). AI 진단: "${analysis.flagTitle}"`,
      is_success: true
    });

    // 5. 구조화된 분석 리포트 페이로드 저장
    const payload = {
      employeeId: empId,
      employeeName: empName,
      department: dept,
      stage,
      feedbackText,
      analysis,
      submittedAt: new Date().toISOString()
    };

    await supabaseAdmin.from('logs').insert({
      task_id: taskId,
      system_name: 'PULSE_SURVEY_ANALYSIS',
      result_message: JSON.stringify(payload),
      is_success: true
    });

    return NextResponse.json({
      success: true,
      message: '설문 응답 및 AI 분석이 성공적으로 등록되었습니다.',
      analysis,
      payload
    });
  } catch (error: any) {
    console.error('Survey POST Error:', error);
    return NextResponse.json({ error: error.message || '설문 제출 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
