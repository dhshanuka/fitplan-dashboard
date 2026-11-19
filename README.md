# FitPlan — Workout & Habit Task Management Dashboard

FitPlan is a modern, responsive Task Management Dashboard engineered for workouts, fitness routines, and healthy habits. Built to senior frontend engineering standards, it emphasizes clean architectural boundaries, resilient asynchronous UX (with optimistic updates and undo actions), accessibility, and fitness-themed design tokens.

---

## 📸 Screenshots & Previews

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FitPlan | Workout Tracker                   [Dark Mode] [Ctrl+K Command]   │
├─────────────────┬───────────────────────────────────────────────────────────┤
│ ❖ Dashboard     │ ⚡ 7 Day Training Streak (86% Consistency)                │
│ ✓ Workouts      │ [Mon ✓] [Tue ✓] [Wed ✓] [Thu (Today)] [Fri ·] [Sat ·]     │
│                 ├───────────────────────────────────────────────────────────┤
│ [Quick Add]     │ Total: 28 | Completed: 12 | In Progress: 6 | Overdue: 3   │
│ "Run 5km tmrw"  ├─────────────────────────────┬─────────────────────────────┤
│                 │ 7-Day Completion Trend      │ Status Breakdown (Donut)    │
│ ⚙ Network Sim   │ [Area Chart: Recharts]      │ [Completed / In Progress]   │
└─────────────────┴─────────────────────────────┴─────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) + React 18 |
| **Language** | TypeScript (Strict mode enabled, no `any`) |
| **Styling** | Tailwind CSS with CSS variable design tokens & Dark Mode persistence |
| **Server State** | TanStack Query v5 (`@tanstack/react-query`) |
| **Form Management** | React Hook Form + Zod schema validation (`@hookform/resolvers/zod`) |
| **Visualizations** | Recharts (Responsive Area Chart & Donut Pie Chart) |
| **Icons** | Lucide React |
| **Testing** | Vitest for fast unit test suite |
| **Mock Engine** | In-memory server store with simulated latency (300-800ms) & togglable failure rate (~10%) |

---

## 🌟 Standout Features

1. **Optimistic Updates & Instant Rollback**:
   - Status transitions (Todo ➔ In Progress ➔ Completed) update immediately in the UI. If the API fails due to simulated network failure, state seamlessly rolls back with an error notification.
2. **Non-Blocking Undo Delete**:
   - Deleting a workout removes it optimistically and triggers a 7-second "Undo" toast with a 1-click restore action instead of disruptive confirm modals.
3. **Smart Quick-Add Natural Language Parser**:
   - Parses phrases like `"Run 5km tomorrow high #cardio"` or `"Squats 5x5 friday #strength"` into structured `title`, `category`, `priority`, and `dueDate` (pure function in `src/lib/nlParser.ts`, 100% unit tested).
4. **URL Query Param Synchronization**:
   - Search term, category, priority, status, quick-filter chips (`Overdue`, `Due Today`, `High Priority`), sort order, and page number sync bidirectionally to URL params. Views are shareable and browser back/forward buttons work out of the box.
5. **Command Palette (`Ctrl/Cmd+K`)**:
   - Fast keyboard switcher to jump between tasks, trigger workout creation, switch light/dark theme, and navigate views.
6. **Live Network Simulator Widget**:
   - Interactive toggle in the desktop sidebar allowing evaluators to switch simulated network failure rates live between 0% and 15% to observe skeletons, error states, and retry toasts.

---

## 🏗 Architecture & Separation of Concerns

```
src/
├── app/                        # Next.js App Router & API Route Handlers
│   ├── api/
│   │   ├── tasks/              # GET, POST, [id] PUT/PATCH/DELETE, restore/
│   │   ├── dashboard/stats/    # Computed stats, streak, 7-day trend
│   │   └── config/             # Live failure rate & store reset
│   ├── tasks/                  # Task listing & [id] detail page
│   ├── layout.tsx              # Root shell with providers
│   └── page.tsx                # Analytical dashboard
├── components/
│   ├── ui/                     # Design system primitives: Button, Input, Modal, Toast, Skeleton, etc.
│   ├── tasks/                  # TaskCard, TaskTable, TaskForm, TaskFilters, QuickAddInput, Pagination
│   ├── dashboard/              # StatCard, StatusChart, TrendChart, ConsistencyStreak, DueSoonList
│   ├── navigation/             # Sidebar, MobileNav, CommandPalette
│   └── providers/              # QueryProvider, ThemeProvider, ToastProvider
├── services/
│   └── taskService.ts          # THE ONLY place that communicates with the API
├── hooks/
│   ├── useTasks.ts             # React Query hook for filtered/paginated list
│   ├── useTask.ts              # React Query hook for single workout detail
│   ├── useTaskMutations.ts     # Optimistic mutations (create, update, delete, status cycle)
│   ├── useTaskFilters.ts       # URL search params bidirectional synchronization
│   ├── useDebounce.ts          # Generic search debounce hook
│   └── useDashboardStats.ts    # React Query hook for dashboard statistics
├── lib/
│   ├── serverStore.ts          # In-memory mock DB seeded with 28 realistic tasks
│   ├── apiClient.ts            # Centralized fetch wrapper with typed ApiError handling
│   ├── validators.ts           # Zod validation schemas
│   ├── nlParser.ts             # Pure function natural language parser
│   ├── dateUtils.ts            # Date formatting, overdue check, relative due date
│   └── constants.ts            # Categories, priorities, status colors, design tokens
└── types/
    ├── task.ts                 # Domain models (Task, ActivityLog, Category, Priority, Status)
    └── api.ts                  # FilterParams, PaginatedResponse, DashboardStats
```

