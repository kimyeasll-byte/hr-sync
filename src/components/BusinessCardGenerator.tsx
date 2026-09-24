'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Building2, User, Phone, Mail, FileText, Printer } from 'lucide-react';

const LOCATIONS = {
  seoul: {
    kr: '서울시 금천구 두산로 70, B동 17층(현대지식산업센터)',
    en: 'B-17F, Du-san-ro, Guncheongu, Seoul'
  },
  suwon: {
    kr: '경기 수원시 영통구 신원로250번길 13, 현대테라타워영통 A동 1403호',
    en: '1403, A dong, 13, Sinwon-ro, 250beon-gil, Yeongtong-gu, Suwon-si, Gyeonggi-do'
  }
};

export default function BusinessCardGenerator() {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [formData, setFormData] = useState({
    name: '임성호',
    nameEn: 'Sung Ho Lim',
    title: '전무이사 / C프로젝트 팀장',
    titleEn: 'Senior Managing Director',
    deptEn: 'C Project Team',
    phone: '02-3282-0700',
    mobile: '010-9626-6106',
    fax: '02-3282-0889',
    email: 'lsh0581@gopowernet.com',
    location: 'suwon' as 'seoul' | 'suwon'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const downloadCard = async (ref: React.RefObject<HTMLDivElement | null>, side: 'front' | 'back') => {
    if (!ref.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(ref.current, { quality: 1, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `파워넷_명함_${formData.name}_${side}.png`;
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
      <div className="w-full xl:w-1/3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-gray-900">명함 정보 입력</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">성함</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">영문성함</label>
              <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">직급/위치 (국문)</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">영문직급</label>
              <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">영문 부서명</label>
              <input type="text" name="deptEn" value={formData.deptEn} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">모바일번호</label>
              <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">전화번호(내선)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">이메일</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">팩스번호</label>
              <input type="text" name="fax" value={formData.fax} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">발령지 (근무지 주소)</label>
            <select name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 outline-none focus:border-blue-500 text-sm font-bold text-blue-700">
              <option value="seoul">서울1 (금천구 현대지식산업센터)</option>
              <option value="suwon">수원1 (영통구 현대테라타워)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 오른쪽 명함 렌더링 뷰 */}
      <div className="w-full xl:w-2/3 bg-gray-100 p-8 rounded-xl border border-gray-200 flex flex-col items-center justify-center overflow-x-auto">
        <div className="mb-4 text-center">
          <p className="text-gray-500 text-sm font-bold mb-2">실시간 명함 미리보기</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => downloadCard(frontRef, 'front')} disabled={isExporting} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm">
              <Download size={16} /> 앞면 다운로드
            </button>
            <button onClick={() => downloadCard(backRef, 'back')} disabled={isExporting} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm">
              <Download size={16} /> 뒷면 다운로드
            </button>
          </div>
        </div>

        {/* 렌더링 컨테이너 (실제 스케일) */}
        <div className="space-y-8 pb-8">
          {/* 앞면 */}
          <div 
            ref={frontRef} 
            className="bg-white relative overflow-hidden shadow-xl"
            style={{ width: '450px', height: '260px', fontFamily: '"Malgun Gothic", sans-serif' }}
          >
            {/* 얇은 회색 테두리 (명함 재단선 느낌) */}
            <div className="absolute inset-0 border-[3px] border-[#f0f0f0]"></div>
            
            <div className="p-10 h-full flex flex-col justify-between relative z-10">
              {/* 상단: 이름 및 로고 */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="mb-2">
                    <span className="text-2xl font-extrabold text-[#1a1a1a] mr-2">{formData.name}</span>
                    <span className="text-[13px] text-gray-600">{formData.nameEn}</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#1a1a1a] leading-tight mb-1">{formData.title}</div>
                  <div className="text-[11px] text-gray-500 leading-tight">{formData.titleEn}</div>
                  <div className="text-[11px] text-gray-500 leading-tight">{formData.deptEn}</div>
                </div>
                {/* 로고 */}
                <div className="text-2xl mt-1 tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <span className="font-black italic text-[#083a81]">POWER</span>
                  <span className="font-black italic text-[#f15a24]">NET</span>
                </div>
              </div>

              {/* 하단: 회사 주소 및 연락처 */}
              <div>
                <div className="mb-3">
                  <div className="text-[13px] font-extrabold text-[#083a81] mb-1">(주)파워넷</div>
                  <div className="text-[10px] text-gray-700 leading-relaxed tracking-tight">{LOCATIONS[formData.location].kr}</div>
                  <div className="text-[10px] text-gray-500 leading-relaxed tracking-tight">{LOCATIONS[formData.location].en}</div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-[10px] text-gray-700">
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">T</span> {formData.phone}</div>
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">M</span> {formData.mobile}</div>
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">F</span> {formData.fax}</div>
                  <div className="flex items-center gap-1.5"><span className="font-extrabold text-[#083a81]">E</span> {formData.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 뒷면 */}
          <div 
            ref={backRef} 
            className="relative overflow-hidden shadow-xl"
            style={{ width: '450px', height: '260px', backgroundColor: '#083a81', fontFamily: '"Malgun Gothic", sans-serif' }}
          >
            {/* 배경 그래픽 라인 (CSS로 흉내내기) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg viewBox="0 0 450 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-50,230 C150,230 150,-20 450,-20" stroke="white" strokeWidth="1" />
                <path d="M300,300 C300,150 400,10 500,10" stroke="white" strokeWidth="1" />
              </svg>
            </div>

            <div className="p-10 h-full flex flex-col justify-between relative z-10">
              {/* 상단 슬로건 라인 */}
              <div className="w-full border-t border-white/40 relative mt-4">
                <span className="absolute -top-3 left-8 px-3 bg-[#083a81] text-[11px] text-white tracking-wide">
                  함께하는 Green 전기에너지 연결기업
                </span>
              </div>

              {/* 중앙 로고 */}
              <div className="flex justify-center items-center flex-grow">
                <div className="text-4xl tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <span className="font-black italic text-white">POWER</span>
                  <span className="font-black italic text-[#f15a24]">NET</span>
                </div>
              </div>

              {/* 하단 우측 Team Powernet 라인 */}
              <div className="w-full flex justify-end items-center relative mb-4">
                <div className="w-full border-t border-white/40 absolute top-1/2 left-0 -z-10"></div>
                <span className="px-3 bg-[#083a81] text-[12px] italic text-white/90 pr-0 pl-4">
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
