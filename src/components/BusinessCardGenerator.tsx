'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, FileText, Sparkles, AtSign } from 'lucide-react';

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

// 파워넷 공식 직급 영문 맵
const RANK_MAP: Record<string, string> = {
  // [사업부 직급]
  '사원': 'Staff',
  '주임': 'Senior Staff',
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
  '수석연구원': 'Lead Research Engineer'
};

// 파워넷 직책 영문 맵
const ROLE_MAP: Record<string, string> = {
  '팀원': 'Team Member',
  '파트장': 'Part Leader',
  '팀장': 'Team Leader',
  '사업부장': 'Head of Business Division',
  '연구소장': 'Head of R&D Center',
  '그룹장': 'Group Leader'
};

export default function BusinessCardGenerator({ initialName = "", initialDept = "" }: { initialName?: string, initialDept?: string }) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialName || '',
    nameEn: '',
    rank: '',           // 직급 (예: 대리, 과장, 선임연구원 등)
    role: initialDept || '', // 직책 또는 소속팀 (예: 경영지원팀, C프로젝트 팀장 등)
    rankEn: '',         // 영문 직급 (자동 완성)
    roleEn: '',         // 영문 직책/부서
    phone: '02-3282-0700',
    mobile: '',
    fax: '02-3282-0889',
    emailId: '',        // 아이디만 입력 (yskim)
    location: 'suwon' as 'seoul' | 'suwon'
  });

  // 직급 변경 시 영문 직급 자동 연동
  const handleRankChange = (rankValue: string) => {
    const en = RANK_MAP[rankValue] || '';
    setFormData(prev => ({
      ...prev,
      rank: rankValue,
      rankEn: en || prev.rankEn
    }));
  };

  // 직책/소속팀 변경 시 자동 영문 연동
  const handleRoleChange = (roleValue: string) => {
    let matchedEn = '';
    for (const [k, v] of Object.entries(ROLE_MAP)) {
      if (roleValue.includes(k)) {
        matchedEn = v;
        break;
      }
    }
    setFormData(prev => ({
      ...prev,
      role: roleValue,
      roleEn: matchedEn || prev.roleEn
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
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

    if (name === 'emailId') {
      // @gopowernet.com 포함 입력 시 아이디만 추출
      const cleaned = value.replace('@gopowernet.com', '').trim();
      setFormData(prev => ({ ...prev, emailId: cleaned }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fullEmail = formData.emailId 
    ? (formData.emailId.includes('@') ? formData.emailId : `${formData.emailId}@gopowernet.com`) 
    : '';

  const downloadCard = async (ref: React.RefObject<HTMLDivElement | null>, side: 'front' | 'back') => {
    if (!ref.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `파워넷_명함_${formData.name || '직원'}_${side}.png`;
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
      {/* 왼쪽 입력 폼 */}
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

          {/* 1. 직급 (슬래시 없이 독립된 선택창) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>직급 (Rank)</label>
              <span className="text-[11px] text-blue-400 flex items-center gap-1 font-medium">
                <Sparkles size={12} /> 선택 시 영문 직급 자동 연동
              </span>
            </div>
            <select
              value={formData.rank}
              onChange={(e) => handleRankChange(e.target.value)}
              className="w-full p-2.5 border rounded outline-none text-sm font-semibold transition-colors cursor-pointer"
              style={{ 
                backgroundColor: 'var(--color-bg)', 
                borderColor: 'var(--color-border)', 
                color: 'var(--color-text-title)' 
              }}
            >
              <option value="">-- 직급 선택 --</option>
              <optgroup label="[사업부 직급]">
                <option value="사원">사원 (Staff)</option>
                <option value="주임">주임 (Senior Staff)</option>
                <option value="대리">대리 (Assistant Manager)</option>
                <option value="과장">과장 (Manager)</option>
                <option value="차장">차장 (Senior Manager)</option>
                <option value="부장">부장 (General Manager)</option>
                <option value="담당">담당 (Director)</option>
                <option value="이사">이사 (Managing Director)</option>
                <option value="상무">상무 (Senior Managing Director)</option>
                <option value="전무">전무 (Senior Managing Director)</option>
                <option value="전무이사">전무이사 (Senior Managing Director)</option>
                <option value="부사장">부사장 (Executive Vice President)</option>
                <option value="대표이사">대표이사 (CEO & President)</option>
              </optgroup>
              <optgroup label="[연구소 직급]">
                <option value="연구원">연구원 (Research Engineer)</option>
                <option value="주임연구원">주임연구원 (Associate Research Engineer)</option>
                <option value="선임연구원">선임연구원 (Senior Research Engineer)</option>
                <option value="책임연구원">책임연구원 (Principal Research Engineer)</option>
                <option value="수석연구원">수석연구원 (Lead Research Engineer)</option>
              </optgroup>
            </select>
          </div>

          {/* 2. 직책 / 소속팀 (슬래시 없이 독립된 칸) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>직책 / 소속팀</label>
              <span className="text-[11px] text-gray-400">예: 경영지원팀, C프로젝트 팀장</span>
            </div>
            <input 
              type="text" 
              name="role" 
              placeholder="예: 경영지원팀 또는 개발팀장"
              value={formData.role} 
              onChange={(e) => handleRoleChange(e.target.value)} 
              className="w-full p-2.5 border rounded outline-none text-sm font-medium transition-colors" 
              style={{ 
                backgroundColor: 'var(--color-bg)', 
                borderColor: 'var(--color-border)', 
                color: 'var(--color-text-title)' 
              }} 
            />

            {/* 직책 빠른 태그 */}
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {['팀원', '파트장', '팀장', '사업부장', '연구소장', '그룹장'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleRoleChange(tag)}
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
                name="rankEn" 
                placeholder="Senior Staff"
                value={formData.rankEn} 
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
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>영문 부서/직책</label>
              <input 
                type="text" 
                name="roleEn" 
                placeholder="Management Team"
                value={formData.roleEn} 
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

          {/* 이메일 (아이디만 입력하면 @gopowernet.com 자동 결합) */}
          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>사내 이메일 (아이디만 입력)</label>
            <div 
              className="flex items-center rounded border overflow-hidden transition-colors"
              style={{ 
                borderColor: 'var(--color-border)', 
                backgroundColor: 'var(--color-bg)' 
              }}
            >
              <input 
                type="text" 
                name="emailId" 
                placeholder="yskim"
                value={formData.emailId} 
                onChange={handleChange} 
                className="w-full p-2.5 outline-none text-sm font-medium bg-transparent" 
                style={{ color: 'var(--color-text-title)' }} 
              />
              <span 
                className="px-3 text-xs font-bold select-none py-3 border-l"
                style={{ 
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#60a5fa'
                }}
              >
                @gopowernet.com
              </span>
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

          {/* 팩스번호 & 발령지 */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>발령지 (근무지)</label>
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
                <option value="suwon">수원1 (영통 현대테라타워)</option>
                <option value="seoul">서울1 (금천 현대지식산업센터)</option>
              </select>
            </div>
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
                  {/* 국문 직급 / 소속팀 조합 */}
                  <div className="text-[11px] font-bold text-[#1f2937] leading-tight mb-0.5">
                    {formData.rank && formData.role 
                      ? `${formData.rank} / ${formData.role}` 
                      : (formData.rank || formData.role || '직급 / 부서')}
                  </div>
                  {/* 영문 직급 */}
                  <div className="text-[10px] text-gray-500 leading-tight">
                    {formData.rankEn || 'Position'}
                  </div>
                  {/* 영문 직책/부서 */}
                  {formData.roleEn && (
                    <div className="text-[10px] text-gray-500 leading-tight">
                      {formData.roleEn}
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
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">E</span> {fullEmail || 'id@gopowernet.com'}</div>
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
