# Cardyco — Clinical Mobile ECG Telemetry Platform

Cardyco is a high-performance, real-time clinical ECG telemetry mobile-web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

Designed for remote cardiac monitoring, emergency triage, and real-time arrhythmia alerting.

---

## 🌟 Key Features

- **⚡ Real-Time Lead-II ECG Telemetry**: Canvas-accelerated 60 FPS continuous waveform renderer with simulated physiological noise and signal filtering.
- **🚨 Instant Arrhythmia Alert System**: Autonomous detection and visual/audio alert triggers for Ventricular Tachycardia, VFib, Asystole, and Severe Bradycardia.
- **📄 Clinical PDF Report Generation**: One-click export of detailed ECG strips, vital logs, and patient diagnostic summaries.
- **🤖 AI Cardiac Assistant**: Integrated diagnostic chat widget for clinical guidance and emergency protocol assistance.
- **📁 Patient Telemetry History**: Filterable recording archives by status, duration, and date range.
- **⚙️ Customizable Vital Thresholds**: Configurable HR bounds, alarm volume, and automatic escalation contacts.

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 + Custom Keyframe Animations
- **Icons**: Lucide React
- **Canvas Rendering**: HTML5 2D Context

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rounit-k-verma/Cardyco.git
cd Cardyco

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

```bash
# Type check and build
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 License

MIT License. Designed for clinical telemetry simulation and educational visualization.
