# Vami — Monorepo Platform

A custom-designed developer content platform with robust atomic design tokens, serverless caching, database migration tooling, and automated pipelines setup.

## 🔒 Authentication Flow (Week 5 Implementation)

Vami implements a passwordless **Magic Link** authentication and **OAuth** (Google/GitHub) system:

- **Session Tokens**: Access tokens are kept strictly in-memory (Zustand store) to mitigate XSS risks, and rotated using a long-lived, secure HTTP-only cookie refresh session.
- **Client Routing**: Protected routes are guarded via `<ProtectedRoute>` checking context state and executing silent token-refresh handshakes on startup.
- **Developer Debugging**:
  - Visit `/login` to request magic links (check caught emails at MailHog: http://localhost:8025).
  - Visit `/dev-sandbox` for low-level manual testing of backend endpoints.

---

## 👤 User Profile System & Follows (Week 6 Implementation)

Vami implements a flexible profile management and social networking system:

- **Profile Customization**: Users can edit their display name, biography, website URL, and upload custom avatars.
- **Avatar Media Uploader**: Features direct-to-Cloudinary signed uploads. If Cloudinary credentials are not configured, it gracefully falls back to a developer mockup upload returning auto-generated SVG avatars.
- **Account Privacy**: Users can choose to set their profiles as private. Private accounts place a content lock guarding their articles feed from non-followers.
- **Follow Request Workflow**:
  - Following a **public** profile immediately establishes an `accepted` follow relationship.
  - Following a **private** profile initiates a `pending` request, which the target user can review, accept, or reject via their Dashboard's Follow Requests tab.

---

## 🎨 Atom Component Library (Week 7 Implementation)

Vami implements a pure presentational UI layout, typography, and interactive atomic layer under `apps/web/src/components/atoms/`:

- **Typography Atoms**: `VamiText`, `VamiHeading` (standardizes levels H1–H6), `VamiCaption`, `VamiLabel`, and `VamiCode` map directly to design token text utilities.
- **Interactive Atoms**:
  - `VamiButton` and `VamiIconButton` map styles to tokens, support loading spinners, and enforce accessibility by issuing development-mode console warnings if `aria-label` or `aria-labelledby` attributes are missing on icon-only elements.
  - `VamiLink` is polymorphic: it automatically detects external targets (commencing with `http`, `mailto:`, `tel:`) to render standard anchor tags with `target="_blank" rel="noreferrer"` security settings, and routes internal links via `react-router-dom`'s `<Link>`.
- **Layout & Structure Atoms**: `VamiBox`, `VamiStack`, `VamiRow`, and `VamiGrid` use dynamic CSS custom property styles (e.g. `var(--space-[value])`) connected to `tokens.css` spacing metrics to prevent static class bloated layouts.

---

## 🧩 Atom Component Library (Part 2) & Core Molecules (Week 8 Implementation)

Vami implements the remaining form/visual atoms (`apps/web/src/components/atoms/`) and structured layout molecules (`apps/web/src/components/molecules/`):

- **Extended Form Atoms**: `VamiInput` and `VamiTextarea` (with content-driven auto-resizing height) enforce WCAG AA accessibility. `VamiCheckbox`, `VamiRadio`/`VamiRadioGroup`, and `VamiSwitch` provide custom toggle UI states.
- **Custom Accessible Dropdown**: `VamiSelect` implements a fully keyboard-accessible listbox (`combobox` role) that syncs value changes to a hidden standard `<select>` element for form submissions.
- **Visual Utility Atoms**: `VamiBadge`, `VamiTag` (with dismiss triggers), `VamiProgressBar`, `VamiSpinner`, `VamiSkeleton` (pulsing text/circle placeholders), `VamiImage` (broken source fallbacks), and `VamiFileUpload` (drag-and-drop handles) map directly to styling tokens.
- **Self-Contained Icons**: `VamiIcon` houses a dictionary of 21 inline vector SVG elements, preventing layout asset resolution issues.
- **Core Assembly Molecules**:
  - `FormField` links input controls with labels, validation errors, and helper text.
  - `SearchBox` combines search triggers with input reset button nodes.
  - `Toast` popups manage notifications dynamically via `toastStore` (Zustand state manager) and a `<ToastContainer />` viewport stack.
  - `AlertBanner`, `EmptyState`, `ReadTimeDisplay` (clock estimates), and `AuthorByline` (author meta info header blocks).

---

## ⚙️ API Infrastructure (Week 9 Implementation)

Vami implements a standardized, high-performance API infrastructure under `apps/api/src/`:

- **Structured JSON Logging**: Centralized `pino` high-performance logger logging all request transactions, response statuses, and errors.
- **Request Identification**: Custom middleware injecting a unique client/server-generated transaction ID (`req_` prefix) into the `X-Request-Id` response header.
- **Standardized Error Handling**: An Express `errorHandler` intercepting bubbled errors and formatting them into the exact Section D.5 Blueprint shape, while hiding stack traces in non-development modes.
- **Zod Validation Middleware**: Offloads schema body/query/params validation to the routing layer via `validate.js` middleware, returning clean `ValidationError` objects.
- **Rate Limit Optimization**: Refactored the Redis/memory-fallback rate limiter to delegate error response handling to the global error formatter.
- **Concurrency Grace Period**: Integrated Redis-based grace checks into refresh token rotation, resolving concurrent silent refresh calls from double renders or browser tab refreshes without logging users out.
- **Detailed Health Check Probe**: Mounted a unified detailed health check on `/health` reporting Postgres pool status, Redis status, uptime, memory, CPU, and platform metadata.

---

## 📱 Application Shell & Navigation (Week 10 Implementation)

Vami implements a responsive application shell, persistent theming, layout templates, and routing setup:

- **System-Aware Theme Management**: Persists theme selections (`light`, `dark`, `system`) inside a global `ThemeContext` and `localStorage`, automatically listening and adapting to OS theme changes via CSS media queries and the `data-theme` variable hierarchy.
- **Responsive Navigation Controls**:
  - `TopNavigation` features a custom brand logo SVG mark, search routing box integration, creator write triggers, and user profile menus.
  - Features smart visibility tracking, hiding the navigation bar when users scroll down and sliding it back in on scroll-up.
  - `MobileNavDrawer` opens a drawer for navigation links and integrates theme mode selectors.
- **Layout Templates**: Encapsulates layouts into `PublicPageTemplate`, `AuthenticatedTemplate`, and `ErrorTemplate` wrappers.
- **Scalable Dynamic Routing**: Routes are defined in a clean, isolated array config `routesConfig.jsx`. Maps routes dynamically, enabling easy updates and scaling to 500+ routes with lazy loading and `<Suspense>` loaders.
- **Routing Side Effects & Recovery**:
  - `ScrollRestoration` resets scroll coordinates to `(0, 0)` on path transitions.
  - `TitleManager` dynamically maps route configurations to window title tags.
  - `ErrorBoundary` catches unexpected render crashes to present a beautiful, dev-friendly `ServerError` (500) fallback screen.

---

## 📁 Repository Architecture

This codebase is configured as a `pnpm` workspace monorepo:

```
vami/
├── apps/
│   ├── web/                    # React 19 + Vite client frontend
│   └── api/                    # Node.js + Express backend service
├── packages/
│   ├── config/                 # Shared base configs (ESLint, Prettier, Jest)
│   └── utils/                  # Shared pure utility modules
├── docs/
│   ├── design-system/          # Design tokens & color schemas guidelines
│   └── onboarding/             # Step-by-step local environments guides
└── scripts/
    ├── setup.sh                # Automation script checking dependencies
    └── seed-dev.js             # Mock records database seeding script
```

---

## ⚙️ Prerequisites & Installation

1. **Node.js**: Install version `20.11.0` (indicated in `.nvmrc`).
2. **pnpm**: Install package manager `9.1.0`.
3. **Docker Desktop**: Required to launch postgres, redis, meilisearch, and mailhog services.

Run the setup configuration script:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

---

## 🚀 Running Local Environment

### 1. Launch Docker Databases Tiers:

```bash
pnpm services:up
```

This brings up:

- **Postgres 16 + pgvector** (port `5432`)
- **Redis 7.2** (port `6379`)
- **Meilisearch 1.7** (port `7700`)
- **MailHog SMTP Server** (SMTP port `1025`, Web UI dashboard http://localhost:8025)

To shut down databases:

```bash
pnpm services:down
```

### 2. Run Database Migrations:

Apply database schemas:

```bash
pnpm db:migrate
```

Populate developer seed records:

```bash
pnpm db:seed
```

To reverse migrations:

```bash
pnpm db:rollback
```

### 3. Launch Development Servers:

```bash
pnpm dev
```

- Web page client: http://localhost:5173
- API backend server: http://localhost:3000

---

## 🧪 Testing and Formatting

Run the unit and components tests:

- **Frontend (Vitest)**: `pnpm --filter web test`
- **Backend (Jest)**: `pnpm --filter api test`

Verify code styling and rulesets:

- **Linter scan**: `pnpm lint`
- **Prettier formatting check**: `pnpm format:check`
- **Auto format**: `pnpm format`
