import React, { useEffect, useRef } from 'react';

export const DigitalSnow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;
    const particles: { x: number; y: number; radius: number; speed: number; opacity: number; color: string }[] = [];
    const particleCount = isMobile ? 30 : 150;
    const colors = ['#60A5FA', '#818CF8', '#A78BFA', '#34D399'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * (isMobile ? 1.5 : 2) + 0.5,
        speed: Math.random() * (isMobile ? 1 : 1.5) + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid lines for tech feel (skip on mobile for performance)
      if (!isMobile) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = (Date.now() * 0.01) % gridSize; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = (Date.now() * 0.01) % gridSize; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Removed constellation lines to remove polygonal background

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        
        // Add glow (skip on mobile for performance)
        if (!isMobile) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
        }

        p.y += p.speed;
        
        // Slight horizontal drift
        p.x += Math.sin(p.y * 0.02) * 0.8;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
      });
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-100"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
