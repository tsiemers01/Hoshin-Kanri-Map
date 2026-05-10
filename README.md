# Hoshin Kanri X-Matrix

A responsive web application for building and managing Hoshin Kanri strategy maps using the X-Matrix format. Works on both desktop and mobile devices.

## What is Hoshin Kanri?

Hoshin Kanri is a strategic planning methodology that aligns an organization's goals from top-level breakthrough objectives down to specific improvement activities. The X-Matrix is the core visualization tool, showing four quadrants and their correlations on a single page:

- **Breakthrough Objectives** (South) — 3-5 year strategic goals
- **Annual Objectives** (West) — 1-year tactical goals
- **Key Initiatives** (North) — specific improvement projects
- **Targets & Metrics** (East) — KPIs that measure progress

Corner correlation matrices show the strength of relationships between adjacent quadrants.

## Features

- Full X-Matrix layout with 4 quadrants and 4 correlation matrices
- Add, edit, and delete items in each quadrant with optional ownership
- Click correlation cells to cycle through: none → weak → strong
- Responsive design: grid layout on desktop, tabbed interface on mobile
- Data persistence via localStorage
- Export/import as JSON for backup and sharing
- Print-friendly styling
- Dark theme UI

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Live Demo

Deployed automatically via GitHub Pages:

**https://tsiemers01.github.io/Hoshin-Kanri-Map/**

Every push to `main` triggers a build and deploy via GitHub Actions.

### Enable GitHub Pages (one-time setup)

1. Go to your repo **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` (or run the workflow manually) — the site will be live within a minute

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
