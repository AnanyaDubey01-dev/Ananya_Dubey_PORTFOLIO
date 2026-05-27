import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  badgeColor: string;
  description: string;
  challenge: { label: string; text: string };
  solution: { label: string; text: string };
  highlight?: string;
  techStack: string[];
  image: string;
  span: string;
  aspect: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'AI Weather Intelligence',
    subtitle: 'Chatbot',
    category: 'AI / NLP',
    badge: 'LIVE · PRODUCTION',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'A conversational AI system that understands natural-language weather queries and translates them into precise SQL against a live database — deployed at Skymet Weather for real forecasting operations.',
    challenge: {
      label: 'The Challenge',
      text: 'Weather databases are complex — querying them requires domain expertise that most users don\'t have. Non-technical teams couldn\'t access the data they needed.'
    },
    solution: {
      label: 'The Solution',
      text: 'Architected structured prompt chains guiding an Ollama LLM to generate accurate SQL, with Indian-state fuzzy matching, response caching, and configurable pipelines.'
    },
    highlight: 'Reduced query latency · Improved non-technical access to live forecast data',
    techStack: ['Python', 'Ollama LLM', 'NLP/NLU', 'SQL', 'Prompt Engineering'],
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80',
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
  },
  {
    id: 2,
    title: 'Livestock Management',
    subtitle: '& Insurance Platform',
    category: 'Full-Stack',
    badge: 'ENTERPRISE · FULL-STACK',
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    description: 'A production-grade React web application managing end-to-end cattle operations, farmer records, insurance workflows, and business analytics for enterprise clients.',
    challenge: {
      label: 'The Scope',
      text: 'Role-based access, insurance claim pipelines, cattle registration, lead assignment, and Chart.js analytics — all engineered from design through deployment.'
    },
    solution: {
      label: 'The Craft',
      text: 'Polished UX with modal-based detail views, multi-file media uploads, and production-grade component architecture that enterprise clients actually trust.'
    },
    techStack: ['React', 'REST API', 'Chart.js', 'CSS3', 'RBAC'],
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',
    span: 'md:col-span-5',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 3,
    title: 'CattleAI',
    subtitle: 'Biometric Android App',
    category: 'Android',
    badge: 'ANDROID · PRODUCTION',
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    description: 'Field-ready Android app enabling livestock agents to register cattle on-site via multi-angle photo capture, GPS sessions, and AI biometric identity matching via REST APIs.',
    challenge: {
      label: 'The Complexity',
      text: 'Dual REST backends (legacy + Django v2), session polling, video compression, digital signature capture, and R8/ProGuard obfuscation for secure production release.'
    },
    solution: {
      label: 'The Outcome',
      text: 'A field-tested app that insurance agents trust with biometric and financial data in low-connectivity rural environments across India.'
    },
    techStack: ['Java', 'Android SDK', 'Retrofit', 'CameraX', 'Django REST'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    span: 'md:col-span-5',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 4,
    title: 'IoT Smart Plant',
    subtitle: 'Monitoring System',
    category: 'IoT / Embedded',
    badge: 'IoT · EMBEDDED',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: 'Automated irrigation intelligence using ESP8266 NodeMCU — real-time sensor fusion across temperature, humidity, and soil-moisture with relay-controlled pump activation and live cloud dashboard.',
    challenge: {
      label: 'The System',
      text: 'Multi-sensor data acquisition, threshold-driven actuator logic, and cloud-based monitoring — a complete closed-loop IoT system from hardware through software.'
    },
    solution: {
      label: 'The Bridge',
      text: 'Demonstrates the intersection of embedded engineering and cloud intelligence — physical systems elevated by intelligent automation.'
    },
    techStack: ['ESP8266', 'Arduino C', 'ThingSpeak', 'IoT Sensors'],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
  },
  {
    id: 5,
    title: 'Executive Analytics',
    subtitle: 'Dashboard Suite',
    category: 'Data / Analytics',
    badge: 'DATA · ANALYTICS',
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    description: 'Suite of executive-grade analytics dashboards — automotive sales ($9.6M tracked), pizza operations, and bank loan portfolios — built with Power BI, Tableau, MySQL, and advanced DAX.',
    challenge: {
      label: 'The Data Work',
      text: 'Complex MySQL queries surfacing KPIs, YoY trends, dynamic regional maps, and default rate tracking across multiple business domains.'
    },
    solution: {
      label: 'The Value',
      text: 'Findings directly informed marketing strategy adjustments. Dashboards designed for clarity under pressure, not just technical accuracy.'
    },
    techStack: ['Power BI', 'Tableau', 'MySQL', 'DAX', 'Excel'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    span: 'md:col-span-12',
    aspect: 'aspect-[21/9]',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
  },
  exit: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95,
    transition: { duration: 0.2 }
  },
};

