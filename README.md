# Jobgen Marketing OS & Team CRM Website

Integrated Marketing OS and Daily Workflow Planner workspace for Jobgen.ai.

## 📁 Project Structure

```
├── marketing_team/     # Marketing OS frontend with integrated CRM & Workflow Planner
│   ├── index.html      # Main Marketing OS entry point
│   ├── style.css       # Complete UI design system
│   ├── app.js          # Client-side SPA router & CRM state management
│   ├── assets/         # Brand assets & icons
│   └── planner-app/    # Embedded Workflow Planner bundle
│
└── workflow_planner/   # React + Vite source for the Work Planner
    ├── src/            # Components, hooks, utilities & state
    ├── package.json    # React dependencies
    └── vite.config.js  # Vite build configuration
```

## 🚀 Getting Started

### 1. Marketing OS (Integrated CRM & Planner)
```bash
cd marketing_team
npm install
npm run dev
```
Runs at: [http://localhost:5173/](http://localhost:5173/)

### 2. Workflow Planner (Standalone Dev Server)
```bash
cd workflow_planner
npm install
npm run dev
```
Runs at: [http://localhost:3000/](http://localhost:3000/)

## ✨ Key Features
- **Marketing OS Dashboard & Lead CRM:** Track pipeline stages, scheduled posts, and marketing metrics.
- **Integrated Workflow Planner:** Access daily sprint task board directly from the Marketing OS sidebar.
- **Dual-Mode Integration:** Switch seamlessly between live dev server and embedded bundle.
- **Theme Sync:** Automatic light and dark mode synchronization.
