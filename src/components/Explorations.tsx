import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const explorations = [
  {
    title: 'Weather Dashboard',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&q=80',
  },
  {
    title: 'Data Visualization',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    title: 'Mobile Interface',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
  },
  {
    title: 'System Architecture',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
  },
  {
    title: 'IoT Dashboard',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  },
  {
    title: 'Analytics Platform',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
];

export default function Explorations() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the content
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: contentRef.current,
        pinSpacing: false,
      });

      // Parallax for column 1 (moves slower)
      gsap.to(col1Ref.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Parallax for column 2 (moves faster)
      gsap.to(col2Ref.current, {
        y: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const leftColumn = explorations.filter((_, i) => i % 2 === 0);
  const rightColumn = explorations.filter((_, i) => i % 2 === 1);

  return (
    <section ref={sectionRef} className="relative min-h-[200vh] bg-bg">
      {/* Pinned Content */}
      <div
        ref={contentRef}
        className="h-screen flex items-center justify-center z-10 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center px-6 max-w-2xl"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Explorations
            </span>
            <div className="w-8 h-px bg-stroke" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-body font-light text-text-primary mb-6">
            Visual{' '}
            <span className="font-display italic">playground</span>
          </h2>

          {/* Subtext */}
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            Experimental designs and visual explorations from my creative process.
          </p>

          {/* Dribbble Button */}
          <a
            href="https://github.com/AnanyaDubey01-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 rounded-full text-sm px-6 py-3 border border-stroke text-text-primary hover:border-transparent transition-all duration-300"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="relative flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </span>
          </a>
        </motion.div>
      </div>

      {/* Parallax Columns */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <div className="max-w-[1400px] mx-auto h-full px-6 md:px-10">
          <div className="grid grid-cols-2 gap-12 md:gap-40 h-full pt-[20vh]">
            {/* Left Column */}
            <div ref={col1Ref} className="flex flex-col gap-8 pt-20">
              {leftColumn.map((item, index) => (
                <div
                  key={item.title}
                  className="aspect-square max-w-[320px] rounded-2xl overflow-hidden bg-surface border border-stroke pointer-events-auto cursor-pointer group"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div ref={col2Ref} className="flex flex-col gap-8 pt-40">
              {rightColumn.map((item, index) => (
                <div
                  key={item.title}
                  className="aspect-square max-w-[320px] ml-auto rounded-2xl overflow-hidden bg-surface border border-stroke pointer-events-auto cursor-pointer group"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? 2 : -2}deg)`,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
