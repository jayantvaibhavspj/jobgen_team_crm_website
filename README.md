# Jobgen Marketing OS & Team Workflow Planner

Single unified web application merging Jobgen's Marketing OS and Daily Workflow Planner into a seamless React + Vite workspace.

## 🚀 Unified Architecture

Everything runs from a single unified project:
- **Frontend Stack:** React 18, Vite 6, Lucide Icons, Canvas Confetti
- **Design System:** Native Dark/Light theme sync, responsive grid, drag-and-drop Kanban
- **Routing:** Instant client-side SPA navigation between all marketing modules and the daily workflow planner

## 📁 Project Structure

```
├── public/                 # Brand assets & public files
│   └── assets/brandmark.svg
│
├── src/
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Shell layout (Sidebar + Topbar + View router)
│   ├── styles/
│   │   ├── marketing.css   # Marketing OS design system
│   │   └── planner.css     # Workflow Planner design system
│   │
│   ├── components/
│   │   ├── marketing/      # Native React Marketing OS views
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ContentStudio.jsx
│   │   │   ├── SocialHub.jsx
│   │   │   ├── ContentCalendar.jsx
│   │   │   ├── Workboard.jsx
│   │   │   ├── AssetLibrary.jsx
│   │   │   ├── CompetitorRadar.jsx
│   │   │   ├── LeadCRM.jsx
│   │   │   ├── Campaigns.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Automations.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── LoginView.jsx
│   │   │   ├── Modals.jsx
│   │   │   └── Icons.jsx
│   │   │
│   │   └── planner/        # Native Workflow Planner components
│   │       ├── WorkflowPlanner.jsx
│   │       ├── TaskBoard.jsx
│   │       ├── BentoStats.jsx
│   │       ├── PomodoroTimer.jsx
│   │       ├── ScopeSelector.jsx
│   │       ├── PeriodBar.jsx
│   │       ├── QuickAdd.jsx
│   │       └── YesterdayPendingSection.jsx
│   │
│   ├── hooks/
│   │   ├── useMarketingState.js # Unified marketing state & local persistence
│   │   └── useWorkPlanner.js    # Sprint planning, task rollover & backup
│   │
│   └── utils/
│       ├── confetti.js
│       ├── dateUtils.js
│       ├── fileUtils.js
│       └── sound.js
│
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Build for production
npm run build
```

Dev Server runs at: **[http://localhost:5173/](http://localhost:5173/)**
