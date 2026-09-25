// Korean Romanization utility for corporate email generation
// (주)파워넷 표준 이메일 규칙: [이름].[성]@gopowernet.com 또는 [이니셜][성]@gopowernet.com

const CHO_SUNG = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's',
  'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'
];

const JUNG_SUNG = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa',
  'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'
];

const JONG_SUNG = [
  '', 'k', 'k', 'ks', 'n', 'nj', 'nh', 'd', 'l', 'lg',
  'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's',
  'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h'
];

// 흔히 쓰이는 성씨 영문 표기 우선 매핑
const SURNAME_MAP: Record<string, string> = {
  '김': 'kim',
  '이': 'lee',
  '박': 'park',
  '최': 'choi',
  '정': 'jung',
  '강': 'kang',
  '조': 'cho',
  '윤': 'yoon',
  '장': 'jang',
  '임': 'im',
  '한': 'han',
  '오': 'oh',
  '서': 'seo',
  '신': 'shin',
  '권': 'kwon',
  '황': 'hwang',
  '안': 'ahn',
  '송': 'song',
  '류': 'ryu',
  '유': 'yoo',
  '홍': 'hong',
  '고': 'ko',
  '문': 'moon',
  '양': 'yang',
  '손': 'son',
  '배': 'bae',
  '백': 'baek',
  '허': 'heo',
  '노': 'noh',
  '남': 'nam',
  '심': 'shim',
  '하': 'ha',
  '곽': 'kwak',
  '성': 'sung',
  '차': 'cha',
  '주': 'joo',
  '우': 'woo',
  '구': 'koo',
  '전': 'jeon',
  '민': 'min'
};

export function romanizeHangulChar(char: string): string {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return char.toLowerCase();

  const cho = Math.floor(code / (21 * 28));
  const jung = Math.floor((code % (21 * 28)) / 28);
  const jong = code % 28;

  return (CHO_SUNG[cho] || '') + (JUNG_SUNG[jung] || '') + (JONG_SUNG[jong] || '');
}

export function generateCorporateEmail(koreanName: string): { email: string; localPart: string } {
  const cleanName = koreanName.trim().replace(/\s+/g, '');
  if (!cleanName) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return { email: `user${rand}@gopowernet.com`, localPart: `user${rand}` };
  }

  // 성 + 이름 분리 (일반적으로 3글자인 경우 1글자 성 + 2글자 이름)
  let surname = cleanName.slice(0, 1);
  let givenName = cleanName.slice(1);

  // 4글자 성씨(남궁, 황보 등) 처리
  if (cleanName.startsWith('남궁') || cleanName.startsWith('황보') || cleanName.startsWith('선우') || cleanName.startsWith('제갈')) {
    surname = cleanName.slice(0, 2);
    givenName = cleanName.slice(2);
  }

  const surnameRoman = SURNAME_MAP[surname] || Array.from(surname).map(romanizeHangulChar).join('');
  const givenRoman = Array.from(givenName).map(romanizeHangulChar).join('');

  // 예: 김예슬 -> yskim 또는 yeseul.kim
  // 파워넷 표준: [이름로마자].[성로마자]@gopowernet.com
  const localPart = givenRoman ? `${givenRoman}.${surnameRoman}` : `${surnameRoman}`;
  const cleanLocal = localPart.toLowerCase().replace(/[^a-z0-9.]/g, '');

  return {
    email: `${cleanLocal}@gopowernet.com`,
    localPart: cleanLocal
  };
}
