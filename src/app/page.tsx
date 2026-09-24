import { redirect } from 'next/navigation';

export default function Home() {
  // 초기 접속 시 로그인 페이지로 즉시 보냄
  redirect('/login');
}
