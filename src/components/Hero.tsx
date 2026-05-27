import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import HeroParticles from './HeroParticles';
import HeroVideoControls from './HeroVideoControls';

const roles = ['Software Engineer', 'AI Developer', 'Full-Stack', 'IoT Engineer'];
const VIDEO_SRC = '/new_hero-bg.mp4';

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textParallaxRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (!node) return;

    node.disablePictureInPicture = true;
    node.volume = 1;

    node.addEventListener('enterpictureinpicture', () => {
      if (document.pictureInPictureElement === node) {
        void document.exitPictureInPicture();
      }
    });

    const startPlayback = async () => {
      node.muted = true;
      setIsMuted(true);
      try {
        await node.play();
      } catch {
        // Autoplay blocked until user interaction
      }
    };

    if (node.readyState >= 2) {
      void startPlayback();
    } else {
      node.addEventListener('loadeddata', () => void startPlayback(), { once: true });
    }
  }, []);

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);

    return () => clearInterval(roleInterval);
  }, []);

  useEffect(() => {
    const updateViewportMode = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewportMode();
    window.addEventListener('resize', updateViewportMode);
    return () => window.removeEventListener('resize', updateViewportMode);
  }, []);

  useEffect(() => {
    const heroSection = sectionRef.current;
    if (!heroSection) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = heroSection.getBoundingClientRect();
      const x = event.clientX;
      const y = event.clientY;

      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        return;
      }

      const normalizedX = (x - rect.left) / rect.width;
      const normalizedY = (y - rect.top) / rect.height;
      const offsetX = (normalizedX - 0.5) * 2;
      const offsetY = (normalizedY - 0.5) * 2;
      const particleFactorX = isMobile ? 10 : 22;
      const particleFactorY = isMobile ? 8 : 18;
      const textFactorX = isMobile ? 8 : 16;
      const textFactorY = isMobile ? 6 : 12;

      setParallaxOffset({
        x: -offsetX * particleFactorX,
        y: -offsetY * particleFactorY,
      });

      if (textParallaxRef.current) {
        gsap.to(textParallaxRef.current, {
          x: offsetX * textFactorX,
          y: offsetY * textFactorY,
          duration: 0.9,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  useEffect(() => {
    if (hasAnimated.current || !nameRef.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        nameRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.1, ease: 'expo.out' }
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
          '-=0.7'
        )
        .fromTo(
          '.hero-particles',
          { opacity: 0 },
          { opacity: isMobile ? 0.35 : 0.6, duration: 1.2, ease: 'power2.out' },
          '-=0.8'
        )
        .fromTo(
          '.hero-controls',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .to('.scroll-indicator', { opacity: 1, duration: 0.8 }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  const handleToggleMute = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;

    if (nextMuted) {
      video.muted = true;
      setIsMuted(true);
      return;
    }

    video.muted = false;
    video.volume = 1;

    try {
      await video.play();
      setIsMuted(false);
    } catch {
      video.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  return (
    <div className="hero-sticky-wrapper">
      <section ref={sectionRef} id="hero" className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={attachVideo}
          src={VIDEO_SRC}
          className="hero-main-video"
          muted={isMuted}
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        />

        <div className="hero-video-scrim pointer-events-none absolute inset-0 z-[1]" />
        <div className="hero-gradient-vignette pointer-events-none absolute inset-0 z-[1]" />
        <div className="hero-gradient-warm pointer-events-none absolute inset-0 z-[1]" />
        <div className="hero-gradient-top pointer-events-none absolute inset-x-0 top-0 h-40 z-[1]" />
        <div className="hero-gradient-bottom pointer-events-none absolute inset-x-0 bottom-0 h-56 z-[1]" />
        <div className="hero-film-grain pointer-events-none absolute inset-0 z-[1]" />

        <HeroParticles
          parallaxOffset={parallaxOffset}
          particleCount={isMobile ? 28 : 52}
          blendOpacity={isMobile ? 0.35 : 0.6}
        />

        <div
          ref={textParallaxRef}
          className="hero-content-left hero-gpu-layer absolute z-10 flex flex-col items-start text-left px-4 sm:px-6"
        >
          <h1
            ref={nameRef}
            className="hero-name hero-name-stack font-display italic text-[clamp(2.4rem,12vw,7.5rem)] leading-[0.85] tracking-[-0.03em] text-white mb-4 sm:mb-6"
          >
            <span className="hero-name-line block">Ananya</span>
            <span className="hero-name-line block">Dubey</span>
          </h1>

          <p className="blur-in text-base md:text-xl text-muted mb-3 sm:mb-4 max-w-md">
            A{' '}
            <span
              key={roleIndex}
              className="font-display italic text-text-primary animate-role-fade-in inline-block"
            >
              {roles[roleIndex]}
            </span>{' '}
            lives in India.
          </p>

          <p className="blur-in text-sm md:text-base text-muted max-w-md mb-8 sm:mb-10">
            Building intelligent systems at the intersection of software and the real world —
            from AI-powered applications to embedded IoT ecosystems.
          </p>

          <div className="blur-in inline-flex flex-wrap justify-start gap-3 sm:gap-4">
            <a
              href="#work"
              className="group relative rounded-full text-sm px-5 sm:px-7 py-3 sm:py-3.5 bg-text-primary text-bg hover:bg-bg hover:text-text-primary transition-all duration-300 hover:scale-105"
            >
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <span className="relative">See Works</span>
            </a>

            <a
              href="#journal"
              className="group relative rounded-full text-sm px-5 sm:px-7 py-3 sm:py-3.5 border-2 border-stroke bg-bg/80 text-text-primary hover:border-transparent transition-all duration-300 hover:scale-105"
            >
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <span className="relative">Journal</span>
            </a>
          </div>
        </div>

        <HeroVideoControls isMuted={isMuted} onToggleMute={handleToggleMute} />

        <div className="scroll-indicator opacity-0 absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-xs text-muted uppercase tracking-[0.2em]">Scroll</span>
          <div className="relative w-px h-10 bg-stroke overflow-hidden">
            <div className="absolute inset-x-0 h-4 bg-text-primary/50 animate-scroll-down" />
          </div>
        </div>
      </section>
    </div>
  );
}
