'use client';

import { useEffect, useRef } from 'react';

export default function AntigravityCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 마우스 위치 (부드러운 추적을 위한 lerp)
    let targetMouse = { x: -1000, y: -1000 };
    let mouse = { x: -1000, y: -1000 };
    let isMoving = false;
    let idleTimeout: NodeJS.Timeout;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      isMoving = true;
      clearTimeout(idleTimeout);
      // 마우스가 멈춘 후 2.5초 뒤 렌더링 절전 모드
      idleTimeout = setTimeout(() => {
        isMoving = false;
      }, 2500);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 격자 간격 (약 26px 간격으로 촘촘한 벡터 필드 형성)
    const SPACING = 26;
    const INFLUENCE_RADIUS = 420; // 마우스 주변 대형 원형 파동 반경

    const render = () => {
      // 부드러운 마우스 감속 추적
      mouse.x += (targetMouse.x - mouse.x) * 0.12;
      mouse.y += (targetMouse.y - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // 마우스가 화면 안에 있을 때 대형 파티클 필드 렌더링
      if (mouse.x > -500) {
        const startX = Math.max(0, Math.floor((mouse.x - INFLUENCE_RADIUS) / SPACING) * SPACING);
        const endX = Math.min(width, Math.ceil((mouse.x + INFLUENCE_RADIUS) / SPACING) * SPACING);
        const startY = Math.max(0, Math.floor((mouse.y - INFLUENCE_RADIUS) / SPACING) * SPACING);
        const endY = Math.min(height, Math.ceil((mouse.y + INFLUENCE_RADIUS) / SPACING) * SPACING);

        for (let gx = startX; gx <= endX; gx += SPACING) {
          for (let gy = startY; gy <= endY; gy += SPACING) {
            const dx = gx - mouse.x;
            const dy = gy - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < INFLUENCE_RADIUS && dist > 15) {
              const factor = 1 - dist / INFLUENCE_RADIUS; // 0 ~ 1
              const theta = Math.atan2(dy, dx);

              // 안티그래비티 특유의 360도 스펙트럼 색상 매핑
              // (상단 핑크/레드, 우측 블루, 하단좌측 옐로우/오렌지)
              const hue = (-(theta * 180 / Math.PI) + 215 + 360) % 360;

              // 동심원 접선 방향 회전각 (concentric ripples) + 약간의 방사 각도
              const angle = theta + Math.PI / 2;

              // 중심부로 갈수록 커지고 밝아지는 대시 캡슐
              const len = 3 + factor * 7;
              const thickness = 1.5 + factor * 1.5;
              const alpha = Math.pow(factor, 1.15) * 0.9;

              // 마우스 위치 기준 약간의 탄성 밀림 효과
              const push = factor * 10;
              const px = gx + Math.cos(theta) * push;
              const py = gy + Math.sin(theta) * push;

              ctx.save();
              ctx.translate(px, py);
              ctx.rotate(angle);

              ctx.beginPath();
              ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${alpha})`;
              ctx.lineWidth = thickness;
              ctx.lineCap = 'round';
              ctx.moveTo(-len / 2, 0);
              ctx.lineTo(len / 2, 0);
              ctx.stroke();

              ctx.restore();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
