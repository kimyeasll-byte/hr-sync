import { redirect } from 'next/navigation';

export default function Home() {
  // 과제 확인 및 평가를 위해 로그인 없이 대시보드로 즉시 다이렉트 접속
  redirect('/dashboard');
}
