import { useEffect, useRef } from 'react';

interface HeroParticlesProps {
  parallaxOffset: { x: number; y: number };
  particleCount?: number;
  blendOpacity?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
  color: string;
}

const DEFAULT_PARTICLE_COUNT = 52;
const COLORS = ['#FF8C42', '#FFB347', '#FF9F5A', '#E87830'];

export default function HeroParticles({
  parallaxOffset,
  particleCount = DEFAULT_PARTICLE_COUNT,
  blendOpacity = 0.6,
}: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const offsetRef = useRef({ x: 0, y: 0 });
  const parallaxOffsetRef = useRef(parallaxOffset);

  useEffect(() => {
    parallaxOffsetRef.current = parallaxOffset;
  }, [parallaxOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initParticles = (width: number, height: number) => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.25 - 0.08,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(window.innerWidth, window.innerHeight);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const startTime = Date.now();

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const time = (Date.now() - startTime) / 1000;

      offsetRef.current.x += (parallaxOffsetRef.current.x - offsetRef.current.x) * 0.08;
      offsetRef.current.y += (parallaxOffsetRef.current.y - offsetRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX + Math.sin(time + particle.pulse) * 0.08;
        particle.y += particle.speedY + Math.cos(time * 0.7 + particle.pulse) * 0.06;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        const drawX = particle.x + offsetRef.current.x;
        const drawY = particle.y + offsetRef.current.y;
        const alpha = particle.opacity * (0.6 + Math.sin(time * 1.5 + particle.pulse) * 0.4);

        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, particle.size * 4);
        gradient.addColorStop(0, `${particle.color}${Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, '0')}`);
        gradient.addColorStop(1, `${particle.color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-particles hero-gpu-layer pointer-events-none absolute inset-0 w-full h-full mix-blend-plus-lighter"
      style={{ opacity: blendOpacity }}
      aria-hidden="true"
    />
  );
}
