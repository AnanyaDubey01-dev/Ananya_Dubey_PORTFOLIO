import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import HeroBackground from './HeroBackground';

const roles = ['Software Engineer', 'AI Developer', 'Full-Stack', 'IoT Engineer'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);

    return () => clearInterval(roleInterval);
  }, []);

  useEffect(() => {
    if (hasAnimated.current || !nameRef.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        nameRef.current,
        { y: 40 },
        {
          y: 0,
          duration: 1.2,
          delay: 0.1,
          ease: 'power3.out',
        }
      )
        .fromTo(
          '.blur-in',
          { opacity: 0, filter: 'blur(10px)', y: 20 },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 1,
            stagger: 0.1,
            immediateRender: false,
          },
          '-=0.8'
        )
        .to(
          '.scroll-indicator',
          {
            opacity: 1,
            duration: 0.8,
          },
          '-=0.3'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background - WebGL Liquid Reveal Effect */}
      <div className="absolute inset-0 z-0">
        {/* Base dark color fallback */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        {/* WebGL Hero Background with blur reveal */}
        <HeroBackground videoSrc="/hero-bg.mp4" />
        {/* Subtle animated gradient overlay for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#89AACC]/5 rounded-full blur-[150px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4E85BF]/5 rounded-full blur-[150px] animate-pulse delay-1000 pointer-events-none" />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 z-[1] pointer-events-none" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent z-[2] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 sm:px-6 py-24 text-center">
        {/* Eyebrow */}
        {/* <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-6 sm:mb-8">
          COLLECTION '26
        </p> */}

        {/* Name — centered over video */}
        <h1
          ref={nameRef}
          className="hero-name relative z-20 translate-y-14 sm:translate-y-20 md:translate-y-24 font-display italic text-[clamp(3rem,10vw,8.5rem)] leading-[0.88] tracking-[-0.02em] text-white whitespace-nowrap mb-6 sm:mb-8 [text-shadow:0_2px_20px_rgba(0,0,0,0.8),0_0_60px_rgba(137,170,204,0.25)]"
        >
          Ananya Dubey
        </h1>

        {/* Role Line */}
        <p className="blur-in text-lg md:text-xl text-muted mb-4">
          A{' '}
          <span
            key={roleIndex}
            className="font-display italic text-text-primary animate-role-fade-in inline-block"
          >
            {roles[roleIndex]}
          </span>{' '}
          lives in India.
        </p>

        {/* Description */}
        <p className="blur-in text-sm md:text-base text-muted max-w-md mx-auto mb-12">
          Building intelligent systems at the intersection of software and the real world —
          from AI-powered applications to embedded IoT ecosystems.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in inline-flex flex-wrap justify-center gap-4">
          {/* See Works Button */}
          <a
            href="#work"
            className="group relative rounded-full text-sm px-7 py-3.5 bg-text-primary text-bg hover:bg-bg hover:text-text-primary transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="relative">See Works</span>
          </a>

          {/* Journal Button */}
          <a
            href="#journal"
            className="group relative rounded-full text-sm px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary hover:border-transparent transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="relative">Journal</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator opacity-0 absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-xs text-muted uppercase tracking-[0.2em]">Scroll</span>
        <div className="relative w-px h-10 bg-stroke overflow-hidden">
          <div className="absolute inset-x-0 h-4 bg-text-primary/50 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
