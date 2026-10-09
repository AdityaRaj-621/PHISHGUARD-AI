import React, { useEffect, useRef, useState } from 'react';
import './TubesBackground.css';

// Palette presets
const PALETTES = [
  { tubes: ['#1D4ED8', '#38BDF8', '#818CF8'], lights: ['#60A5FA', '#3B82F6', '#93C5FD', '#1E40AF'] },
  { tubes: ['#047857', '#10B981', '#34D399'], lights: ['#6EE7B7', '#059669', '#A7F3D0', '#065F46'] },
  { tubes: ['#F967FB', '#53BC28', '#6958D5'], lights: ['#83F36E', '#FE8A2E', '#FF008A', '#60AED5'] },
  { tubes: ['#6366F1', '#EC4899', '#8B5CF6'], lights: ['#F472B6', '#A78BFA', '#C084FC', '#4F46E5'] },
  { tubes: ['#0284C7', '#06B6D4', '#3B82F6'], lights: ['#38BDF8', '#22D3EE', '#60A5FA', '#0369A1'] }
];

const randomColors = (count) => {
  return new Array(count)
    .fill(0)
    .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

export default function TubesBackground({
  children,
  className = '',
  enableClickInteraction = true,
  overlayOpacity = 0.4
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const tubesRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let cleanup = null;
    let animId = null;

    const initEffect = async () => {
      if (!canvasRef.current) return;

      try {
        // Try importing from CDN first
        // @ts-ignore
        const module = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted || !canvasRef.current) return;

        const initialPalette = PALETTES[0];
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: initialPalette.tubes,
            lights: {
              intensity: 220,
              colors: initialPalette.lights
            }
          }
        });

        tubesRef.current = app;
        setIsReady(true);

        const handleResize = () => {
          // threejs-components automatically binds resize if canvas is styled full
        };
        window.addEventListener('resize', handleResize);

        cleanup = () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.warn('TubesCursor CDN import failed or offline, loading custom WebGL neon fallback:', err);
        // Fallback: Elegant lightweight particle / neon wave canvas
        if (!mounted || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

        let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
        const points = Array.from({ length: 18 }, (_, i) => ({
          x: (width / 18) * i,
          y: height / 2,
          vx: 0,
          vy: 0,
          baseY: height / 2 + Math.sin(i * 0.5) * 40,
          color: ['#1D4ED8', '#38BDF8', '#6366F1', '#06B6D4'][i % 4]
        }));

        const handleMouseMove = (e) => {
          const rect = canvas.getBoundingClientRect();
          mouse.targetX = e.clientX - rect.left;
          mouse.targetY = e.clientY - rect.top;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const render = () => {
          if (!mounted) return;
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;

          ctx.fillStyle = '#0F172A';
          ctx.fillRect(0, 0, width, height);

          // Draw glowing neon curves
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';

          for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = Math.max(0, 180 - dist) / 180;

            p.y += (p.baseY - p.y) * 0.05 + dy * force * 0.04;
          }

          for (let layer = 0; layer < 3; layer++) {
            ctx.beginPath();
            ctx.strokeStyle = layer === 0 ? 'rgba(29, 78, 216, 0.4)' : layer === 1 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(99, 102, 241, 0.5)';
            ctx.lineWidth = 3 + layer * 2;
            ctx.moveTo(0, height / 2);
            for (let i = 0; i < points.length - 1; i++) {
              const xc = (points[i].x + points[i + 1].x) / 2;
              const yc = (points[i].y + points[i + 1].y) / 2 + (layer - 1) * 20;
              ctx.quadraticCurveTo(points[i].x, points[i].y + (layer - 1) * 20, xc, yc);
            }
            ctx.stroke();
          }

          animId = requestAnimationFrame(render);
        };

        render();
        setIsReady(true);

        const onResize = () => {
          if (!canvas.parentElement) return;
          width = canvas.width = canvas.parentElement.clientWidth;
          height = canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener('resize', onResize);

        cleanup = () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', onResize);
          if (animId) cancelAnimationFrame(animId);
        };
      }
    };

    initEffect();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;

    try {
      const colors = randomColors(3);
      const lightsColors = randomColors(4);
      tubesRef.current.tubes?.setColors(colors);
      tubesRef.current.tubes?.setLightsColors(lightsColors);
    } catch (e) {
      console.warn('Color randomization failed:', e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`tubes-container ${className}`}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="tubes-canvas"
        style={{ touchAction: 'none' }}
      />
      <div
        className="tubes-overlay"
        style={{ backgroundColor: `rgba(15, 23, 42, ${overlayOpacity})` }}
      />
      <div className="tubes-content">
        {children}
      </div>
    </div>
  );
}
