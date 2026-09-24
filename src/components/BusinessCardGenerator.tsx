'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, FileText, Sparkles, Building2 } from 'lucide-react';

const LOCATIONS = {
  seoul: {
    kr: '서울시 금천구 두산로 70, B동 17층(현대지식산업센터)',
    en: 'B-17F, Du-san-ro, Guncheongu, Seoul',
    phone: '02-3282-0752',
    fax: '02-3282-0889'
  },
  suwon: {
    kr: '경기 수원시 영통구 신원로250번길 13, 현대테라타워영통 A동 1403호',
    en: '1403, A dong, 13, Sinwon-ro, 250beon-gil, Yeongtong-gu, Suwon-si, Gyeonggi-do',
    phone: '02-3282-0700',
    fax: '02-3282-0889'
  }
};

// 파워넷 직급/직책 영문 사전
const TITLE_MAP: Record<string, string> = {
  // [사업부 직급]
  '사원': 'Associate',
  '주임': 'Assistant Manager',
  '대리': 'Assistant Manager',
  '과장': 'Manager',
  '차장': 'Senior Manager',
  '부장': 'General Manager',
  '담당': 'Director',
  '이사': 'Managing Director',
  '상무': 'Senior Managing Director',
  '전무': 'Senior Managing Director',
  '전무이사': 'Senior Managing Director',
  '부사장': 'Executive Vice President',
  '대표이사': 'CEO & President',

  // [연구소 직급]
  '연구원': 'Research Engineer',
  '주임연구원': 'Associate Research Engineer',
  '선임연구원': 'Senior Research Engineer',
  '책임연구원': 'Principal Research Engineer',
  '수석연구원': 'Lead Research Engineer',

  // [직책]
  '팀원': 'Team Member',
  '파트장': 'Part Leader',
  '팀장': 'Team Leader',
  '사업부장': 'Head of Business Division',
  '연구소장': 'Head of R&D Center',
  '그룹장': 'Group Leader'
};

// 한글 직급 -> 영문 직급 자동 변환 함수
function autoTranslateTitle(koreanTitle: string): string {
  if (!koreanTitle) return '';
  const trimmed = koreanTitle.trim();

  // 1. 단어 단위 매칭 (슬래시 '/' 또는 공백 구분 지원: 예: "전무이사 / C프로젝트 팀장" 또는 "대리 / 경영지원팀")
  const tokens = trimmed.split(/[\/\s,]+/).map(t => t.trim()).filter(Boolean);
  const matchedTokens: string[] = [];

  for (const token of tokens) {
    if (TITLE_MAP[token]) {
      matchedTokens.push(TITLE_MAP[token]);
    }
  }

  if (matchedTokens.length > 0) {
    return matchedTokens.join(' / ');
  }

  // 2. 부분 일치 검색 (길이가 긴 직급부터 우선 매칭: 예: "선임연구원"이 "연구원"보다 먼저 매칭)
  const sortedKeys = Object.keys(TITLE_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (trimmed.includes(key)) {
      return TITLE_MAP[key];
    }
  }

  return '';
}

