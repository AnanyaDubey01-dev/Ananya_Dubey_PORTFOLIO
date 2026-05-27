import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JournalEntry {
  id: number;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  image: string;
  content: {
    intro: string;
    sections: { heading: string; text: string }[];
    takeaway: string;
  };
  tags: string[];
}

const journalEntries: JournalEntry[] = [
  {
    id: 1,
    title: 'Building AI-Powered NLP Systems',
    excerpt: 'Lessons from developing production chatbots with LLM integration',
    readTime: '5 min read',
    date: 'May 2026',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    content: {
      intro: 'When I started working on the weather chatbot at Skymet, I thought the hard part would be the AI. Turns out, the real challenge was everything around it.',
      sections: [
        {
          heading: 'The messy reality of LLMs',
          text: 'LLMs are impressive, but they\'re also unpredictable. My first prototype generated beautiful SQL queries — that were completely wrong. The model would confidently return data for cities that don\'t exist. Spent two weeks just building validation layers and fuzzy matching for Indian state names because users type "MP" not "Madhya Pradesh".'
        },
        {
          heading: 'What actually worked',
          text: 'Structured prompts with examples. Not fancy prompt engineering techniques from Twitter threads — just clear examples of what good output looks like. Also, caching. Caching everything. Users ask the same questions repeatedly, and LLM calls are expensive.'
        },
        {
          heading: 'Things I\'d do differently',
          text: 'Start with a smaller scope. I tried to handle every possible weather query on day one. Should have started with "what\'s the temperature in Delhi" and expanded from there. Also, logging. I added proper logging way too late and spent hours debugging issues I could have solved in minutes.'
        }
      ],
      takeaway: 'Building with LLMs is less about the AI and more about handling the edge cases gracefully. The boring engineering stuff matters more than the cool AI stuff.'
    },
    tags: ['AI', 'LLM', 'Python', 'Lessons Learned']
  },
  {
    id: 2,
    title: 'From Hardware to Full-Stack',
    excerpt: 'My journey from embedded systems to enterprise applications',
    readTime: '8 min read',
    date: 'Apr 2026',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    content: {
      intro: 'I studied Electronics & Communication. My first instinct when something breaks is still to check if it\'s a hardware issue. That background shaped how I think about software in ways I didn\'t expect.',
      sections: [
        {
          heading: 'The transition wasn\'t smooth',
          text: 'Going from C on microcontrollers to JavaScript felt wrong at first. No strict typing, no memory management, everything running in a browser? It seemed chaotic. I wrote my first React components like I was writing firmware — over-engineered and impossible to read.'
        },
        {
          heading: 'What hardware taught me',
          text: 'Debugging skills transfer surprisingly well. When you\'ve spent hours with an oscilloscope trying to figure out why a signal is noisy, debugging a React state issue feels manageable. Also, thinking about constraints. Embedded systems have real limits — memory, processing power. That mindset helps when optimizing web apps.'
        },
        {
          heading: 'The stuff I had to unlearn',
          text: 'Premature optimization. In embedded, you think about every byte. In web dev, sometimes the readable solution is better than the clever one. Also had to stop writing 500-line functions. Frontend code needs to be modular, even when it feels less "efficient".'
        }
      ],
      takeaway: 'Coming from hardware made me a better debugger but a worse first-draft coder. Still working on writing simple code on the first try.'
    },
    tags: ['Career', 'Learning', 'Embedded', 'Web Dev']
  },
  {
    id: 3,
    title: 'IoT in Agriculture',
    excerpt: 'How sensor fusion is revolutionizing smart farming',
    readTime: '6 min read',
    date: 'Mar 2026',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    content: {
      intro: 'Built a smart irrigation system for my college project. Sounds fancy, but it was basically an ESP8266 turning a pump on and off. Here\'s what I learned from that simple project.',
      sections: [
        {
          heading: 'Simple beats clever',
          text: 'My original plan had machine learning for predicting water needs, weather API integration, and a mobile app. The final version? A soil moisture sensor and a threshold check. If soil is dry, water the plant. It works. The complex version would have failed in the field.'
        },
        {
          heading: 'Real-world constraints',
          text: 'WiFi in a garden is unreliable. Power supply is inconsistent. Sensors drift over time and need calibration. None of my textbooks mentioned that soil moisture sensors give wildly different readings depending on soil type. Had to figure that out by testing in actual dirt.'
        },
        {
          heading: 'The human element',
          text: 'Farmers don\'t want to debug IoT systems. Any solution needs to fail gracefully and recover automatically. Added a dead simple rule: if the system hasn\'t heard from the sensor in 10 minutes, assume something\'s wrong and alert. That single feature prevented more disasters than all my "smart" code.'
        }
      ],
      takeaway: 'IoT projects are 20% coding and 80% dealing with physical reality. The gap between demo and deployment is bigger than you think.'
    },
    tags: ['IoT', 'ESP8266', 'Agriculture', 'Hardware']
  },
  {
    id: 4,
    title: 'Android Development Best Practices',
    excerpt: 'Building robust field-ready mobile applications',
    readTime: '7 min read',
    date: 'Feb 2026',
    image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80',
    content: {
      intro: 'The CattleAI app I built gets used by insurance agents in rural India. That means slow networks, old phones, and users who don\'t have time for crashes. Here\'s what I learned building for those conditions.',
      sections: [
        {
          heading: 'Offline-first is non-negotiable',
          text: 'Network connectivity in rural areas is spotty at best. The app had to work completely offline and sync when possible. This meant local SQLite databases, queued API calls, and conflict resolution. It added weeks of development time but was absolutely necessary.'
        },
        {
          heading: 'Test on actual devices',
          text: 'Emulators lie. The app ran perfectly on my test devices but crashed on the cheap Android phones agents actually use. Memory constraints, different camera implementations, weird manufacturer-specific bugs. Started keeping a collection of budget phones for testing.'
        },
        {
          heading: 'Error messages for humans',
          text: 'My first error messages were developer-speak: "API timeout exception." Users have no idea what that means. Changed them to: "Can\'t connect right now. Your data is saved and will upload when you\'re back online." Same error, but now people understand what happened and what to do.'
        }
      ],
      takeaway: 'Building for the real world means building for bad conditions. The app needs to work when everything goes wrong, not just when everything goes right.'
    },
    tags: ['Android', 'Mobile', 'Offline-First', 'UX']
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
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

export default function Journal() {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const openModal = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEntry(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section id="journal" className="bg-bg py-16 md:py-24">
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
              Journal
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-body font-light text-text-primary">
              Recent{' '}
              <span className="font-display italic">thoughts</span>
            </h2>

            <p className="text-sm text-muted max-w-sm">
              Notes from building things. Mostly lessons learned the hard way.
            </p>
          </div>
        </motion.div>

        {/* Journal Entries */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col gap-4"
        >
          {journalEntries.map((entry) => (
            <motion.div
              key={entry.id}
              variants={itemVariants}
              onClick={() => openModal(entry)}
              className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 rounded-[40px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke hover:border-stroke/80 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full sm:w-16 h-32 sm:h-16 rounded-3xl sm:rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-text-primary group-hover:text-white transition-colors truncate">
                  {entry.title}
                </h3>
                <p className="text-sm text-muted mt-1 hidden sm:block truncate">
                  {entry.excerpt}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-muted flex-shrink-0">
                <span>{entry.readTime}</span>
                <span className="w-1 h-1 rounded-full bg-stroke" />
                <span>{entry.date}</span>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-stroke/50 group-hover:bg-text-primary group-hover:text-bg transition-all flex-shrink-0">
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Journal Entry Modal */}
      <AnimatePresence>
        {selectedEntry && (
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
            <motion.article
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border border-stroke rounded-3xl"
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
              <div className="relative h-48 md:h-56 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedEntry.image}
                  alt={selectedEntry.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 -mt-16 relative">
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted mb-4">
                  <span>{selectedEntry.date}</span>
                  <span className="w-1 h-1 rounded-full bg-stroke" />
                  <span>{selectedEntry.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-body font-medium text-text-primary mb-6">
                  {selectedEntry.title}
                </h3>

                {/* Intro */}
                <p className="text-muted leading-relaxed mb-8 text-lg">
                  {selectedEntry.content.intro}
                </p>

                {/* Sections */}
                <div className="space-y-8 mb-8">
                  {selectedEntry.content.sections.map((section, index) => (
                    <div key={index}>
                      <h4 className="text-lg font-medium text-text-primary mb-3">
                        {section.heading}
                      </h4>
                      <p className="text-muted leading-relaxed">
                        {section.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Takeaway */}
                <div className="p-5 rounded-2xl bg-bg/50 border border-stroke/50 mb-6">
                  <h4 className="text-xs text-muted uppercase tracking-[0.15em] mb-3">
                    The takeaway
                  </h4>
                  <p className="text-text-primary leading-relaxed">
                    {selectedEntry.content.takeaway}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full bg-bg border border-stroke text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
