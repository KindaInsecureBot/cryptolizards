# 🦎 CryptoLizards

**CryptoLizards** is a CryptoZombies-style interactive tutorial web app for learning [LEZ (Logos Execution Zone)](https://logos.co) blockchain development in Rust.

## Live App

[https://kindainsecurebot.github.io/cryptolizards/](https://kindainsecurebot.github.io/cryptolizards/)

## Features

- **Monaco Editor** (VS Code engine) with Rust syntax highlighting
- **Pattern-matching validation** — no backend compilation needed, runs entirely in the browser
- **Progress tracking** persisted to `localStorage`
- **Progressive hints** — reveal one hint at a time before showing the solution
- **Chapter/lesson navigation** with a collapsible sidebar
- **Completion overlay** with celebratory feedback
- **Dark theme** with a green lizard accent
- **Responsive layout** — stacks vertically on mobile
- **GitHub Pages deployable** — pure static site

## Tech Stack

| Tool | Purpose |
|---|---|
| [Vite](https://vitejs.dev) + React + TypeScript | Build tooling and UI framework |
| [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) | VS Code editor in the browser |
| [react-markdown](https://github.com/remarkjs/react-markdown) | Render lesson content from Markdown |
| Custom CSS | Dark theme, no CSS framework dependency |

## Project Structure

```
src/
├── components/
│   ├── App.tsx              # Root layout, state orchestration
│   ├── Header.tsx           # Top bar: logo, breadcrumb, progress bar
│   ├── Sidebar.tsx          # Collapsible chapter/lesson navigation
│   ├── LessonContent.tsx    # Left panel: markdown lesson + hints
│   ├── CodeEditor.tsx       # Monaco editor wrapper
│   ├── ValidationResult.tsx # Per-check pass/fail display
│   └── CompletionOverlay.tsx# Lesson complete modal
├── engine/
│   ├── types.ts             # Lesson, Chapter, Validation types
│   └── validator.ts         # Pattern-matching validation engine
├── lessons/
│   └── index.ts             # Lesson registry (all chapters + lessons)
├── hooks/
│   └── useProgress.ts       # localStorage progress tracking
├── main.tsx
└── index.css                # Full dark-theme CSS
```

## Lesson Structure

Each lesson is a TypeScript object:

```typescript
interface Lesson {
  id: string;
  chapter: number;
  step: number;
  title: string;
  content: string;          // Markdown lesson text
  initialCode: string;      // Starting code template
  solution: string;         // Reference solution
  validations: Validation[];// RegExp pattern checks
  hints: string[];          // Progressive hints
}
```

Validations are simple regex patterns checked against the editor content — no Rust compiler required:

```typescript
{
  pattern: /read_nssa_inputs\s*\(/,
  message: 'Call `read_nssa_inputs()` to receive program inputs',
  required: true,
}
```

## Adding Lessons

1. Open `src/lessons/index.ts`
2. Add a new `Lesson` object to an existing `Chapter`, or create a new `Chapter`
3. Export it via `CHAPTERS`

That's it — the UI picks up new lessons automatically.

## Local Development

```bash
npm install --include=dev
npm run dev
```

> **Note:** This environment has npm configured to skip devDependencies by default.
> Always use `--include=dev` to install TypeScript, Vite, etc.

## Deploy

Merging to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`)
which builds and deploys to GitHub Pages automatically.

## Current Curriculum

### Chapter 1: Getting Started with LEZ
1. **Hatching Your First Lizard** — The read → process → write pattern, `read_nssa_inputs`, `AccountPostState`, `write_nssa_outputs`
2. **Reading Account Balances** — `NssaInputs` struct, finding accounts, `lez_log!` macro

### Chapter 2: State & Storage
1. **Writing to Account Data** — Borsh serialization, persisting counter state across invocations