export default function SelectedWorks() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 md:mb-16"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Selected Work
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-body font-light text-text-primary">
              What I've{' '}
              <span className="font-display italic">Built</span>
            </h2>

            <p className="text-sm text-muted max-w-sm">
              Production systems shipped at scale — from AI chatbots to enterprise platforms.
            </p>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              onClick={() => openModal(project)}
              className={`project-card group relative ${project.span} ${project.aspect} rounded-3xl overflow-hidden cursor-pointer bg-surface border border-stroke hover:border-stroke/80 transition-all duration-300`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-card-image w-full h-full object-cover"
                />
                {/* Halftone Overlay */}
                <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply" />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              </div>

              {/* Hover Overlay */}
              <div className="project-card-overlay absolute inset-0 bg-bg/80 backdrop-blur-md flex items-center justify-center">
                {/* View Label Pill */}
                <div className="relative">
                  <span className="absolute inset-[-2px] rounded-full gradient-border" />
                  <span className="relative flex items-center gap-2 bg-white text-bg rounded-full px-5 py-2.5 text-sm font-medium">
                    View Project
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Bottom Info - Always Visible */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs text-white/60 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-medium text-white mt-1">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="text-sm text-white/70">{project.subtitle}</p>
                    )}
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border whitespace-nowrap ${project.badgeColor}`}>
                    {project.badge}
                  </span>
                </div>
              </div>

              {/* Project Number */}
              <div className="absolute top-4 left-5 text-xs text-white/40 font-mono">
                {String(project.id).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-surface border border-stroke rounded-3xl"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-bg/80 border border-stroke flex items-center justify-center text-muted hover:text-text-primary hover:border-text-primary/30 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header Image */}
              <div className="relative h-48 md:h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                
                {/* Badge */}
                <div className="absolute bottom-4 left-6">
                  <span className={`text-xs px-3 py-1.5 rounded-full border ${selectedProject.badgeColor}`}>
                    {selectedProject.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 -mt-8 relative">
                {/* Title */}
                <div className="mb-6">
                  <span className="text-xs text-muted uppercase tracking-[0.2em]">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-body font-medium text-text-primary mt-2">
                    {selectedProject.title}
                    {selectedProject.subtitle && (
                      <span className="text-muted font-light"> {selectedProject.subtitle}</span>
                    )}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-muted leading-relaxed mb-8">
                  {selectedProject.description}
                </p>

                {/* Challenge & Solution Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-2xl bg-bg/50 border border-stroke/50">
                    <h4 className="text-xs text-accent uppercase tracking-[0.15em] mb-3">
                      {selectedProject.challenge.label}
                    </h4>
                    <p className="text-sm text-muted leading-relaxed">
                      {selectedProject.challenge.text}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-bg/50 border border-stroke/50">
                    <h4 className="text-xs text-accent uppercase tracking-[0.15em] mb-3">
                      {selectedProject.solution.label}
                    </h4>
                    <p className="text-sm text-muted leading-relaxed">
                      {selectedProject.solution.text}
                    </p>
                  </div>
                </div>

                {/* Highlight */}
                {selectedProject.highlight && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mb-8">
                    <span className="text-emerald-400">⚡</span>
                    <p className="text-sm text-emerald-400/90">
                      {selectedProject.highlight}
                    </p>
                  </div>
                )}

                {/* Tech Stack */}
                <div>
                  <h4 className="text-xs text-muted uppercase tracking-[0.15em] mb-4">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1.5 rounded-full bg-bg border border-stroke text-text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
