# Ananya Dubey — Portfolio

A personal portfolio showcasing production work across AI, full-stack web, Android, IoT, and data analytics. Built with React, TypeScript, and motion-first interactions.

**Live site:** Run locally with the steps below, or deploy the `dist/` folder to your host of choice.

---

## About Me

Hi, I'm **Ananya Dubey** — a Software Engineer, AI Developer, Full-Stack Developer, and IoT Engineer based in **India**.

I build intelligent systems at the intersection of software and the real world: from AI-powered applications and enterprise platforms to embedded IoT ecosystems and analytics dashboards. I care about shipping production-grade work — systems that real users and teams rely on, not just demos.

| | |
|---|---|
| **Experience** | 3+ years in software development |
| **Projects** | 8+ shipped from concept to production |
| **Focus** | AI/NLP · Full-Stack · Android · IoT · Data & Analytics |

**Get in touch:** [ananydubey4694@gmail.com](mailto:ananydubey4694@gmail.com)  
**LinkedIn:** [ananya-dubey-42078a27b](https://linkedin.com/in/ananya-dubey-42078a27b)  
**GitHub:** [AnanyaDubey01-dev](https://github.com/AnanyaDubey01-dev)

---

## About This Portfolio

This site is a single-page experience with a dark, editorial aesthetic — serif display type, bento-grid project layout, and layered motion. It highlights selected work, writing, visual explorations, and key stats.

### Sections

| Section | Description |
|---------|-------------|
| **Hero** | Intro with rotating roles, WebGL video background with liquid-reveal effect, and CTAs |
| **Selected Work** | Bento grid of featured projects with detail modals (challenge, solution, tech stack) |
| **Journal** | Technical write-ups on building AI/NLP systems and related topics |
| **Explorations** | Scroll-driven gallery of UI and system design explorations |
| **Stats** | Animated counters for experience, projects, and satisfaction |
| **Footer** | Contact CTA, social links, and availability status |

### Featured Work (highlights)

- **AI Weather Intelligence Chatbot** — NLP-to-SQL for live weather data (Skymet Weather)
- **Livestock Management & Insurance Platform** — Enterprise React app with RBAC and analytics
- **CattleAI** — Android biometric livestock registration for field agents
- **IoT Smart Plant Monitoring** — ESP8266 sensor fusion with cloud dashboard
- **Executive Analytics Dashboard Suite** — Power BI, Tableau, and MySQL across multiple domains

---

## Tech Stack

### This site

| Category | Tools |
|----------|-------|
| **Framework** | React 18, TypeScript |
| **Build** | Vite 5 |
| **Styling** | Tailwind CSS 3, PostCSS, Autoprefixer |
| **Animation** | GSAP (ScrollTrigger), Framer Motion |
| **Media** | HLS.js, WebGL (custom shaders), HTML5 video |
| **Fonts** | Inter, Instrument Serif |

### Broader skills (from featured projects)

| Area | Technologies |
|------|----------------|
| **AI / NLP** | Python, Ollama LLM, prompt engineering, SQL, NLU |
| **Web** | React, REST APIs, Chart.js, CSS3, RBAC |
| **Mobile** | Java, Android SDK, Retrofit, CameraX, Django REST |
| **IoT** | ESP8266, Arduino C, ThingSpeak, sensors & actuators |
| **Data** | Power BI, Tableau, MySQL, DAX, Excel |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm (comes with Node.js)

### Install & run

```bash
# Clone the repository
git clone https://github.com/AnanyaDubey01-dev/react-portfolio.git
cd react-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Other commands

```bash
npm run build    # Type-check + production build → dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

### Hero video asset

The hero section expects a background video at `public/hero-bg.mp4`. Add your own file there for the full WebGL reveal effect; the page still renders with a dark fallback if the video is missing.

---

## Project Structure

```
react-portfolio/
├── public/              # Static assets (e.g. hero-bg.mp4)
├── src/
│   ├── components/      # UI sections (Hero, SelectedWorks, Footer, …)
│   ├── App.tsx          # App shell & loading gate
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles & CSS variables
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## License

© Ananya Dubey. All rights reserved.

This repository is for portfolio and demonstration purposes. Please do not redistribute or reuse the design and content without permission.
