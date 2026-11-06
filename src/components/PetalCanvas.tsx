import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rot: number;
  rotSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  opacity: number;
}

interface PetalCanvasProps {
  intensity?: 'normal' | 'burst';
  className?: string;
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({
  intensity = 'normal',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      '#f43f5e', // Rose red
      '#fb7185', // Soft rose pink
      '#fda4af', // Pale blush
      '#fecdd3', // Pastel blossom
      '#f59e0b', // Gold dust
      '#fbbf24', // Champagne light
      '#a855f7', // Lavender mist
    ];

    const count = intensity === 'burst' ? 55 : 28;

    const createPetal = (startY?: number): Petal => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        size: Math.random() * 10 + 8,
        speedX: Math.random() * 1.5 - 0.5 + 0.3,
        speedY: Math.random() * 1.2 + 0.6,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.04 + 0.01,
        color,
        opacity: Math.random() * 0.5 + 0.4,
      };
    };

    petalsRef.current = Array.from({ length: count }, () => createPetal());

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < petalsRef.current.length; i++) {
          const p = petalsRef.current[i];
          p.x += p.speedX;
          p.y += p.speedY;
          p.rot += p.rotSpeed;
          p.flip += p.flipSpeed;

          // Wrap around edges
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) {
            p.x = -20;
          } else if (p.x < -20) {
            p.x = width + 20;
          }

          // Draw petal with curved bezier path
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(Math.cos(p.flip), 1);
          ctx.globalAlpha = p.opacity;

          ctx.fillStyle = p.color;
          ctx.beginPath();
          // Petal oval curve
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(p.size * 0.6, -p.size * 0.8, 0, -p.size * 1.6);
          ctx.quadraticCurveTo(-p.size * 0.6, -p.size * 0.8, 0, 0);
          ctx.fill();

          // Subtle center rib
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -2);
          ctx.lineTo(0, -p.size * 1.2);
          ctx.stroke();

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-5 ${className}`}
      aria-hidden="true"
    />
  );
};