---

## ⚖️ Architectural Decisions & Trade-Offs

1. **In-Memory Store vs SQLite/Prisma**:
   - *Decision*: Next.js App Router in-memory singleton seeded from `seedTasks.json`.
   - *Reasoning*: Zero external database installation required for reviewers while fully supporting full CRUD, pagination, filtering, search, and activity timelines.
2. **Optimistic Updates vs Pessimistic Fetch**:
   - *Decision*: Status changes and deletes execute optimistically with automatic rollback on network error.
   - *Reasoning*: Modern fitness trackers need to feel snappy and immediate. Rolling back on error provides superior UX over blocking loaders for every single click.
3. **Undo Toast vs Confirmation Modal**:
   - *Decision*: Soft delete with a 7-second Undo toast.
   - *Reasoning*: Confirm modals slow users down; undo toasts allow users to work uninterrupted while providing safe reversibility.
4. **URL State Synchronization**:
   - *Decision*: Managing filter and pagination state in URL search parameters rather than local component state.
   - *Reasoning*: Direct URL sharing, refreshing without losing filter context, and native browser history traversal.

---

## 🚀 Setup & Getting Started

### Prerequisites
- Node.js (v18.17+ or v20+)
- npm or pnpm

### Installation
```bash
# Clone repository and enter directory
cd fitplan

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Running Unit Tests
```bash
npm test
```

### Production Build
```bash
npm run build
npm start
```

---

## ✅ Feature Checklist

| Requirement | Status | Implementation Details |
|---|---|---|
| **Next.js App Router + TypeScript (strict)** | ✅ Complete | Zero `any`, strict type checking on all models and API calls |
| **Tailwind CSS + Dark Mode** | ✅ Complete | CSS variable tokens, persisted theme toggle, fitness accent colors |
| **TanStack Query State** | ✅ Complete | Queries, mutations, cache invalidation, optimistic updates |
| **React Hook Form + Zod** | ✅ Complete | Reusable `TaskForm`, inline accessible errors, custom constraints |
| **Recharts Visualizations** | ✅ Complete | Donut breakdown chart & 7-day completion trend area chart |
| **Mock API with Latency & Errors** | ✅ Complete | 300–800ms delay, ~10% failure simulation (toggable live via UI) |
| **Domain Model & 28 Seed Tasks** | ✅ Complete | Realistic fitness categories, priorities, durations, overdue tasks |
| **Dashboard** | ✅ Complete | 4 Stat cards, Donut chart, Trend chart, Consistency streak, Due soon list |
| **Full CRUD** | ✅ Complete | Create, Read, Update, Delete with optimistic rollback |
| **Task Listing & Filters** | ✅ Complete | Debounced search, category, priority, status, sort, pagination |
| **URL Query Param Sync** | ✅ Complete | Shareable views, browser back/forward buttons functional |
| **Task Details (/tasks/[id])** | ✅ Complete | Info, quick status switcher, metrics, activity timeline |
| **Responsive Design** | ✅ Complete | Desktop sidebar, collapsible tablet view, mobile bottom navigation, table-to-card transformation |
| **UI States** | ✅ Complete | Skeletons, Error state with retry, Empty state with CTA, Toasts |
| **Non-blocking Undo Delete** | ✅ Complete | 7s toast undo replaces confirm dialog |
| **Smart Quick-Add (NLP)** | ✅ Complete | Pure function parser (`nlParser.ts`) + live preview |
| **Command Palette (Ctrl+K)** | ✅ Complete | Quick actions, task search, theme switcher |
| **Vitest Tests** | ✅ Complete | 16 unit tests for NL parser, Zod schemas, and date utils |