export default function BusinessCardGenerator({ initialName = "", initialDept = "" }: { initialName?: string, initialDept?: string }) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialName || '',
    nameEn: '',
    title: '',
    titleEn: '',
    deptEn: initialDept || '',
    phone: '02-3282-0700',
    mobile: '',
    fax: '02-3282-0889',
    email: '',
    location: 'suwon' as 'seoul' | 'suwon'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 발령지 변경 시 전화/팩스 기본값도 함께 세팅
    if (name === 'location') {
      const loc = value as 'seoul' | 'suwon';
      setFormData(prev => ({
        ...prev,
        location: loc,
        phone: LOCATIONS[loc].phone,
        fax: LOCATIONS[loc].fax
      }));
      return;
    }

    // 한글 직급 입력 시 영문 직급 자동 연동
    if (name === 'title') {
      const translated = autoTranslateTitle(value);
      setFormData(prev => ({
        ...prev,
        title: value,
        titleEn: translated || prev.titleEn
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 직급 빠른 선택 태그 클릭 핸들러
  const handleQuickTitle = (korTitle: string) => {
    const current = formData.title.trim();
    let newTitle = korTitle;
    if (current && !current.includes(korTitle)) {
      newTitle = `${current} / ${korTitle}`;
    }
    const translated = autoTranslateTitle(newTitle);
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      titleEn: translated || prev.titleEn
    }));
  };

  const downloadCard = async (ref: React.RefObject<HTMLDivElement | null>, side: 'front' | 'back') => {
    if (!ref.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `파워넷_명함_${formData.name || '미입력'}_${side}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* 왼쪽 입력 폼 (다크 테마 고대비 적용) */}
      <div 
        className="w-full xl:w-1/3 p-6 border shadow-sm"
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderColor: 'var(--color-border)', 
          borderRadius: 'var(--radius-md)' 
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="text-blue-500" size={22} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-title)' }}>명함 정보 입력</h2>
        </div>

        <div className="space-y-4">
          {/* 이름 / 영문이름 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>성함 (국문)</label>
              <input 
                type="text" 
                name="name" 
                placeholder="예: 홍길동"
                value={formData.name} 
                onChange={handleChange} 
                className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--color-bg)', 
                  borderColor: 'var(--color-border)', 
                  color: 'var(--color-text-title)' 
                }} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>영문 성함</label>
              <input 
                type="text" 
                name="nameEn" 
                placeholder="예: Gil Dong Hong"
                value={formData.nameEn} 
                onChange={handleChange} 
                className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--color-bg)', 
                  borderColor: 'var(--color-border)', 
                  color: 'var(--color-text-title)' 
                }} 
              />
            </div>
          </div>

          {/* 직급 (국문) & 빠른 선택 칩 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>직급/직책 (국문)</label>
              <span className="text-[11px] text-blue-400 flex items-center gap-1 font-medium">
                <Sparkles size={12} /> 입력 시 영문 자동 완성
              </span>
            </div>
            <input 
              type="text" 
              name="title" 
              placeholder="예: 과장 / 개발팀장"
              value={formData.title} 
              onChange={handleChange} 
              className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
              style={{ 
                backgroundColor: 'var(--color-bg)', 
                borderColor: 'var(--color-border)', 
                color: 'var(--color-text-title)' 
              }} 
            />

            {/* 직급 빠른 선택 버튼들 */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['대리', '과장', '차장', '부장', '팀장', '선임연구원', '책임연구원'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTitle(tag)}
                  className="text-[11px] px-2 py-0.5 rounded border transition-colors hover:border-blue-500"
                  style={{ 
                    backgroundColor: 'var(--color-bg)', 
                    borderColor: 'var(--color-border)', 
                    color: 'var(--color-text-muted)' 
                  }}
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* 영문 직급 & 영문 부서명 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>영문 직급 (자동 완성)</label>
              <input 
                type="text" 
                name="titleEn" 
                placeholder="Manager"
                value={formData.titleEn} 
                onChange={handleChange} 
                className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--color-bg)', 
                  borderColor: 'var(--color-border)', 
                  color: 'var(--color-text-title)' 
                }} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>영문 부서명</label>
              <input 
                type="text" 
                name="deptEn" 
                placeholder="R&D Team"
                value={formData.deptEn} 
                onChange={handleChange} 
                className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--color-bg)', 
                  borderColor: 'var(--color-border)', 
                  color: 'var(--color-text-title)' 
                }} 
              />
            </div>
          </div>

          {/* 모바일 & 전화번호 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>모바일 번호</label>
              <input 
                type="text" 
                name="mobile" 
                placeholder="010-0000-0000"
                value={formData.mobile} 
                onChange={handleChange} 
                className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--color-bg)', 
                  borderColor: 'var(--color-border)', 
                  color: 'var(--color-text-title)' 
                }} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>대표/내선 전화번호</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--color-bg)', 
                  borderColor: 'var(--color-border)', 
                  color: 'var(--color-text-title)' 
                }} 
              />
            </div>
          </div>

          {/* 이메일 & 팩스 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>사내 이메일</label>
              <input 
                type="email" 
                name="email" 
                placeholder="id@gopowernet.com"
                value={formData.email} 
                onChange={handleChange} 
                className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--color-bg)', 
                  borderColor: 'var(--color-border)', 
                  color: 'var(--color-text-title)' 
                }} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>팩스 번호</label>
              <input 
                type="text" 
                name="fax" 
                value={formData.fax} 
                onChange={handleChange} 
                className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--color-bg)', 
                  borderColor: 'var(--color-border)', 
                  color: 'var(--color-text-title)' 
                }} 
              />
            </div>
          </div>

          {/* 발령지 선택 */}
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>발령지 (근무지 사업장)</label>
            <select 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              className="w-full p-2.5 border rounded outline-none text-sm font-bold transition-colors cursor-pointer"
              style={{ 
                backgroundColor: 'var(--color-bg)', 
                borderColor: 'var(--color-border)', 
                color: '#60a5fa' 
              }}
            >
              <option value="suwon">수원1 (영통구 현대테라타워 A동 1403호)</option>
              <option value="seoul">서울1 (금천구 현대지식산업센터 B동 17층)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 오른쪽 명함 렌더링 뷰 */}
      <div 
        className="w-full xl:w-2/3 p-8 border flex flex-col items-center justify-center overflow-x-auto"
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderColor: 'var(--color-border)', 
          borderRadius: 'var(--radius-md)' 
        }}
      >
        <div className="mb-6 text-center">
          <p className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
            실시간 명함 미리보기
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => downloadCard(frontRef, 'front')} 
              disabled={isExporting} 
              className="bg-white text-gray-900 border border-gray-300 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Download size={16} /> 앞면 다운로드 (PNG)
            </button>
            <button 
              onClick={() => downloadCard(backRef, 'back')} 
              disabled={isExporting} 
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Download size={16} /> 뒷면 다운로드 (PNG)
            </button>
          </div>
        </div>

        {/* 렌더링 컨테이너 */}
        <div className="space-y-8 pb-4">
          {/* 앞면 카드 */}
          <div 
            ref={frontRef} 
            className="bg-white relative overflow-hidden shadow-2xl rounded-sm"
            style={{ width: '450px', height: '260px', fontFamily: '"Malgun Gothic", sans-serif' }}
          >
            {/* 얇은 테두리 */}
            <div className="absolute inset-0 border-[2px] border-[#ececec]"></div>
            
            <div className="p-8 h-full flex flex-col justify-between relative z-10">
              {/* 상단: 이름 및 로고 */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="mb-2 flex items-baseline">
                    <span className="text-2xl font-extrabold text-[#111827] mr-2 tracking-tight">
                      {formData.name || '성함'}
                    </span>
                    <span className="text-[13px] text-gray-500 font-normal">
                      {formData.nameEn || 'English Name'}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-[#1f2937] leading-tight mb-0.5">
                    {formData.title || '직급 / 직책'}
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    {formData.titleEn || 'Position / Title'}
                  </div>
                  {formData.deptEn && (
                    <div className="text-[10px] text-gray-500 leading-tight">
                      {formData.deptEn}
                    </div>
                  )}
                </div>

                {/* 파워넷 실제 이미지 로고 */}
                <div className="w-[110px] mt-1">
                  <img src="/logo.png" alt="POWER NET" className="w-full h-auto object-contain" />
                </div>
              </div>

              {/* 하단: 회사 주소 및 연락처 */}
              <div>
                <div className="mb-2.5">
                  <div className="text-[13px] font-extrabold text-[#083a81] mb-1">(주)파워넷</div>
                  <div className="text-[9.5px] text-gray-700 leading-tight tracking-tight">{LOCATIONS[formData.location].kr}</div>
                  <div className="text-[9px] text-gray-500 leading-tight tracking-tight mt-0.5">{LOCATIONS[formData.location].en}</div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-0.5 text-[9.5px] text-gray-700">
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">T</span> {formData.phone}</div>
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">M</span> {formData.mobile || '010-0000-0000'}</div>
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">F</span> {formData.fax}</div>
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">E</span> {formData.email || 'id@gopowernet.com'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 뒷면 카드 */}
          <div 
            ref={backRef} 
            className="relative overflow-hidden shadow-2xl rounded-sm"
            style={{ width: '450px', height: '260px', backgroundColor: '#083a81', fontFamily: '"Malgun Gothic", sans-serif' }}
          >
            {/* 배경 그래픽 라인 곡선 */}
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <svg viewBox="0 0 450 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-50,230 C150,230 150,-20 450,-20" stroke="white" strokeWidth="1" />
                <path d="M300,300 C300,150 400,10 500,10" stroke="white" strokeWidth="1" />
              </svg>
            </div>

            <div className="p-8 h-full flex flex-col justify-between relative z-10">
              {/* 상단 슬로건 라인 */}
              <div className="w-full border-t border-white/40 relative mt-4">
                <span className="absolute -top-3 left-6 px-3 bg-[#083a81] text-[11px] text-white tracking-wide font-medium">
                  함께하는 Green 전기에너지 연결기업
                </span>
              </div>

              {/* 중앙 올화이트 파워넷 로고 */}
              <div className="flex justify-center items-center flex-grow py-4">
                <div className="w-[150px]">
                  <img 
                    src="/logo.png" 
                    alt="POWER NET" 
                    className="w-full h-auto" 
                    style={{ filter: "brightness(0) invert(1)" }} 
                  />
                </div>
              </div>

              {/* 하단 우측 Team Powernet 라인 */}
              <div className="w-full flex justify-end items-center relative mb-3">
                <div className="w-full border-t border-white/40 absolute top-1/2 left-0 -z-10"></div>
                <span className="px-3 bg-[#083a81] text-[12px] italic text-white/95 pr-0 pl-4 font-light">
                  Team Powernet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
