# VAMI — Master Engineering Blueprint

## From Zero to Production: Complete Execution Manual for 3 Full-Stack Developers

**Classification:** Internal Engineering Document — v1.0
**Status:** Authoritative. No deviation without documented decision record.
**Audience:** Dev 1 (Full-Stack Lead), Dev 2 (Frontend Lead), Dev 3 (Full-Stack / AI)

---

# TABLE OF CONTENTS

```
SECTION A  →  Project Governance & Team Protocol
SECTION B  →  Environment & Toolchain Setup
SECTION C  →  Repository Architecture & Branch Strategy
SECTION D  →  Engineering Standards & Code Conventions
SECTION E  →  Design System Specification (Atomic)
SECTION F  →  Infrastructure & Free-Tier Stack
SECTION G  →  Database Architecture
SECTION H  →  API Architecture
SECTION I  →  CI/CD Pipeline
SECTION J  →  Phase-by-Phase Weekly Implementation Plan (52 Weeks)
SECTION K  →  Testing Framework
SECTION L  →  Security Framework
SECTION M  →  Deployment Strategy
SECTION N  →  Launch Protocol & Checklist
```

---

# SECTION A — PROJECT GOVERNANCE & TEAM PROTOCOL

## A.1 Team Structure & Permanent Role Assignment

Every ambiguity in a 3-person team becomes a bottleneck. Roles are permanent until explicitly renegotiated in a documented decision record.

```
┌─────────────────────────────────────────────────────────────────┐
│  DEV 1 — Full-Stack Lead / Architect / DevOps Owner             │
│  Primary: Backend API, Database, Infrastructure, Auth           │
│  Secondary: Code review gatekeeper, Architecture decisions      │
│  Owns: apps/api/, packages/config/, .github/, database/         │
│  Accountability: System stability, API contracts, security      │
├─────────────────────────────────────────────────────────────────┤
│  DEV 2 — Frontend Lead / Design System Owner                    │
│  Primary: React app, Design system, Editor, UI components       │
│  Secondary: Accessibility, Performance, Mobile-responsiveness   │
│  Owns: apps/web/, packages/ui/, docs/design-system/             │
│  Accountability: UI quality, design fidelity, frontend perf     │
├─────────────────────────────────────────────────────────────────┤
│  DEV 3 — Full-Stack / AI & Integration Owner                    │
│  Primary: AI features, Search, Feed algorithm, Integrations     │
│  Secondary: End-to-end feature ownership, Testing               │
│  Owns: packages/utils/, AI service layer, test suites           │
│  Accountability: Feature completeness, integration quality      │
└─────────────────────────────────────────────────────────────────┘
```

## A.2 Decision-Making Framework

Three tiers of decisions. Every decision lives in `docs/decisions/ADR-[NNN]-[title].md`.

**Tier 1 — Autonomous (No approval needed):**
Implementation detail within owned domain. Must document if it deviates from established pattern. Example: Dev 2 choosing a specific CSS approach for a new atom component.

**Tier 2 — Consult (1 other dev must be aware before execution):**
Anything that crosses ownership boundaries. Any new dependency added. Any database schema change. Any API contract change. Async notification via agreed channel is sufficient.

**Tier 3 — Consent (All 3 devs must explicitly approve before execution):**
Architecture changes. New external service. Infrastructure cost increases. Security-related changes. Branch rule modifications. Any decision that cannot be reversed in under 2 hours.

## A.3 Communication Protocol

```
Async (primary):     GitHub Issues, PR comments, ADR documents
Sync (max 3x/week):  30-minute standup — blockers only, no status theater
Weekly (Fridays):    60-minute sprint close — demo, retrospective, next week plan
Emergency:           Direct message — response within 2 hours during work hours
```

**Standup Format (strictly enforced):**

1. What shipped since last standup (link to PR or commit)
2. What is blocked (specific, actionable)
3. What ships before next standup (specific deliverable)

No opinions in standup. Opinions go in Issues with a label.

## A.4 Definition of Done (DoD)

A task is done when ALL of the following are true. No exceptions.

```
□  Feature works as specified in the acceptance criteria
□  JSDoc comments on all exported functions and components
□  Unit tests written (minimum 1 happy path, 1 edge case)
□  No console.error or console.warn introduced
□  No new ESLint warnings (zero tolerance)
□  PR reviewed and approved by at least 1 other dev
□  Branch merged via squash merge only
□  PR description contains: What, Why, How, Screenshots (if UI)
□  Linked GitHub Issue closed
□  No hardcoded values (all env vars or constants)
□  Mobile-responsive (tested at 375px, 768px, 1280px)
□  WCAG AA accessible (keyboard nav, ARIA, contrast)
```

---

# SECTION B — ENVIRONMENT & TOOLCHAIN SETUP

## B.1 Local Machine Prerequisites

Every developer must have identical tool versions. No exceptions. Deviations cause "works on my machine" bugs that cost hours.

**Required Installations (in order):**

```
Step 1:  Install nvm (Node Version Manager)
         macOS/Linux: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
         Windows:     Install nvm-windows from GitHub releases

Step 2:  Install Node.js via nvm
         nvm install 20.11.0
         nvm use 20.11.0
         nvm alias default 20.11.0
         Verify: node --version → must print v20.11.0

Step 3:  Install pnpm (package manager — faster than npm, better monorepo support)
         npm install -g pnpm@9.1.0
         Verify: pnpm --version → must print 9.1.0

Step 4:  Install Git
         Version required: 2.43.0 or higher
         Verify: git --version

Step 5:  Install GitHub CLI
         https://cli.github.com/
         Verify: gh --version

Step 6:  Install Docker Desktop
         https://docs.docker.com/get-docker/
         Required for: local PostgreSQL, Redis, Meilisearch
         Verify: docker --version && docker compose version

Step 7:  Install VS Code (strongly recommended, enforced extensions below)

Step 8:  Configure Git identity (each developer uses their own)
         git config --global user.name "Your Full Name"
         git config --global user.email "your@email.com"
         git config --global core.autocrlf false    (Windows: input)
         git config --global pull.rebase true
         git config --global init.defaultBranch main
```

## B.2 VS Code Configuration (Mandatory)

Every developer installs these extensions. Non-negotiable. They enforce standards automatically.

**Required Extensions:**

```
ESLint                    → dbaeumer.vscode-eslint
Prettier                  → esbenp.prettier-vscode
GitLens                   → eamodio.gitlens
Better Comments           → aaron-bond.better-comments
Auto Rename Tag           → formulahendry.auto-rename-tag
Path Intellisense         → christian-kohler.path-intellisense
Import Cost               → wix.vscode-import-cost
Error Lens                → usernamehakobyan.errorlens
Thunder Client            → rangav.vscode-thunder-client
Docker                    → ms-azuretools.vscode-docker
PostgreSQL (by Chris Kolkman) → ckolkman.vscode-postgres
```

**Workspace Settings** (stored in `.vscode/settings.json` — committed to repo):

```
Format on save: enabled
Default formatter: Prettier
ESLint validation: enabled for javascript, javascriptreact
Tab size: 2 spaces
End of line: LF (Unix)
Trim trailing whitespace: true
Insert final newline: true
```

## B.3 Local Development Services (Docker)

All developers run identical local services via Docker Compose. No "I use a cloud DB for local dev" — that introduces flakiness and costs money.

**Services in `docker-compose.dev.yml`:**

```
PostgreSQL 16        → Port 5432   (primary database)
Redis 7.2            → Port 6379   (cache, sessions, queues)
Meilisearch 1.7      → Port 7700   (search engine)
MailHog              → Port 1025 (SMTP), 8025 (web UI) (local email capture)
```

**One command to start all local services:**

```
pnpm services:up     (defined in root package.json scripts)
```

---

# SECTION C — REPOSITORY ARCHITECTURE & BRANCH STRATEGY

## C.1 Monorepo Structure

```
vami/
├── apps/
│   ├── web/                        React 19 + Vite (Frontend)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── atoms/              Design system atoms
│   │   │   ├── molecules/          Design system molecules
│   │   │   ├── organisms/          Design system organisms
│   │   │   ├── templates/          Page templates
│   │   │   ├── pages/              Route-level page components
│   │   │   ├── features/           Feature-specific modules
│   │   │   │   ├── auth/
│   │   │   │   ├── editor/
│   │   │   │   ├── feed/
│   │   │   │   ├── article/
│   │   │   │   ├── profile/
│   │   │   │   ├── search/
│   │   │   │   ├── analytics/
│   │   │   │   ├── monetization/
│   │   │   │   ├── community/
│   │   │   │   └── ai/
│   │   │   ├── hooks/              Shared React hooks
│   │   │   ├── contexts/           React contexts
│   │   │   ├── services/           API client layer
│   │   │   ├── stores/             Zustand stores
│   │   │   ├── lib/                Third-party wrappers
│   │   │   ├── styles/             Global styles, tokens
│   │   │   ├── constants/          App-wide constants
│   │   │   └── utils/              Frontend-specific utilities
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── api/                        Node.js + Express (Backend)
│       ├── src/
│       │   ├── config/             App configuration
│       │   ├── middleware/         Express middleware
│       │   ├── routes/             Route definitions
│       │   ├── controllers/        Request handlers
│       │   ├── services/           Business logic layer
│       │   ├── repositories/       Database access layer
│       │   ├── models/             Data models (not ORM, plain objects)
│       │   ├── validators/         Request validation schemas (Zod)
│       │   ├── jobs/               Background jobs (BullMQ)
│       │   ├── events/             Event emitters and handlers
│       │   ├── ai/                 AI service integrations
│       │   ├── lib/                Third-party client wrappers
│       │   └── utils/              Backend-specific utilities
│       ├── database/
│       │   ├── migrations/         SQL migration files
│       │   ├── seeds/              Development seed data
│       │   └── schema.sql          Current full schema snapshot
│       ├── .env.example
│       └── package.json
│
├── packages/
│   ├── ui/                         Shared UI primitives (if needed cross-app)
│   ├── config/                     Shared ESLint, Prettier, Jest configs
│   │   ├── eslint-base.js
│   │   ├── prettier.js
│   │   └── jest.base.js
│   └── utils/                      Shared pure utility functions
│       ├── src/
│       │   ├── validation.js
│       │   ├── formatting.js
│       │   ├── date.js
│       │   └── string.js
│       └── package.json
│
├── docs/
│   ├── decisions/                  Architecture Decision Records (ADRs)
│   ├── api/                        API documentation
│   ├── design-system/              Design system documentation
│   ├── runbooks/                   Operational runbooks
│   └── onboarding/                 New developer guide
│
├── scripts/
│   ├── setup.sh                    One-command local setup
│   ├── seed-dev.js                 Seed development database
│   └── generate-types.js           JSDoc type generation helpers
│
├── .github/
│   ├── workflows/
│   │   ├── ci-web.yml              Frontend CI
│   │   ├── ci-api.yml              Backend CI
│   │   ├── deploy-staging.yml      Staging deploy
│   │   ├── deploy-production.yml   Production deploy
│   │   └── security-scan.yml      Weekly security scan
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── task.md
│   └── CODEOWNERS
│
├── .gitignore
├── .gitattributes
├── .nvmrc                          Contains: 20.11.0
├── pnpm-workspace.yaml
├── package.json                    Root (scripts only, no dependencies)
└── README.md
```

## C.2 Branch Strategy

**Five permanent branch tiers. Memorize these. Never deviate.**

```
TIER 1 — PRODUCTION
Branch:  main
Purpose: Represents exactly what is live in production
Rules:   - Never commit directly
         - Requires PR from release/* branch only
         - Requires 2 approvals (both other devs)
         - All status checks must pass
         - No force push ever
         - No deletion ever
         - Auto-deploys to production environment on merge

TIER 2 — INTEGRATION
Branch:  develop
Purpose: Integration of all completed features; always deployable
Rules:   - Never commit directly
         - Requires PR from feat/*, fix/*, chore/*, docs/*
         - Requires 1 approval (any other dev)
         - All status checks must pass
         - No force push
         - Auto-deploys to development environment on merge

TIER 3 — STAGING
Branch:  staging
Purpose: Pre-production validation; mirrors production infra
Rules:   - Created from develop when sprint closes
         - Only hotfix/* branches can merge directly
         - Requires 1 approval
         - Auto-deploys to staging environment
         - Deleted and recreated each sprint

TIER 4 — RELEASE
Branch:  release/v[MAJOR].[MINOR].[PATCH]
Purpose: Release preparation; only version bump and critical fixes
Rules:   - Created from develop when ready to ship
         - Only release commits (version bump, changelog)
         - Merges into both main AND develop
         - Tagged: git tag v[version] on main after merge
         - Deleted after merge

TIER 5 — WORKING BRANCHES (created by developers, merged, deleted)
Prefixes and naming conventions:

  feat/[issue-number]-[2-4-word-description]
  fix/[issue-number]-[2-4-word-description]
  hotfix/[issue-number]-[2-4-word-description]
  chore/[2-4-word-description]
  docs/[2-4-word-description]
  refactor/[issue-number]-[2-4-word-description]
  perf/[issue-number]-[2-4-word-description]
  test/[issue-number]-[2-4-word-description]

NAMING RULES:
  - All lowercase
  - Hyphens only (no underscores, no spaces)
  - Max 50 characters total
  - Issue number mandatory for feat, fix, hotfix, refactor
  - Description is imperative mood (add, implement, fix — not added, implementing)

EXAMPLES (valid):
  feat/42-add-article-bookmarking
  fix/87-resolve-auth-token-expiry
  hotfix/101-fix-stripe-webhook-signature
  chore/update-dependencies
  docs/add-api-authentication-guide
  refactor/33-extract-feed-service
  perf/55-optimize-article-query

EXAMPLES (invalid — do not use):
  feature/bookmarks          ← wrong prefix
  feat/add-bookmarks         ← missing issue number
  feat/42-Adding-Bookmarks   ← uppercase, wrong tense
  Dev1-bookmarks             ← person's name in branch
```

## C.3 Branch Lifecycle (step by step)

**Creating a feature branch (mandatory sequence):**

```
Step 1:  Ensure develop is up to date
         git checkout develop
         git pull origin develop

Step 2:  Create working branch from develop
         git checkout -b feat/[issue-number]-[description]

Step 3:  Set upstream immediately
         git push -u origin feat/[issue-number]-[description]

Step 4:  Work, commit using convention (see C.4)

Step 5:  Before creating PR, sync with develop
         git fetch origin
         git rebase origin/develop
         Resolve conflicts locally, never in GitHub UI

Step 6:  Push updated branch
         git push origin feat/[issue-number]-[description] --force-with-lease
         (--force-with-lease is safe; never use --force alone)

Step 7:  Open PR using template
         gh pr create --template .github/PULL_REQUEST_TEMPLATE.md

Step 8:  After merge, delete branch
         git branch -d feat/[issue-number]-[description]
         git push origin --delete feat/[issue-number]-[description]
```

## C.4 Commit Message Convention

**Every commit follows Conventional Commits specification v1.0.0. No exceptions.**

**Format:**

```
<type>(<scope>): <subject>
<blank line>
<body>
<blank line>
<footer>
```

**Type Reference:**

```
feat     → New feature for the user (triggers MINOR version bump)
fix      → Bug fix for the user (triggers PATCH version bump)
docs     → Documentation changes only
style    → Formatting, missing semicolons — no logic change
refactor → Code restructure — no feature change, no bug fix
perf     → Performance improvement
test     → Adding or correcting tests
chore    → Build process, dependency update, tooling
ci       → CI/CD configuration changes
revert   → Reverting a previous commit
```

**Scope Reference (use these exact strings):**

```
auth        → Authentication system
users       → User profiles
articles    → Article CRUD
editor      → Writing editor
feed        → Content feed
search      → Search functionality
ai          → AI features
payments    → Stripe, subscriptions, earnings
email       → Email delivery
analytics   → Analytics tracking
community   → Circles, comments, reactions
media       → Image/file upload
notifications → Notification system
api         → API gateway, routing
db          → Database, migrations
infra       → Infrastructure, Docker
ci          → CI/CD pipelines
ui          → Design system components
deps        → Dependency updates
```

**Subject Rules:**

```
- Imperative mood: "add", not "added" or "adds"
- No capital first letter
- No period at end
- Maximum 72 characters total (type + scope + subject)
- Describes WHAT changed, not HOW
```

**Body Rules:**

```
- Wrap at 100 characters
- Explains WHY the change was made
- Explains WHAT the problem was before
- Not required for trivial commits
```

**Footer Rules:**

```
- Closes #[issue-number] → auto-closes linked GitHub issue
- BREAKING CHANGE: [description] → triggers MAJOR version bump
- Co-authored-by: Name <email> → for pair programming
```

**Complete Examples (study these):**

Good commit — minimal:

```
fix(auth): resolve jwt refresh token not persisting on mobile
```

Good commit — with body:

```
feat(editor): add slash command palette for block insertion

Writers previously had to reach for toolbar buttons to insert new
blocks. This caused constant context switching during writing flow.
The slash command palette (triggered by /) allows keyboard-native
block insertion matching the Notion-style UX writers expect.

Supported blocks: paragraph, heading 1-3, image, code, quote,
divider, numbered list, bulleted list, embed.

Closes #42
```

Good commit — with breaking change:

```
refactor(api): restructure article response schema

Remove deprecated 'clap_count' field and rename 'read_time'
to 'read_time_minutes' for clarity.

BREAKING CHANGE: API consumers must update field references.
'clap_count' is removed. 'read_time' is now 'read_time_minutes'.

Closes #78
```

Bad commits (never do these):

```
"fixed bug"              ← not conventional, no scope, no type
"WIP"                    ← never commit WIP to shared branches
"update"                 ← meaningless
"dev1 changes"           ← personal name
"asdfgh"                 ← not a commit message
"fix the thing"          ← vague
```

## C.5 GitHub Repository Setup (Step by Step)

**Initial repository creation:**

```
Step 1:  Create GitHub organization account: github.com/orgs/new
         Organization name: vami-platform
         Plan: Free

Step 2:  Create repository
         Name: vami
         Visibility: Private
         Initialize: No (we push from local)
         License: Proprietary (no license file yet)

Step 3:  Clone locally
         git clone git@github.com:vami-platform/vami.git
         cd vami

Step 4:  Initialize monorepo structure
         (Dev 1 executes this, commits with: chore: initialize monorepo structure)

Step 5:  Add all team members as repository collaborators
         Role: Maintainer for all 3 devs
```

## C.6 GitHub Branch Protection Rules

**Configure in:** Repository → Settings → Branches → Branch protection rules

**Rule 1: Protect `main`**

```
Pattern: main
Settings:
  ✓ Require a pull request before merging
    ✓ Required approvals: 2
    ✓ Dismiss stale PR approvals when new commits pushed
    ✓ Require review from Code Owners
  ✓ Require status checks to pass before merging
    Required checks:
      - ci-web / lint
      - ci-web / test
      - ci-web / build
      - ci-api / lint
      - ci-api / test
      - ci-api / build
  ✓ Require branches to be up to date before merging
  ✓ Require conversation resolution before merging
  ✓ Do not allow bypassing the above settings
  ✓ Restrict who can push to matching branches
    → Allow: (no one — PRs only)
  ✓ Allow force pushes: NEVER
  ✓ Allow deletions: NEVER
```

**Rule 2: Protect `develop`**

```
Pattern: develop
Settings:
  ✓ Require a pull request before merging
    ✓ Required approvals: 1
    ✓ Dismiss stale PR approvals when new commits pushed
  ✓ Require status checks to pass before merging
    Required checks:
      - ci-web / lint
      - ci-web / test
      - ci-api / lint
      - ci-api / test
  ✓ Require branches to be up to date before merging
  ✓ Require conversation resolution before merging
  ✓ Allow force pushes: NEVER
  ✓ Allow deletions: NEVER
```

**Rule 3: Protect `staging`**

```
Pattern: staging
Settings:
  ✓ Require a pull request before merging
    ✓ Required approvals: 1
  ✓ Require status checks to pass before merging
  ✓ Allow force pushes: NEVER
```

## C.7 CODEOWNERS File

`.github/CODEOWNERS`:

```
# Global fallback — any unowned file requires Dev 1 approval
*                               @vami-platform/dev1

# Frontend — Dev 2 is required reviewer
apps/web/                       @vami-platform/dev2
packages/ui/                    @vami-platform/dev2

# Backend — Dev 1 is required reviewer
apps/api/                       @vami-platform/dev1
apps/api/database/              @vami-platform/dev1

# AI features — Dev 3 is required reviewer
apps/api/src/ai/                @vami-platform/dev3
apps/web/src/features/ai/       @vami-platform/dev3

# Shared config — all must approve
packages/config/                @vami-platform/dev1 @vami-platform/dev2 @vami-platform/dev3
.github/                        @vami-platform/dev1
```

## C.8 Pull Request Template

`.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Summary

<!-- One paragraph. What does this PR do? -->

## Motivation

<!-- Why is this change needed? What problem does it solve? Link the issue. -->

Closes #[issue-number]

## Changes Made

## <!-- Bullet list of specific changes. Be precise. -->

-
-

## Type of Change

- [ ] New feature (non-breaking)
- [ ] Bug fix (non-breaking)
- [ ] Breaking change (requires migration or version bump)
- [ ] Refactor (no behavior change)
- [ ] Documentation
- [ ] Infrastructure / CI

## Testing Done

<!-- How was this tested? Be specific. What did you manually verify? -->

- [ ] Unit tests added/updated
- [ ] Manually tested locally
- [ ] Tested on mobile (375px)
- [ ] Tested in dark mode

## Screenshots / Videos

<!-- Required for any UI change. Before/After format. -->

## Definition of Done Checklist

- [ ] JSDoc on all exported functions
- [ ] No console.error / console.warn added
- [ ] No hardcoded values
- [ ] ESLint passes with zero warnings
- [ ] Accessible (keyboard navigation, ARIA)
- [ ] Mobile responsive

## Notes for Reviewer

<!-- Anything specific to look at? Known limitations? Follow-up tickets needed? -->
```

---

# SECTION D — ENGINEERING STANDARDS & CODE CONVENTIONS

## D.1 JavaScript & JSDoc Standards

**Language: JavaScript (ES2022+). Absolutely no TypeScript.** Type safety is achieved exclusively through JSDoc annotations and runtime validation (Zod). This is a deliberate constraint — three developers moving fast do not need the TypeScript compilation overhead.

**JSDoc Standards — Every exported function, component, and class requires:**

**Function documentation format:**

```
Required tags:
  @param   → Every parameter, with type and description
  @returns → Return value type and description
  @throws  → If function throws (what condition, what error)
  @example → At least one usage example

Recommended tags:
  @since   → Version or date added
  @deprecated → If being phased out, what replaces it
```

**Type definition format:**

```
For complex objects, define @typedef at top of file:
  @typedef {Object} TypeName
  @property {string} propertyName - Description

For function types:
  @callback CallbackName
  @param {type} paramName - Description
  @returns {type}
```

**Component documentation format (React):**

```
Required tags:
  @component
  @param {ComponentProps} props
  @returns {JSX.Element}
  @example (with JSX usage)
```

## D.2 SOLID Principles — Application Guide

**Single Responsibility Principle:**
Every file does exactly one thing. A service file orchestrates business logic and nothing else. A repository file handles data access and nothing else. A component renders UI and nothing else. A hook manages state/effects for one concern.

Violation signal: A file has imports from more than 3 different architectural layers.

**Open/Closed Principle:**
New features extend existing modules rather than modifying them. Achieve through: plugin patterns for the editor, strategy patterns for AI providers, factory patterns for email providers. Never modify a working module to add a new variant — extend it.

**Liskov Substitution Principle:**
All service implementations satisfy the same interface contract. The AI service accepts any provider (Anthropic, OpenAI) that satisfies the provider interface. The email service accepts any provider (Resend, Postmark) that satisfies the email interface. Switching providers requires zero changes to calling code.

**Interface Segregation Principle:**
No service exposes methods its consumers do not use. The Article repository exposes only the queries actually needed — nothing more. Create separate focused repositories rather than one god repository with 50 methods.

**Dependency Inversion Principle:**
High-level modules (controllers, services) depend on abstractions (repository interfaces, service interfaces). Low-level modules (actual database queries, API calls) implement those abstractions. Inject dependencies — never instantiate dependencies inside a function.

## D.3 Module & Import Standards

**Import order (ESLint enforced):**

```
Group 1: Node.js built-ins
  import path from 'path'
  import crypto from 'crypto'

Group 2: External packages
  import express from 'express'
  import { z } from 'zod'

Group 3: Internal packages (monorepo)
  import { formatDate } from '@vami/utils'

Group 4: Internal absolute (app-level)
  import { articleRepository } from '~/repositories/article'
  import { logger } from '~/lib/logger'

Group 5: Relative imports
  import { validateArticle } from './validators'
  import styles from './Article.module.css'
```

**Rules:**

- No default exports from utility/service files. Named exports only.
- Default exports only from React components and page-level modules.
- Barrel files (`index.js`) allowed only at feature boundary level, not within features.
- Path alias `~` resolves to `src/` directory in both apps.
- Never use `../../../` more than 2 levels. If you need more, you have an architecture problem.

## D.4 Naming Conventions

```
FILES & FOLDERS:
  React components:        PascalCase.jsx         (ArticleCard.jsx)
  React hooks:             camelCase.js           (useArticleData.js)
  Utilities / Services:    camelCase.js           (articleService.js)
  Constants:               SCREAMING_SNAKE_CASE.js (APP_CONSTANTS.js)
  CSS Modules:             PascalCase.module.css  (ArticleCard.module.css)
  Test files:              [filename].test.js     (articleService.test.js)
  Migration files:         [timestamp]-[description].sql

VARIABLES & FUNCTIONS:
  Variables:               camelCase              (articleSlug)
  Functions:               camelCase              (getArticleBySlug)
  Constants:               SCREAMING_SNAKE_CASE   (MAX_ARTICLE_LENGTH)
  React components:        PascalCase             (ArticleCard)
  Custom hooks:            usePascalCase          (useArticleData)
  Event handlers:          handle[Event]:         (handleSubmit, handleKeyDown)
  Boolean variables:       is/has/can/should      (isLoading, hasError, canEdit)
  Async functions:         verb + noun            (fetchArticle, createSubscription)

DATABASE:
  Table names:             snake_case plural      (articles, reading_events)
  Column names:            snake_case             (created_at, author_id)
  Index names:             idx_[table]_[column]   (idx_articles_author_id)
  Foreign key names:       fk_[table]_[ref_table] (fk_articles_users)

API ENDPOINTS:
  Resources:               kebab-case plural      (/api/articles, /api/reading-events)
  Actions on resources:    POST /articles/:id/publish
  Query params:            camelCase              (?readTime=5&sortBy=latest)
```

## D.5 Error Handling Standard

**Backend — Four error categories, each with a class:**

```
AppError        → Base class. All application errors extend this.
ValidationError → 400. Input validation failed. Includes field-level details.
AuthError       → 401/403. Authentication or authorization failure.
NotFoundError   → 404. Resource does not exist.
ConflictError   → 409. Duplicate resource or state conflict.
RateLimitError  → 429. Rate limit exceeded.
ExternalError   → 502/503. Downstream service failure (Stripe, AI API, email).
```

**Error response shape (all errors return this exact structure):**

```json
{
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "No article found with slug: example-article",
    "details": {},
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Frontend — Error handling layers:**

```
Layer 1: API client (catch network errors, normalize error shape)
Layer 2: React Query error boundaries (catch data fetching errors)
Layer 3: React Error Boundary components (catch render errors)
Layer 4: Global error state in Zustand (for cross-component errors)
```

**Never:**

- Catch an error and swallow it silently
- Return null when an error occurred (return error instead)
- Log raw error objects to production console
- Expose stack traces to API consumers

---

# SECTION E — DESIGN SYSTEM SPECIFICATION (ATOMIC DESIGN)

## E.1 Design System Philosophy

Every single UI element — every `div`, every `span`, every `a`, every `button` — is a named, documented, purposeful component. There are zero anonymous HTML elements in the application layer. Every pixel is intentional.

The design system lives in `apps/web/src/atoms/`, `molecules/`, `organisms/`, `templates/`. It has its own documentation. It has its own tests. It is treated as a product within the product.

**No third-party component libraries.** No MUI, no Shadcn (copied or imported), no Radix as a UI framework. Radix Primitives are allowed only for complex accessibility-critical interactions (modal focus trap, dropdown positioning) — they are behavior primitives, not UI components. All visual rendering is custom.

## E.2 Design Tokens

Design tokens are the foundation. Defined once in `apps/web/src/styles/tokens.css` as CSS custom properties. All components consume tokens — no hardcoded color, spacing, or font values anywhere.

**Token Categories:**

```
COLOR TOKENS:
  Brand:
    --color-ink-900          #1C1C1E    (primary text, primary CTA bg)
    --color-ink-800          #2C2C2E
    --color-ink-600          #48484A
    --color-ink-400          #636366
    --color-ink-200          #AEAEB2
    --color-ink-100          #C7C7CC
    --color-ink-050          #F2F2F7

  Amber (accent — use sparingly):
    --color-amber-500        #F5A623    (primary CTA, key highlights)
    --color-amber-400        #F7B84B
    --color-amber-100        #FEF3DC

  Surface:
    --color-surface-white    #FFFFFF
    --color-surface-warm     #F9F8F5    (page background)
    --color-surface-elevated #FFFFFF    (cards, modals)
    --color-surface-sunken   #F2F2F2    (code blocks, inputs)

  Semantic:
    --color-success-500      #4CAF50
    --color-success-100      #E8F5E9
    --color-error-500        #E57373
    --color-error-100        #FFEBEE
    --color-warning-500      #FF9800
    --color-warning-100      #FFF3E0
    --color-info-500         #2196F3
    --color-info-100         #E3F2FD

  Dark mode (applied via [data-theme="dark"] on html element):
    --color-surface-white    #1C1C1E
    --color-surface-warm     #1C1C1E
    --color-surface-elevated #2C2C2E
    --color-surface-sunken   #3A3A3C
    --color-ink-900          #FFFFFF
    (all ink tokens invert)

TYPOGRAPHY TOKENS:
  Font families:
    --font-reading           'Lora', Georgia, serif
    --font-ui                'Inter', -apple-system, sans-serif
    --font-mono              'JetBrains Mono', 'Fira Code', monospace

  Font sizes (rem-based, base 16px):
    --text-xs                0.75rem    (12px)
    --text-sm                0.875rem   (14px)
    --text-base              1rem       (16px)
    --text-lg                1.125rem   (18px)
    --text-xl                1.3125rem  (21px)   ← Article body size
    --text-2xl               1.5rem     (24px)
    --text-3xl               1.875rem   (30px)
    --text-4xl               2.25rem    (36px)
    --text-5xl               3rem       (48px)
    --text-6xl               3.75rem    (60px)

  Font weights:
    --weight-regular         400
    --weight-medium          500
    --weight-semibold        600
    --weight-bold            700
    --weight-extrabold       800

  Line heights:
    --leading-tight          1.25
    --leading-snug           1.375
    --leading-normal         1.5
    --leading-relaxed        1.625
    --leading-reading        1.6        ← Article body
    --leading-loose          1.8

  Letter spacing:
    --tracking-tight         -0.025em
    --tracking-normal        0
    --tracking-wide          0.025em
    --tracking-wider         0.05em

SPACING TOKENS (4px base grid):
    --space-0                0
    --space-1                0.25rem    (4px)
    --space-2                0.5rem     (8px)
    --space-3                0.75rem    (12px)
    --space-4                1rem       (16px)
    --space-5                1.25rem    (20px)
    --space-6                1.5rem     (24px)
    --space-8                2rem       (32px)
    --space-10               2.5rem     (40px)
    --space-12               3rem       (48px)
    --space-16               4rem       (64px)
    --space-20               5rem       (80px)
    --space-24               6rem       (96px)
    --space-32               8rem       (128px)

BORDER TOKENS:
    --radius-sm              4px
    --radius-md              8px
    --radius-lg              12px
    --radius-xl              16px
    --radius-2xl             24px
    --radius-full            9999px

    --border-width-thin      1px
    --border-width-base      1.5px
    --border-width-thick     2px

    --border-color-default   rgba(0,0,0,0.08)
    --border-color-strong    rgba(0,0,0,0.15)
    --border-color-focus     var(--color-amber-500)

SHADOW TOKENS:
    --shadow-xs              0 1px 2px rgba(0,0,0,0.05)
    --shadow-sm              0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
    --shadow-md              0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)
    --shadow-lg              0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
    --shadow-xl              0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)

TRANSITION TOKENS:
    --duration-fast          100ms
    --duration-base          200ms
    --duration-slow          300ms
    --duration-slower        500ms
    --ease-default           cubic-bezier(0.4, 0, 0.2, 1)
    --ease-in                cubic-bezier(0.4, 0, 1, 1)
    --ease-out               cubic-bezier(0, 0, 0.2, 1)

LAYOUT TOKENS:
    --max-width-article      660px      ← Article body max width
    --max-width-content      820px
    --max-width-page         1280px
    --header-height          64px
    --sidebar-width          280px
```

## E.3 Atomic Design Hierarchy

### Level 1: Atoms

The smallest possible UI unit. No business logic. Pure presentation.

**Complete Atom Inventory:**

```
Text Atoms:
  VamiText          → Renders text with font, size, weight, color variant props
  VamiHeading       → H1-H6 with size and weight variants
  VamiCaption       → Small descriptive text, consistent style
  VamiLabel         → Form labels, metadata labels
  VamiCode          → Inline code text (monospace, sunken bg)
  VamiKbd           → Keyboard shortcut display

Interactive Atoms:
  VamiButton        → All button variants: primary, secondary, ghost, danger, link
                      Sizes: sm, md, lg
                      States: default, hover, active, disabled, loading
  VamiIconButton    → Button with only an icon (requires aria-label)
  VamiLink          → Anchor tag — internal (React Router) and external variants
  VamiToggle        → Binary toggle (on/off) with accessible label

Form Atoms:
  VamiInput         → Text input. Variants: default, error, success, disabled
  VamiTextarea      → Multi-line text. Auto-resize variant
  VamiCheckbox      → Custom checkbox — never native
  VamiRadio         → Custom radio button
  VamiSelect        → Custom dropdown select (not native <select>)
  VamiSwitch        → Toggle switch (settings-style)
  VamiFileUpload    → File input trigger — never raw <input type="file">

Layout Atoms:
  VamiBox           → Generic container div — replaces raw div
  VamiStack         → Flex column layout with gap token
  VamiRow           → Flex row layout with gap token
  VamiGrid          → CSS Grid layout with column/gap props
  VamiDivider       → Horizontal or vertical separator
  VamiSpacer        → Explicit whitespace unit
  VamiContainer     → Max-width-constrained centered container

Visual Atoms:
  VamiAvatar        → User avatar. Fallback to initials. Sizes: xs, sm, md, lg, xl
  VamiBadge         → Small status/label badges. Variants: default, success, warning, error, info
  VamiTag           → Topic/interest tags. Clickable variant
  VamiIcon          → Icon wrapper (SVG icon system — custom, not a library)
  VamiProgressBar   → Linear progress indicator
  VamiSpinner       → Loading spinner
  VamiSkeleton      → Loading skeleton placeholder. Shape-variant (text, circle, rect)
  VamiDot           → Online/status indicator dot

Media Atoms:
  VamiImage         → Wrapper for img with lazy loading, error fallback, aspect ratio
  VamiVideo         → Wrapper for embedded videos with aspect ratio preservation
```

### Level 2: Molecules

Combinations of 2–5 atoms performing a single UI function.

```
Navigation Molecules:
  NavItem           → Icon + Label + active state for navigation menus
  Breadcrumb        → VamiLink chain with separator VamiIcon
  TabItem           → Single tab with active state
  TabBar            → Row of TabItems with underline indicator

Form Molecules:
  FormField         → VamiLabel + VamiInput + error VamiText + helper VamiText
  SearchBox         → VamiInput + VamiIconButton (search trigger) + clear button
  DatePicker        → VamiInput + calendar dropdown (custom built)
  CharacterCounter  → VamiTextarea + VamiText showing chars remaining

Card Molecules:
  ArticleCard       → VamiImage + VamiHeading + VamiText + VamiAvatar + VamiBadge
  CreatorCard       → VamiAvatar + VamiText + VamiButton (follow/subscribe)
  StatCard          → VamiText (number) + VamiCaption (label) + trend VamiBadge
  NotificationItem  → VamiAvatar + VamiText + VamiCaption (timestamp)

Feedback Molecules:
  Toast             → VamiIcon + VamiText + VamiIconButton (close)
  AlertBanner       → VamiIcon + VamiText + optional VamiButton
  EmptyState        → VamiIcon + VamiHeading + VamiText + optional VamiButton
  ErrorMessage      → VamiIcon + VamiText + retry VamiLink

Content Molecules:
  ReadingProgress   → Horizontal progress bar fixed at top during article read
  ReadTimeDisplay   → VamiIcon (clock) + VamiText (N min read)
  AuthorByline      → VamiAvatar + VamiLink (name) + VamiCaption (date) + ReadTimeDisplay
  ReactionBar       → Row of 5 ReactionButtons with count
  ShareMenu         → Dropdown with platform share options
  BookmarkButton    → Toggle icon button with saved/unsaved state

AI Molecules:
  AiSuggestionChip  → Compact suggestion pill with accept/reject
  AiThinkingDot     → Animated thinking indicator during AI generation
```

### Level 3: Organisms

Complex, self-contained UI sections. Can contain business logic hooks.

```
Navigation Organisms:
  TopNavigation     → Logo + global nav items + search + auth actions
                      Hides on scroll down, reveals on scroll up
  MobileNavDrawer   → Slide-in mobile nav with all nav items
  WriterSidebar     → Creator dashboard left sidebar

Content Organisms:
  ArticleFeedCard   → Full article card for feed (organism-level: includes
                      hover states, reaction preview, save toggle, author follow)
  ArticleHero       → Article title, subtitle, author, cover image, metadata
  ArticleBody       → Rendered article content with all block types
  ArticleFooter     → Author card, related articles, reactions, comments CTA
  InlineAnnotation  → Highlight + note UI anchored to paragraph
  CommentThread     → Threaded comments attached to paragraph block
  ArticleAnalytics  → Stats overview for creator's individual article

Editor Organisms:
  EditorToolbar     → Formatting controls above editor
  BlockCommandMenu  → Slash-command palette popup
  AiAssistantPanel  → Right-sidebar AI writing assistant
  PublishModal      → Article publish configuration (visibility, schedule, SEO)
  EditorStatusBar   → Word count, read time, save status

Feed Organisms:
  FeedTabBar        → For You / New to You / Deep Dives / Circles tabs
  FeedList          → Infinite scroll list of ArticleFeedCards
  RecommendedTopics → Sidebar topic tag cloud
  CreatorSpotlight  → Sidebar featured creator section

Search Organisms:
  SearchSuggestions → Real-time search suggestions dropdown
  SearchFilters     → Filter panel (topic, date, reading time)
  SearchResultsList → Search results with highlighted matches

Profile Organisms:
  ProfileHero       → Avatar, name, bio, subscriber count, follow/subscribe buttons
  ProfileArticleList → Creator's published articles grid
  SubscriberExport  → Subscriber list with export controls

Auth Organisms:
  LoginForm         → Email magic link or OAuth login
  OnboardingWizard  → Multi-step new user setup

Analytics Organisms:
  EarningsBreakdown → Transparent earnings formula visualization
  SubscriberGrowthChart → Line chart with subscriber over time
  ArticlePerformanceTable → All articles with key metrics
  EarningsSimulator → "What if" calculator for earnings optimization

Community Organisms:
  CircleCard        → Circle header with description, member count, join button
  CircleFeed        → Feed of articles and discussions within a circle
  ReactionModal     → Expanded reaction detail (who reacted, how)
```

### Level 4: Templates

Page layout shells. Manage layout, not content. Content is passed as children.

```
PublicPageTemplate        → Topnav + main content area + footer
                            Used by: home, article, search, profiles
AuthenticatedTemplate     → Topnav + sidebar + main + optional right sidebar
                            Used by: feed, bookmarks, notifications
EditorTemplate            → Minimal chrome — only save status and publish button
                            Used by: editor, draft management
DashboardTemplate         → Creator dashboard with sidebar navigation
                            Used by: analytics, earnings, subscribers, settings
SettingsTemplate          → Settings layout with left nav + content panel
                            Used by: account, billing, notifications settings
AuthTemplate              → Centered card layout for auth flows
                            Used by: login, signup, verify email
ErrorTemplate             → Centered error state with nav
                            Used by: 404, 500, access denied
```

### Level 5: Pages

Composed from templates + organisms + feature-specific logic.

```
Home                      → Landing page for logged-out users
Feed                      → Main reading feed (logged-in readers)
ArticleRead               → Article reading page
ArticleEdit               → Article editor
NewArticle                → New article creation
WriterProfile             → Public creator profile
ReaderProfile             → Reader's own profile/settings
Search                    → Search results
Explore                   → Topic/circle discovery
Notifications             → Notification center
Analytics                 → Creator analytics dashboard
Earnings                  → Earnings and payout dashboard
Subscribers               → Subscriber management
Settings                  → Account settings
Billing                   → Subscription management
CircleDetail              → Individual circle page
Login                     → Authentication
Onboarding                → New user onboarding
MigrationImport           → Content import from Medium/Substack
DataExport                → Account data export
```

## E.4 Component File Structure (mandatory for every component)

Every component lives in its own folder, regardless of size:

```
atoms/VamiButton/
├── VamiButton.jsx        → Component implementation
├── VamiButton.module.css → Component styles (CSS Modules)
├── VamiButton.test.jsx   → Component tests
├── VamiButton.stories.js → Storybook stories (documentation)
└── index.js              → Export: export { default } from './VamiButton'
```

## E.5 CSS Architecture

**CSS Modules only.** No styled-components, no Emotion, no Tailwind utility classes in JSX. Design tokens via CSS custom properties.

**CSS file structure within a module:**

```
1. Import statements (@import tokens if needed)
2. :root / host variables (component-specific token overrides)
3. Base styles (.component)
4. Variants (.component--variant-name)
5. States (.component--state, :hover, :focus, :disabled)
6. Size modifiers (.component--sm, --md, --lg)
7. Responsive (@media queries — mobile-first)
8. Dark mode ([data-theme="dark"] .component)
```

**Spacing rule:** All spacing values must use `--space-*` tokens. Never write `margin: 12px` — write `margin: var(--space-3)`.

**No global class names** outside of `globals.css` and `tokens.css`. Every class is scoped to its module.

---

# SECTION F — INFRASTRUCTURE & FREE-TIER STACK

## F.1 Free-Tier Service Map

**Principle:** Use free tiers that have a clear, affordable paid upgrade path. Never use free tiers that lock us in or have punishing upgrade costs.

```
SERVICE          FREE TIER USED          LIMITS              PAID UPGRADE PATH
─────────────────────────────────────────────────────────────────────────────────
Frontend Host    Vercel (Hobby)          100GB bandwidth/mo   Vercel Pro: $20/mo
Backend Host     Railway Starter         $5/mo credit (free   Railway Pro: $20/mo
                                         with invite)
Database         Neon.tech Free          0.5GB storage        Neon Launch: $19/mo
                                         10GB compute hours
Cache            Upstash Redis Free      10,000 req/day       Upstash Pay-as-you-go
Search           Meilisearch Cloud Free  100K documents       Meilisearch Cloud $30/mo
                                         10K searches/mo      OR self-host on Railway
File Storage     Cloudinary Free         25GB storage         Cloudinary Plus $89/mo
                                         25GB bandwidth
Email            Resend Free             3,000 emails/mo      Resend Pro: $20/mo
                                         100/day
Payments         Stripe (no monthly fee) 2.9% + 30¢/txn      Same — no free tier concept
AI               Anthropic API           Pay per use          Same — pay per use
                 Haiku: $0.25/1M tokens
AI Embeddings    OpenAI Embeddings       Pay per use          Same
                 $0.02/1M tokens
Monitoring       Sentry Free             5K errors/mo         Sentry Team: $26/mo
Analytics        PostHog Free            1M events/mo         PostHog Pay-per-event
CI/CD            GitHub Actions Free     2,000 min/mo private Same (generous free)
DNS              Cloudflare Free         Unlimited            Same (free is excellent)
Secret Mgmt      GitHub Secrets          Unlimited            Same
─────────────────────────────────────────────────────────────────────────────────
TOTAL MONTHLY COST AT ZERO REVENUE: ~$0–$10/month
```

## F.2 Environments

**Three environments. No more, no less.**

```
ENVIRONMENT: LOCAL (development)
  Purpose:     Developer-specific. Runs on local machine.
  Services:    All services via Docker Compose
  Database:    Local PostgreSQL (Docker)
  Credentials: .env.local (never committed)
  URL:         http://localhost:5173 (web) / http://localhost:3000 (api)
  Notes:       Real AI API calls disabled by default (use mocks)
               Real Stripe in test mode
               Email captured by MailHog (not sent)

ENVIRONMENT: STAGING (shared pre-production)
  Purpose:     Integration testing, client review, QA
  Services:    Same stack as production, free tier services
  Database:    Neon.tech (staging database — separate from production)
  Branch:      staging branch auto-deploys here
  URL:         staging.vami.app
  Notes:       Real AI API calls (budget capped)
               Stripe in test mode
               Email actually delivered (caution)
               Seeded with anonymized test data

ENVIRONMENT: PRODUCTION
  Purpose:     Live product
  Services:    Same stack, same free tier initially
  Database:    Neon.tech (production database)
  Branch:      main branch auto-deploys here
  URL:         vami.app
  Notes:       All services live and real
               Zero tolerance for downtime deployments
               Blue-green deployment via Vercel (frontend)
```

## F.3 Environment Variable Schema

**All environment variables are documented and typed. Missing env vars crash app at startup, not at runtime.**

**Backend `.env` schema (apps/api/.env.example):**

```
# Application
NODE_ENV=development|staging|production
PORT=3000
APP_URL=http://localhost:3000
WEB_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:pass@host:5432/vami_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis (Upstash)
REDIS_URL=redis://...
REDIS_TOKEN=...

# Auth
JWT_SECRET=minimum-64-character-random-string
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=minimum-64-character-random-string
REFRESH_TOKEN_EXPIRES_IN=90d

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email (Resend)
RESEND_API_KEY=...
EMAIL_FROM_NAME=VAMI
EMAIL_FROM_ADDRESS=hello@vami.app
EMAIL_REPLY_TO=support@vami.app

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Search (Meilisearch)
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_MASTER_KEY=...

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_... (sk_live_... in production)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...

# AI (Anthropic)
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL_HAIKU=claude-haiku-4-5
ANTHROPIC_MODEL_SONNET=claude-sonnet-4-6
AI_ENABLED=true|false
AI_MAX_TOKENS_PER_USER_DAY=100000

# AI (OpenAI — embeddings only)
OPENAI_API_KEY=...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Monitoring (Sentry)
SENTRY_DSN=...

# Analytics (PostHog)
POSTHOG_API_KEY=...
POSTHOG_HOST=https://app.posthog.com

# Security
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ENCRYPTION_KEY=minimum-32-character-key-for-aes-256
```

**Frontend `.env` schema (apps/web/.env.example):**

```
# Application
VITE_APP_NAME=VAMI
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000/api

# Feature flags
VITE_AI_FEATURES_ENABLED=true
VITE_PAYMENTS_ENABLED=true

# Monitoring
VITE_SENTRY_DSN=...

# Analytics
VITE_POSTHOG_API_KEY=...

# Payments (public key only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# File upload
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

**Env var validation at startup:** Both apps validate env vars on boot using a startup check module. If any required variable is missing, the process exits with a descriptive error message — never silently fails.

---

# SECTION G — DATABASE ARCHITECTURE

## G.1 Migration Strategy

**Tool:** node-pg-migrate (JavaScript, no ORM). Direct SQL. Full control.

**Migration rules:**

```
- Every schema change is a new migration file
- Never modify an existing migration file once merged to develop
- Migrations are forward-only in staging/production
- Rollback migrations written for every migration (backward compatibility)
- Migration filename format: [timestamp]_[description].sql
  Example: 20240115103000_create_users_table.sql
- All migrations tested locally before PR
- Migrations run automatically in CI before tests
```

**Migration file categories:**

```
create_[table]_table        → New table creation
add_[column]_to_[table]     → Adding columns
drop_[column]_from_[table]  → Removing columns
create_[index]_index        → New indexes
alter_[table]_[description] → Schema modifications
seed_[table]_[description]  → Reference data inserts
```

## G.2 Complete Database Schema

**Tables and their purpose:**

```
CORE USER TABLES:
  users                   Primary user records
  user_sessions           JWT refresh token tracking
  oauth_providers         OAuth connection records
  email_verifications     Email verification tokens
  password_reset_tokens   Password reset flows (future)

CONTENT TABLES:
  articles                Article records (all statuses)
  article_revisions       Full version history
  article_embeddings      Semantic search vectors
  article_tags            Applied tags
  tags                    Tag registry
  media_files             Uploaded images and files
  article_media           Article ↔ media join

SUBSCRIPTION TABLES:
  platform_memberships    Reader tier subscriptions (Stripe)
  creator_subscriptions   Reader → Creator subscriptions
  creator_tiers           Creator-defined subscription tiers
  follow_relationships    Writer follow graph

MONETIZATION TABLES:
  partner_pool_periods    Monthly pool definitions
  article_earnings        Per-article earnings per period
  creator_payouts         Payout records
  stripe_events           Webhook event log (idempotency)

READING & ANALYTICS TABLES:
  reading_sessions        Article read events (start, complete, depth)
  article_bookmarks       User saved articles
  article_reactions       5-reaction system
  annotations             User highlights + notes

COMMUNITY TABLES:
  circles                 Interest communities
  circle_members          Circle membership
  circle_posts            Discussions within circles
  circle_post_reactions   Reactions on discussions
  comments                Paragraph-level comments
  comment_reactions       Reactions on comments

EMAIL & NOTIFICATION TABLES:
  newsletter_sends        Email broadcast records
  email_events            Delivery tracking (opens, clicks)
  notifications           In-app notification records
  notification_preferences User notification settings

AI TRACKING TABLES:
  ai_usage_log            Per-request AI cost tracking
  article_ai_summaries    Cached article summaries

AUDIT TABLES:
  audit_log               Immutable record of sensitive actions
```

## G.3 Database Access Layer Pattern

**Repository pattern. No ORM. Raw SQL with `pg` library.**

```
Every table has a corresponding repository module:
  articles → articleRepository
  users    → userRepository
  etc.

Repository responsibilities:
  - Execute parameterized SQL queries (never string concatenation)
  - Map database rows to plain JavaScript objects
  - Handle pagination cursor logic
  - NO business logic — pure data access

Service responsibilities (one layer above):
  - Orchestrate multiple repository calls
  - Apply business rules
  - Handle transactions (pass db client to repositories)
  - Transform data for API response

Transaction pattern:
  Services that need transactions receive a `client` parameter
  The calling code wraps in BEGIN/COMMIT/ROLLBACK
  Repositories accept optional `client` to participate in transactions
```

---

# SECTION H — API ARCHITECTURE

## H.1 REST API Design

**Base URL:** `https://api.vami.app/v1`

**Versioning:** URL-based (`/v1/`). All breaking changes require new version.

**Response envelope (all responses):**

```json
{
  "data": { ... },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Pagination (cursor-based, not page-based):**

```json
{
  "data": [...],
  "pagination": {
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextCursor": "cursor_xyz",
    "totalCount": 847
  }
}
```

**Complete API Surface:**

```
AUTH ENDPOINTS:
  POST   /v1/auth/magic-link          Request magic link email
  POST   /v1/auth/verify-magic-link   Verify token from email
  POST   /v1/auth/oauth/google        OAuth with Google
  POST   /v1/auth/oauth/github        OAuth with GitHub
  POST   /v1/auth/refresh             Refresh access token
  DELETE /v1/auth/logout              Invalidate session
  GET    /v1/auth/me                  Current user (auth check)

USER ENDPOINTS:
  GET    /v1/users/:username          Public profile
  GET    /v1/users/:username/articles Published articles
  PATCH  /v1/users/me                 Update own profile
  DELETE /v1/users/me                 Delete account
  GET    /v1/users/me/notifications   User notifications
  PATCH  /v1/users/me/notification-preferences

FOLLOW ENDPOINTS:
  POST   /v1/follows/:userId          Follow a creator
  DELETE /v1/follows/:userId          Unfollow
  GET    /v1/follows/following        Who I follow
  GET    /v1/follows/followers        Who follows me

ARTICLE ENDPOINTS:
  POST   /v1/articles                 Create draft
  GET    /v1/articles/:slug           Get article (public)
  PATCH  /v1/articles/:id             Update article
  DELETE /v1/articles/:id             Delete article
  POST   /v1/articles/:id/publish     Publish article
  POST   /v1/articles/:id/schedule    Schedule publish
  POST   /v1/articles/:id/unpublish   Unpublish
  GET    /v1/articles/me/drafts       Creator's drafts
  GET    /v1/articles/:id/revisions   Version history
  GET    /v1/articles/:id/analytics   Article performance

FEED ENDPOINTS:
  GET    /v1/feed                     Personalized feed
  GET    /v1/feed/new-to-you          Discovery feed
  GET    /v1/feed/deep-dives          High-completion feed
  POST   /v1/feed/not-interested/:id  Negative signal

SEARCH ENDPOINTS:
  GET    /v1/search                   Hybrid search (semantic + keyword)
  GET    /v1/search/suggestions       Real-time suggestions

BOOKMARK ENDPOINTS:
  POST   /v1/bookmarks/:articleId     Bookmark article
  DELETE /v1/bookmarks/:articleId     Remove bookmark
  GET    /v1/bookmarks                My bookmarks

REACTION ENDPOINTS:
  POST   /v1/reactions/:articleId     React to article
  DELETE /v1/reactions/:articleId     Remove reaction
  GET    /v1/reactions/:articleId     Get reactions

ANNOTATION ENDPOINTS:
  POST   /v1/annotations              Create annotation
  PATCH  /v1/annotations/:id          Update annotation
  DELETE /v1/annotations/:id          Delete annotation
  GET    /v1/annotations/:articleId   My annotations on article

COMMENT ENDPOINTS:
  POST   /v1/comments                 Create comment on paragraph
  PATCH  /v1/comments/:id             Edit comment
  DELETE /v1/comments/:id             Delete comment
  GET    /v1/comments/:articleId      Comments for article

READING EVENT ENDPOINTS:
  POST   /v1/reading-events           Track reading event (fire-and-forget)

SUBSCRIPTION ENDPOINTS:
  POST   /v1/subscriptions/:creatorId Subscribe to creator (free)
  DELETE /v1/subscriptions/:creatorId Unsubscribe

PLATFORM MEMBERSHIP ENDPOINTS:
  POST   /v1/memberships/checkout     Create Stripe checkout session
  DELETE /v1/memberships              Cancel membership

CREATOR TIER ENDPOINTS:
  POST   /v1/creator-tiers            Create paid tier
  PATCH  /v1/creator-tiers/:id        Update tier
  DELETE /v1/creator-tiers/:id        Delete tier
  POST   /v1/creator-tiers/:id/subscribe Subscribe (paid)

ANALYTICS ENDPOINTS (creator):
  GET    /v1/analytics/overview       Creator analytics overview
  GET    /v1/analytics/earnings       Earnings breakdown
  GET    /v1/analytics/subscribers    Subscriber analytics
  GET    /v1/analytics/articles       Per-article analytics
  GET    /v1/analytics/earnings/simulator  Earnings what-if

SUBSCRIBER MANAGEMENT ENDPOINTS:
  GET    /v1/subscribers              Creator's subscriber list
  GET    /v1/subscribers/export       Export as CSV
  POST   /v1/newsletters             Send newsletter

CIRCLE ENDPOINTS:
  POST   /v1/circles                  Create circle
  GET    /v1/circles/:slug            Circle detail
  POST   /v1/circles/:id/join         Join circle
  DELETE /v1/circles/:id/leave        Leave circle
  GET    /v1/circles/:id/feed         Circle content feed

MEDIA ENDPOINTS:
  POST   /v1/media/upload-url         Get signed Cloudinary upload URL
  POST   /v1/media                    Register uploaded media

AI ENDPOINTS:
  POST   /v1/ai/writing-assistant     Writing assistance request
  POST   /v1/ai/summarize/:articleId  Generate article summary
  GET    /v1/ai/usage                 User's AI usage this period

PAYMENT WEBHOOKS (Stripe):
  POST   /v1/webhooks/stripe          Stripe webhook handler

HEALTH:
  GET    /health                      Service health check
  GET    /health/detailed             Detailed dependency health
```

## H.2 Middleware Stack

**Order matters. This is the exact order middleware is applied:**

```
1. Request ID injection        → Assigns unique requestId to every request
2. Request logging             → Logs method, url, requestId, user agent
3. Security headers (Helmet)   → Sets all security headers
4. CORS                        → Configured per environment
5. Rate limiting (Redis-backed) → Per-IP and per-user rate limits
6. Request body parsing        → JSON, with size limit (50KB default, 10MB upload)
7. Authentication              → Validates JWT, attaches user to req.user
8. Authorization               → Per-route permission checks
9. Request validation          → Zod schema validation per route
10. Route handler              → Actual business logic
11. Response normalization     → Wraps response in envelope
12. Error handling             → Catches and normalizes all errors
13. Response logging           → Logs status code, duration, requestId
```

---

# SECTION I — CI/CD PIPELINE

## I.1 GitHub Actions Workflows

**Workflow 1: Frontend CI (`ci-web.yml`)**
Triggers: Every PR targeting `develop` or `main`, every push to `develop`

```
Jobs (run in parallel):
  lint:
    - Checkout code
    - Install dependencies (pnpm with cache)
    - Run ESLint (zero warnings = pass)
    - Run Prettier check (format violations = fail)

  test:
    - Checkout code
    - Install dependencies (with cache)
    - Run Vitest (unit + component tests)
    - Upload coverage report to artifact
    - Fail if coverage drops below 60%

  build:
    - Checkout code
    - Install dependencies (with cache)
    - Build Vite production bundle
    - Check bundle size (fail if main chunk > 300KB)
    - Upload build artifact

  accessibility:
    - Runs axe-core against built app (key pages)
    - Fails on WCAG AA violations

All jobs must pass for PR to be mergeable.
```

**Workflow 2: Backend CI (`ci-api.yml`)**
Triggers: Every PR targeting `develop` or `main`, every push to `develop`

```
Jobs (run in parallel):
  lint:
    - Checkout code
    - Install dependencies
    - Run ESLint
    - Run Prettier check

  test:
    - Checkout code
    - Install dependencies
    - Start PostgreSQL service (GitHub Actions service container)
    - Start Redis service (GitHub Actions service container)
    - Run database migrations
    - Seed test data
    - Run Jest test suite
    - Upload coverage report
    - Fail if coverage below 70%

  security-scan:
    - Run npm audit (fail on high/critical vulnerabilities)
    - Run Snyk scan (if Snyk token configured)
```

**Workflow 3: Deploy to Staging (`deploy-staging.yml`)**
Triggers: Push to `staging` branch

```
Steps:
  1. Run all CI checks (reuse ci-web + ci-api jobs)
  2. If CI passes:
     a. Deploy frontend to Vercel (staging environment)
     b. Deploy backend to Railway (staging service)
     c. Run database migrations on staging DB
     d. Run smoke tests against staging URLs
     e. Post deployment notification (GitHub comment on PR)
  3. If anything fails: post failure notification, do not deploy
```

**Workflow 4: Deploy to Production (`deploy-production.yml`)**
Triggers: Push to `main` branch (only happens via release PR merge)

```
Steps:
  1. Re-run all CI checks
  2. Require manual approval gate (GitHub environment protection)
     - Both non-deploying devs must approve
  3. If approved:
     a. Create GitHub Release with changelog
     b. Deploy frontend to Vercel (production environment)
     c. Deploy backend to Railway (production service)
     d. Run migrations on production DB (with automatic rollback on failure)
     e. Run smoke tests against production
     f. Post deployment announcement
  4. Monitor error rate for 10 minutes
  5. Auto-rollback if error rate spikes >5x baseline
```

**Workflow 5: Weekly Security Scan (`security-scan.yml`)**
Triggers: Every Monday 00:00 UTC

```
Steps:
  1. npm audit on all packages
  2. Check for outdated dependencies
  3. OWASP dependency check
  4. Create GitHub Issue with findings (if any)
```

## I.2 Vercel Configuration

`vercel.json` in `apps/web/`:

```
Build settings:
  Framework: Vite
  Build command: pnpm build
  Output directory: dist
  Install command: pnpm install

Environment variables:
  Set per environment in Vercel dashboard (not in vercel.json)

Routing:
  SPA routing: All routes → index.html
  API proxy: /api/* → Railway API URL

Headers:
  Cache-Control on /assets/*: max-age=31536000, immutable
  Security headers on all routes

Preview deployments:
  Enabled for all PRs (automatic preview URL)
  Preview URLs posted as PR comment by Vercel bot
```

---

# SECTION J — PHASE-BY-PHASE WEEKLY IMPLEMENTATION PLAN

## OVERVIEW

```
Phase 0:  Foundation Setup           Weeks 1–2      (Pre-product)
Phase 1:  Core Infrastructure        Weeks 3–10     (Backend + DB)
Phase 2:  Editor & Publishing        Weeks 11–20    (Core product)
Phase 3:  Monetization               Weeks 21–28    (Revenue)
Phase 4:  AI Features                Weeks 29–36    (Differentiation)
Phase 5:  Community                  Weeks 37–44    (Retention)
Phase 6:  Quality & Launch           Weeks 45–52    (Ship it)
```

---

## PHASE 0: FOUNDATION SETUP (Weeks 1–2)

### WEEK 1 — Repository, Environment, Toolchain

**Goal:** Every developer has an identical, working local environment. Repository exists. CI runs. No feature code yet.

**Owner:** Dev 1 leads, all devs participate

**Day-by-Day Task Breakdown:**

```
DAY 1 (Dev 1):
  □ Create GitHub organization: vami-platform
  □ Create repository: vami (private)
  □ Initialize monorepo directory structure (all folders, no files yet)
  □ Create root package.json with workspace definition
  □ Create pnpm-workspace.yaml
  □ Create .gitignore (comprehensive — node_modules, .env, dist, .DS_Store, etc.)
  □ Create .gitattributes (LF line endings enforced)
  □ Create .nvmrc with 20.11.0
  □ First commit and push

  Branch: chore/initialize-monorepo-structure
  Commit: chore: initialize monorepo structure and workspace config

DAY 2 (Dev 1):
  □ Create packages/config/ with ESLint base config
  □ Create packages/config/ with Prettier config
  □ Create packages/config/ with Jest base config
  □ Install and configure ESLint in root
  □ Install and configure Prettier in root
  □ Verify lint runs from root: pnpm lint
  □ Verify format check runs from root: pnpm format:check

  Branch: chore/configure-linting-and-formatting
  Commit: chore(ci): configure ESLint and Prettier with shared config packages

DAY 3 (Dev 1 + Dev 2):
  □ Initialize apps/api/ — Express app skeleton
  □ Install api dependencies: express, cors, helmet, morgan, dotenv, pg, redis, zod
  □ Create apps/api/.env.example with ALL required variables documented
  □ Create startup env validation module
  □ Create apps/api/src/config/app.js — configuration module
  □ Initialize apps/web/ — Vite + React 19
  □ Create apps/web/.env.example
  □ Verify: pnpm dev in each app starts without errors

  Branch: chore/initialize-app-skeletons
  Commit: chore: initialize api and web app skeletons with dependency installation

DAY 4 (Dev 1):
  [x] Create docker-compose.dev.yml with PostgreSQL, Redis, Meilisearch, MailHog (Completed)
  □ Test: docker compose up starts all services
  □ Create scripts/setup.sh — automated developer setup script
  □ Document setup in docs/onboarding/LOCAL_SETUP.md
  □ Create pnpm scripts: services:up, services:down, services:reset

  Branch: chore/configure-docker-dev-services
  Commit: chore(infra): add docker compose dev services and setup automation

DAY 5 (Dev 2 + Dev 3):
  [x] Create .vscode/settings.json — workspace settings (Completed)
  □ Create .vscode/extensions.json — required extension recommendations
  □ Create .github/PULL_REQUEST_TEMPLATE.md
  □ Create .github/ISSUE_TEMPLATE/ (bug_report, feature_request, task)
  □ Create .github/CODEOWNERS
  □ Configure GitHub branch protection rules (main, develop)
  □ Add all team members to organization

  Branch: chore/configure-github-repository-settings
  Commit: chore: add PR templates, issue templates, codeowners, and branch protection

DAY 6-7 (All devs):
  □ Each developer independently follows LOCAL_SETUP.md from scratch
  □ File issues for any step that fails or is unclear
  □ Fix setup script until all 3 devs have identical working environments
  □ Dev 1 verifies GitHub Actions have correct permissions

  Commit: docs: update local setup guide based on developer feedback
```

**End of Week 1 Acceptance Criteria:**

```
✓ git clone → pnpm install → docker compose up → pnpm dev works for all 3 devs
✓ ESLint and Prettier configured and running
✓ GitHub branch protection rules active
✓ PR template in place
✓ Empty CI workflows exist (even if they don't do anything yet)
✓ All env vars documented in .env.example files
```

---

### WEEK 2 — CI/CD Pipeline & Design Token Foundation

**Goal:** CI runs on every PR. Design tokens defined. Staging and production environments created.

**Owner:** Dev 1 (CI/CD), Dev 2 (Design tokens), Dev 3 (Environment setup)

```
DAY 8-9 (Dev 1):
  □ Write ci-web.yml GitHub Actions workflow (lint + test + build jobs)
  □ Write ci-api.yml GitHub Actions workflow (lint + test + security jobs)
  □ Add PostgreSQL and Redis service containers to api CI
  □ Test CI by creating a test PR (fix/test-ci-pipeline branch)
  □ Verify all jobs pass on a clean PR

  Branch: ci/add-frontend-and-backend-ci-workflows
  Commit: ci: add parallel lint, test, and build workflows for web and api

DAY 10-11 (Dev 1 + Dev 3):
  □ Create Vercel account, create project linked to GitHub
  □ Configure Vercel environments (production, preview, development)
  □ Create Railway account, create project
  □ Create Neon.tech account, create two databases (staging + production)
  □ Create Upstash account, create Redis databases (staging + production)
  □ Write deploy-staging.yml workflow
  □ Write deploy-production.yml workflow (with manual approval gate)
  □ Test staging deployment pipeline

  Branch: ci/add-staging-and-production-deploy-workflows
  Commit: ci: add staging and production deployment workflows with approval gates

DAY 12-13 (Dev 2):
  □ Create apps/web/src/styles/tokens.css — ALL design tokens (full spec from Section E.2)
  □ Create apps/web/src/styles/globals.css — Reset, base HTML element styles
  □ Create apps/web/src/styles/typography.css — Type scale utilities
  □ Verify tokens load in app
  □ Document design token decisions in docs/design-system/TOKENS.md

  Branch: feat/design-system-foundation-tokens
  Commit: feat(ui): establish complete design token system with CSS custom properties

DAY 14 (All devs):
  □ Week 2 retrospective
  □ Review CI pipeline — is it fast enough? (target: under 3 minutes)
  □ Review token system — any missing tokens?
  □ Create GitHub Issues for all known Week 3 tasks
  □ Assign issues to developers

  Branch: docs/add-design-system-token-documentation
  Commit: docs: document design token usage guidelines and naming conventions
```

**End of Week 2 Acceptance Criteria:**

```
✓ PR to develop triggers CI — lint, test, build all run
✓ Push to staging deploys automatically
✓ Push to main requires approval, then deploys
✓ All design tokens defined in tokens.css
✓ Global styles reset applied
✓ Staging URL accessible: staging.vami.app
✓ Production URL accessible: vami.app (shows "coming soon" or similar)
```

---

## PHASE 1: CORE INFRASTRUCTURE (Weeks 3–10)

### WEEK 3 — Database Schema & Migrations

**Goal:** Complete database schema exists. Migration system operational. Can create and roll back all tables.

**Owner:** Dev 1 (primary), Dev 3 (review)

```
TASKS:
  [x] Install node-pg-migrate (Completed)
  [x] Configure migration runner (npm script: db:migrate, db:rollback, db:status) (Completed)
  [x] Create migration: users table (with all columns from schema spec) (Completed)
  [x] Create migration: user_sessions table (Completed)
  [x] Create migration: oauth_providers table (Completed)
  [x] Create migration: articles table (with body_json, all status checks) (Completed)
  [x] Create migration: article_revisions table (Completed)
  [x] Create migration: tags and article_tags tables (Completed)
  [x] Create migration: media_files and article_media tables (Completed)
  [x] Create migration: follow_relationships table (Completed)
  [x] Create migration: article_bookmarks table (Completed)
  [x] Create migration: article_reactions table (Completed)
  [x] Create migration: reading_sessions table (Completed)
  [x] Create migration: annotations table (Completed)
  [x] Create migration: circles and circle_members tables (Completed)
  [x] Create migration: comments and comment_reactions tables (Completed)
  [x] Create migration: platform_memberships table (Completed)
  [x] Create migration: creator_subscriptions table (Completed)
  [x] Create migration: creator_tiers table (Completed)
  [x] Create migration: partner_pool_periods table (Completed)
  [x] Create migration: article_earnings table (Completed)
  [x] Create migration: creator_payouts table (Completed)
  [x] Create migration: stripe_events table (Completed)
  [x] Create migration: notifications table (Completed)
  [x] Create migration: newsletter_sends and email_events tables (Completed)
  [x] Create migration: ai_usage_log table (Completed)
  [x] Create migration: audit_log table (Completed)
  [x] Create comprehensive seed file for development data (Completed)
  [x] Verify: all migrations run forward cleanly (Completed)
  [x] Verify: all migrations roll back cleanly (Completed)
  [x] Add pgvector extension migration (for article embeddings — Week 20) (Completed)

Branch naming: feat/[nn]-create-[table]-migration for each table
Consolidated commit message example:
  feat(db): create users and authentication schema migrations
  feat(db): create article content schema migrations
  feat(db): create monetization schema migrations
  feat(db): create community and engagement schema migrations
  chore(db): add comprehensive development seed data
```

**End of Week 3 Acceptance Criteria:**

```
✓ pnpm db:migrate creates all tables without error
✓ pnpm db:rollback undoes all migrations without error
✓ pnpm db:seed populates development data
✓ All foreign key constraints verified
✓ All check constraints verified
✓ Schema matches specification document
```

---

### WEEK 4 — Authentication System (Backend)

**Goal:** Email magic link auth + OAuth (Google, GitHub). JWT issuance. Refresh token rotation. Rate limiting.

**Owner:** Dev 1

```
TASKS:
  [x] Install dependencies: jsonwebtoken, cookie-parser, nodemailer (Completed)
  [x] Create authService.js — business logic (Completed)
    - generateMagicLinkToken()
    - verifyMagicLinkToken()
    - issuePairOfTokens()
    - refreshAccessToken()
    - revokeSession()
  [x] Create authRepository.js — data access (Completed)
    - createSession()
    - findSessionByToken()
    - deleteSession()
    - createEmailVerification()
    - findEmailVerification()
    - deleteEmailVerification()
  [x] Create auth routes: POST /auth/magic-link, POST /auth/verify-magic-link (Completed)
  [x] Create auth routes: POST /auth/oauth/google, POST /auth/oauth/github (Completed)
  [x] Create auth routes: POST /auth/refresh, DELETE /auth/logout, GET /auth/me (Completed)
  [x] Implement JWT middleware (verify token, attach user to req) (Completed)
  [x] Implement rate limiting on auth endpoints (5 magic link requests per hour per IP) (Completed)
  [x] Write email template for magic link email (Completed)
  [x] Test all auth flows with Thunder Client / React Sandbox (Completed)
  [x] Write unit tests for authService.js (Completed)
  [x] Write integration tests for auth routes (Completed)

Branch: feat/10-implement-authentication-system-backend
Commit messages:
  feat(auth): implement email magic link generation and verification
  feat(auth): implement OAuth provider integration for Google and GitHub
  feat(auth): implement JWT issuance and refresh token rotation
  feat(auth): add authentication middleware and route protection
  test(auth): add unit and integration tests for authentication flows
```

**End of Week 4 Acceptance Criteria:**

```
✓ POST /auth/magic-link sends email (captured by MailHog locally)
✓ POST /auth/verify-magic-link returns access + refresh tokens
✓ POST /auth/refresh rotates refresh token correctly
✓ DELETE /auth/logout invalidates session
✓ Protected routes return 401 without valid token
✓ Rate limiting blocks >5 magic link requests/hour per IP
✓ Unit test coverage >90% for authService
```

---

### WEEK 5 — Authentication System (Frontend)

**Goal:** Login page, OAuth buttons, magic link verification flow, auth state management, protected routes.

**Owner:** Dev 2 (UI), Dev 3 (integration)

TASKS:
[x] Create API client module: apps/web/src/services/apiClient.js (Completed) - Axios instance with base URL - Request interceptor: attach Authorization header - Response interceptor: auto-refresh on 401 - Error normalization
[x] Create authService.js (frontend): API calls for auth endpoints (Completed)
[x] Create useAuth.js hook — auth state (user, isLoading, isAuthenticated) (Completed)
[x] Create AuthContext.js — provide auth state throughout app (Completed)
[x] Create Zustand auth store: stores user, tokens, persists to localStorage (Completed)
[x] Build Login page using AuthTemplate (Completed)
[x] Build VamiButton with Google OAuth icon + label (Completed)
[x] Build VamiButton with GitHub OAuth icon + label (Completed)
[x] Build magic link email input form (Completed)
[x] Build "Check your email" confirmation screen (Completed)
[x] Build magic link verification page (handles ?token= URL param) (Completed)
[x] Implement React Router protected routes (redirect to login if not auth'd) (Completed)
[x] Implement token refresh on app load (Completed)
[x] Test full login flow end-to-end (Completed)

Branch: feat/11-implement-authentication-frontend
Commit messages:
feat(auth): create API client with token management and auto-refresh
feat(auth): implement auth context, store, and useAuth hook
feat(auth): build login page with magic link and OAuth flows
feat(auth): implement protected routes and auth state persistence
test(auth): add authentication flow integration tests

```

---

### WEEK 6 — User Profile System

**Goal:** User can view and edit their profile. Writer profile page shows their articles. Follow system works.

**Owner:** Dev 3 (backend), Dev 2 (frontend)

```

BACKEND TASKS (Dev 3):
[x] userRepository.js — findByUsername, findById, updateProfile, deleteAccount (Completed)
[x] followRepository.js — createFollow, deleteFollow, getFollowing, getFollowers (Completed)
[x] userService.js — profile logic, follow/unfollow business rules (Completed)
[x] PATCH /v1/users/me — profile update (displayName, bio, avatarUrl, websiteUrl) (Completed)
[x] GET /v1/users/:username — public profile (+ subscriber count, quality score) (Completed)
[x] POST /v1/follows/:userId — follow (Completed)
[x] DELETE /v1/follows/:userId — unfollow (Completed)
[x] GET /v1/follows/following — who I follow (Completed)
[x] GET /v1/follows/followers — who follows me (Completed)
[x] Cloudinary image upload signed URL endpoint: POST /v1/media/upload-url (Completed)

FRONTEND TASKS (Dev 2):
[x] Build ProfileHero organism (avatar, name, bio, follow button, subscriber count) (Completed)
[x] Build writer profile page (WriterProfile template) (Completed)
[x] Build avatar upload component (using Cloudinary direct upload) (Completed)
[x] Build profile edit form (Completed)
[x] Build VamiAvatar atom (all sizes, fallback to initials) (Completed)
[x] Wire follow/unfollow button with optimistic updates (Completed)

Branch: feat/15-implement-user-profile-and-follow-system
Commit messages:
feat(users): implement user profile CRUD and follow graph endpoints
feat(users): add Cloudinary media upload integration
feat(ui): build profile page with avatar, bio, and follow controls

```

---

### WEEK 7 — Atom Component Library (Part 1)

**Goal:** All text, interactive, and layout atoms built, tested, documented.

**Owner:** Dev 2 (primary), Dev 3 (review and tests)

```

ATOMS TO BUILD THIS WEEK:
[x] VamiText — all variants (size, weight, color, truncation) (Completed)
[x] VamiHeading — H1-H6, sizes, weights (Completed)
[x] VamiCaption — metadata text style (Completed)
[x] VamiLabel — form labels (Completed)
[x] VamiCode (inline) — monospace code style (Completed)
[x] VamiButton — ALL variants (primary, secondary, ghost, danger, link) (Completed)
ALL sizes (sm, md, lg)
ALL states (default, hover, focus, active, disabled, loading)
[x] VamiIconButton — icon-only variant (Completed)
[x] VamiLink — internal and external variants (Completed)
[x] VamiBox — generic container with common layout props (Completed)
[x] VamiStack — flex column with gap (Completed)
[x] VamiRow — flex row with gap, alignment props (Completed)
[x] VamiGrid — CSS grid with column and gap props (Completed)
[x] VamiDivider — horizontal/vertical (Completed)
[x] VamiSpacer — explicit whitespace (Completed)

FOR EACH ATOM:
[x] Component file with JSDoc (Completed)
[x] Tailwind Custom utility classes and theme mappings matching tokens.css (Completed)
[x] Unit test (renders correctly, states work, accessibility) (Completed)
[x] Interactive components documented with design parameters (Completed)

Branch: feat/21-build-atom-component-library-part-1
Commit messages:
feat(ui): implement VamiText, VamiHeading, VamiCaption, VamiLabel atoms
feat(ui): implement VamiButton with all variants, sizes, and states
feat(ui): implement layout atoms (VamiBox, VamiStack, VamiRow, VamiGrid)
test(ui): add comprehensive tests for all text and layout atoms

```

---

### WEEK 8 — Atom Component Library (Part 2) + Core Molecules

**Goal:** Form atoms, visual atoms, and critical molecules complete.

**Owner:** Dev 2 (atoms + molecules), Dev 1 (review accessibility)

```

ATOMS TO BUILD THIS WEEK:
□ VamiInput — default, error, success, disabled states + accessibility
□ VamiTextarea — with auto-resize variant
□ VamiCheckbox — custom styled, indeterminate state
□ VamiRadio — custom styled, group behavior
□ VamiSelect — custom dropdown (keyboard navigation, ARIA listbox)
□ VamiSwitch — toggle switch with label
□ VamiAvatar — all sizes, image + initials fallback, status dot
□ VamiBadge — all variants, dot + label formats
□ VamiTag — default + clickable variant
□ VamiIcon — SVG icon system (create custom icon sprite)
Icons needed immediately: search, bookmark, heart, share, arrow-right,
arrow-left, menu, close, check, error, warning, info, edit, delete,
user, settings, analytics, home, bell, plus, minus
□ VamiProgressBar — linear, labeled, animated
□ VamiSpinner — multiple sizes
□ VamiSkeleton — text, circle, rect shapes
□ VamiImage — lazy loading, aspect ratio, fallback
□ VamiFileUpload — drag-and-drop + click to upload

MOLECULES TO BUILD THIS WEEK:
□ FormField — Label + Input + error + helper text
□ SearchBox — Input + icon + clear button
□ Toast — Icon + text + close (with toastManager utility)
□ AlertBanner — All severity variants
□ EmptyState — Icon + heading + text + optional action
□ ReadTimeDisplay — Clock icon + "N min read"
□ AuthorByline — Avatar + name link + date + read time

Branch: feat/22-build-atom-library-part-2-and-core-molecules
Commit messages:
feat(ui): implement form atoms with WCAG AA accessibility
feat(ui): implement visual atoms (avatar, badge, tag, icon, progress, skeleton)
feat(ui): implement core molecules (form field, search box, toast, empty state)
feat(ui): create custom SVG icon system with all required icons

```

---

### WEEK 9 — API Infrastructure (Middleware, Error Handling, Routing)

**Goal:** API is production-ready from an infrastructure standpoint. All middleware in place. Error handling standardized. Logging operational.

**Owner:** Dev 1

```

TASKS:
□ Set up Pino logger (structured JSON logging)
□ Implement request ID middleware (UUID per request)
□ Implement request + response logging middleware
□ Implement Helmet security headers (all recommended headers)
□ Implement CORS (per-environment configuration)
□ Implement Redis-backed rate limiter (multiple tiers: global, per-user, per-endpoint)
□ Implement error handler classes (AppError hierarchy — see Section D.5)
□ Implement global error handling middleware
□ Implement request validation middleware (Zod schema validation)
□ Create API router structure (all route files, even if empty)
□ Implement health check endpoint (/health, /health/detailed)
□ Set up Sentry error reporting
□ Implement graceful shutdown (SIGTERM handling, drain in-flight requests)
□ Write integration tests for middleware stack

Branch: feat/25-implement-api-middleware-and-error-handling
Commit messages:
feat(api): implement structured logging with Pino and request tracing
feat(api): add security middleware (Helmet, CORS, rate limiting)
feat(api): implement error class hierarchy and global error handler
feat(api): add Zod-based request validation middleware
feat(api): configure Sentry error reporting and graceful shutdown
test(api): add middleware integration tests

```

---

### WEEK 10 — Navigation, Layout, & Application Shell

**Goal:** The application shell is complete. Top navigation, authenticated layout, routing, dark mode. App feels like a real product.

**Owner:** Dev 2 (primary), Dev 3 (routing)

```

TASKS:
□ Build TopNavigation organism - Logo (custom SVG) - Nav links (using NavItem molecule) - SearchBox molecule (triggers search page) - User menu (avatar + dropdown) - Write button (for creators) - Mobile hamburger → MobileNavDrawer - Scroll behavior (hide on down, reveal on up)
□ Build MobileNavDrawer organism
□ Build PublicPageTemplate (layout for non-auth users)
□ Build AuthenticatedTemplate (layout for logged-in users)
□ Build AuthTemplate (centered card for auth flows)
□ Build ErrorTemplate (404, 500 error pages)
□ Set up React Router (all routes defined, lazy-loaded)
□ Implement dark mode toggle (tokens.css data-theme approach)
□ Persist dark mode preference
□ Build 404 page
□ Build 500 error boundary page
□ Implement page title management (dynamic <title> tags)
□ Implement scroll restoration on route change

Branch: feat/30-build-application-shell-and-navigation
Commit messages:
feat(ui): build top navigation organism with responsive mobile drawer
feat(ui): implement page layout templates (public, authenticated, auth, error)
feat(ui): configure React Router with lazy-loaded routes
feat(ui): implement system and manual dark mode with token-based theming
feat(ui): add 404 and error boundary pages

```

**End of Phase 1 Acceptance Criteria:**

```

✓ Full auth flow works (magic link + OAuth)
✓ Profile view and edit works
✓ Follow/unfollow works
✓ All atoms built, tested, accessible
✓ Core molecules built and used in real UI
✓ Application shell renders for all route types
✓ Dark mode toggles correctly
✓ API middleware stack operational
✓ Error handling standardized
✓ All CI checks passing

```

---

## PHASE 2: EDITOR & PUBLISHING (Weeks 11–20)

### WEEK 11 — Editor Foundation (Tiptap Integration)

**Goal:** Tiptap editor installed, wrapped, configured. Base extensions enabled. Custom toolbar connected.

**Owner:** Dev 2 (editor), Dev 3 (backend draft endpoint)

```

BACKEND TASKS (Dev 3):
□ articleRepository.js — createDraft, findDraftById, updateDraft, deleteDraft
□ POST /v1/articles → creates empty draft, returns id
□ PATCH /v1/articles/:id → partial update (supports autosave)
□ GET /v1/articles/me/drafts → list creator's drafts

FRONTEND TASKS (Dev 2):
□ Install @tiptap/react, @tiptap/starter-kit + required extensions
□ Create EditorCore.jsx — base Tiptap wrapper
□ Configure base extensions: - Document, Paragraph, Text - Heading (levels 1, 2, 3) - Bold, Italic, Underline, Strike - Blockquote, HorizontalRule - BulletList, OrderedList, ListItem - HardBreak
□ Create EditorToolbar organism — floating/fixed formatting bar
□ Wire toolbar to editor commands
□ Apply reading typography to editor (Lora, 21px, 660px max-width)
□ Implement autosave (debounced, 3-second delay after last keystroke)
□ Implement offline draft saving (IndexedDB fallback when API unavailable)
□ Create word count + read time display (floating bottom)
□ Create /write route → new draft creation + redirect to editor

Branch: feat/35-implement-tiptap-editor-foundation
Commit messages:
feat(editor): integrate Tiptap with base text formatting extensions
feat(editor): build editor toolbar with all formatting controls
feat(editor): implement debounced autosave with offline IndexedDB fallback
feat(editor): apply reading typography and content width constraints

```

---

### WEEK 12 — Editor Block System (Images & Code)

**Goal:** Image upload and code blocks work in editor. Slash command palette operational.

**Owner:** Dev 2 (primary)

```

TASKS:
□ Implement slash command palette (/ triggers command menu) - VamiInput for filtering - Block options: Heading 1, Heading 2, Image, Code Block, Quote, Divider - Keyboard navigation (arrow keys, enter to select, escape to close)
□ Build image upload block extension - Drag and drop image into editor - Click to upload - Direct Cloudinary upload (signed URL from API) - Upload progress indicator - Caption input below image - Resize handle (small, medium, large, full-width)
□ Build code block extension - Syntax highlighting (using lowlight + highlight.js) - Language selector (dropdown) - Copy to clipboard button - Line numbers (optional) - Supports: JavaScript, Python, SQL, Bash, CSS, HTML, JSON, TypeScript, Go, Rust
□ Build blockquote styling (custom, not default Tiptap)
□ Build horizontal rule styling
□ Test: paste code from clipboard into code block (preserve indentation)
□ Test: image upload on slow connection (progress, error states)

Branch: feat/38-implement-editor-block-extensions
Commit messages:
feat(editor): implement slash command palette with keyboard navigation
feat(editor): add image upload block with Cloudinary integration
feat(editor): implement code block with syntax highlighting and language selector
feat(editor): add blockquote and divider block extensions

```

---

### WEEK 13 — Editor Block System (Tables, Embeds, Math)

**Goal:** Tables, YouTube/Twitter embeds, LaTeX math blocks complete.

**Owner:** Dev 2 (primary)

```

TASKS:
□ Install @tiptap/extension-table extensions
□ Build table block: - Insert table (rows × columns) - Add/remove rows and columns - Custom table styling (not default browser) - Mobile: horizontal scroll on overflow
□ Build embed block: - Paste URL → detect YouTube/Twitter/CodePen/Loom - Render appropriate iframe embed - Aspect ratio preserved - Fallback: link card for unrecognized URLs
□ Build link card block: - URL input → fetch Open Graph metadata (via API proxy) - Show title, description, image preview - Clickable card
□ Install KaTeX for math rendering
□ Build LaTeX math block: - Block mode (centered equation) - Inline mode (in-line equation) - Preview renders in real-time
□ Build table of contents extension (auto-generates from headings)
□ Implement word count breakdown by section

Branch: feat/40-implement-advanced-editor-blocks
Commit messages:
feat(editor): implement table block with row and column management
feat(editor): add URL embed block supporting YouTube, Twitter, and CodePen
feat(editor): implement LaTeX math block with real-time KaTeX rendering
feat(editor): add link unfurling card and table of contents generation

```

---

### WEEK 14 — Draft Management & Version History

**Goal:** Drafts list page works. Version history accessible. Import from URL or file works.

**Owner:** Dev 3 (backend), Dev 2 (frontend)

```

BACKEND TASKS (Dev 3):
□ Implement article_revisions — save full snapshot on each manual save
□ GET /v1/articles/:id/revisions → list revisions (title, date, word count)
□ GET /v1/articles/:id/revisions/:revisionId → full revision content
□ POST /v1/articles/:id/revisions/:revisionId/restore → restore revision
□ Implement content import: - POST /v1/articles/import/url → scrape + convert to editor blocks - POST /v1/articles/import/file → parse HTML/Markdown file → blocks
□ DELETE /v1/articles/:id → delete draft (with confirmation)

FRONTEND TASKS (Dev 2):
□ Build drafts list page (all unpublished articles)
□ Build revision history sidebar (appears in editor)
□ Build revision diff view (before/after comparison)
□ Build restore revision confirmation modal
□ Build import modal (URL or file upload)
□ Build draft deletion confirmation

Branch: feat/42-implement-draft-management-and-version-history
Commit messages:
feat(articles): implement article revision history with restore capability
feat(articles): add content import from URL and file (HTML/Markdown)
feat(ui): build drafts management interface with revision history viewer

```

---

### WEEK 15 — Publishing Flow

**Goal:** Complete publish flow. SEO controls. Scheduling. Tags. Visibility settings.

**Owner:** Dev 3 (backend), Dev 2 (frontend)

```

BACKEND TASKS (Dev 3):
□ POST /v1/articles/:id/publish — validate + publish (sets status, published_at)
□ POST /v1/articles/:id/schedule — schedule with future timestamp
□ POST /v1/articles/:id/unpublish — revert to published (keep published_at)
□ Implement tag system: - GET /v1/tags/suggestions?q= → autocomplete suggestions - POST /v1/tags → create new tag (moderator approved or auto-approve)
□ Implement slug generation (from title, deduplicated)
□ Implement scheduled publish job (BullMQ cron job)
□ Implement article indexing on publish (triggers Meilisearch indexing)

FRONTEND TASKS (Dev 2):
□ Build PublishModal organism: - Title and subtitle confirmation - Cover image upload - Tags input (autocomplete with VamiTag chips) - Visibility selector (public / subscribers only / paid subscribers) - SEO override fields (meta title, meta description) - OG image selection - Schedule toggle + datetime picker - Canonical URL (for cross-posting)
□ Build SEO preview (shows Google snippet preview)
□ Build publish success confirmation (with share links)

Branch: feat/45-implement-article-publishing-flow
Commit messages:
feat(articles): implement publish, schedule, and unpublish endpoints
feat(articles): add tag system with autocomplete and slug generation
feat(ui): build publish modal with SEO controls and scheduling
feat(ui): add SEO preview and publish success confirmation

```

---

### WEEK 16 — Article Reading Experience

**Goal:** Article page is world-class. Typography, progress, highlights, reading modes.

**Owner:** Dev 2 (primary), Dev 3 (reading event tracking)

```

BACKEND TASKS (Dev 3):
□ GET /v1/articles/:slug → full article response
□ POST /v1/reading-events → fire-and-forget read tracking
Body: { articleId, sessionId, event: start|scroll|complete, scrollDepth, isReturning }
□ GET /v1/articles/:id/similar → related articles (basic — by tags, Week 20 upgrades this)

FRONTEND TASKS (Dev 2):
□ Build ArticleHero organism (title, subtitle, cover image, author byline, tags)
□ Build ArticleBody organism (renders all block types from body_json)
□ Build ArticleFooter organism (author card, reactions, related articles)
□ Implement reading progress bar (fixed at top, shows scroll percentage)
□ Implement auto-hiding navigation on scroll down
□ Implement text selection → highlight toolbar (highlight, annotate, share)
□ Build shareable highlight image card (text on branded background)
□ Build reading mode controls (floating bottom-right): - Font size (small/medium/large) - Quick/Read/Study mode toggle - Dark mode toggle
□ Implement read time tracking (fire reading events to API)
□ Build "estimated N min read" + reading progress in minutes
□ Build table of contents sidebar (if article has 3+ headings)
□ Build social share panel (Twitter, LinkedIn, copy link)
□ Implement Open Graph meta tags (SSR or dynamic injection)

Branch: feat/48-build-article-reading-experience
Commit messages:
feat(article): implement article content rendering for all block types
feat(article): build reading progress, mode controls, and text highlights
feat(article): implement reading event tracking for analytics
feat(article): add social sharing with highlight card generation
feat(ui): build article hero, body, and footer organisms

```

---

### WEEK 17 — Feed System (Basic)

**Goal:** Home feed shows articles. For You / New to You tabs work. Infinite scroll. Article cards complete.

**Owner:** Dev 1 (feed algorithm), Dev 2 (feed UI), Dev 3 (feed API)

```

BACKEND TASKS (Dev 1 + Dev 3):
□ GET /v1/feed — personalized feed
Algorithm V1 (simple): - 60% followed authors' recent articles (sorted by published_at) - 40% popular articles by topic affinity (from follows + reading history) - Exclude: already-read articles, articles from last 30 days of feed - Cursor-based pagination (20 articles per page)
□ GET /v1/feed/new-to-you — discovery feed
Algorithm V1: - 100% non-followed authors - Ranked by: read completion rate (last 7 days) × recency score - Diversity: max 2 articles per author per page
□ POST /v1/feed/not-interested/:articleId — negative signal (mark article, hide)

FRONTEND TASKS (Dev 2):
□ Build ArticleFeedCard organism (full interactive article card) - Cover image (optional, 16:9 aspect ratio) - Title + subtitle (line clamped) - Author byline molecule - Tags (VamiTag chips, max 3 shown) - Read time - Reaction preview (shows top reaction count) - Bookmark toggle (optimistic) - "Not interested" overflow menu - Member badge (if paywalled)
□ Build FeedTabBar organism (For You / New to You / Deep Dives / Circles)
□ Build FeedList organism (infinite scroll, loading skeletons)
□ Implement infinite scroll (IntersectionObserver, fetch next page on near-bottom)
□ Implement loading state (ArticleCard skeletons)
□ Implement empty state (no articles, onboarding CTA)

Branch: feat/51-implement-article-feed-system
Commit messages:
feat(feed): implement personalized and discovery feed algorithms
feat(feed): add negative interest signal endpoint
feat(ui): build article feed card organism with all interactive states
feat(ui): implement infinite scroll feed with loading states

```

---

### WEEK 18 — Writer Profile & Subscriber System (Basic)

**Goal:** Public writer profile page complete. Subscriber list. Basic subscribe button working.

**Owner:** Dev 2 (profile page), Dev 3 (subscriber backend)

```

BACKEND TASKS (Dev 3):
□ POST /v1/subscriptions/:creatorId → subscribe (free)
□ DELETE /v1/subscriptions/:creatorId → unsubscribe
□ GET /v1/subscribers → creator's subscriber list (paginated)
□ GET /v1/subscribers/export → CSV export with all subscriber data
□ User service: getPublicProfile (includes subscriber count, article count, quality score)

FRONTEND TASKS (Dev 2):
□ Build complete writer profile page: - ProfileHero (avatar, name, bio, social links, subscriber count, follow + subscribe) - Article grid/list (published articles, sorted by date) - Tab navigation (Articles / About)
□ Build subscribe modal (email input + confirmation)
□ Build subscriber management page (creator's own view)
□ Build subscriber export button (downloads CSV)
□ Build subscriber count + growth sparkline
□ Build "Subscribed" success state and email confirmation copy

Branch: feat/54-implement-writer-profile-and-subscriber-system
Commit messages:
feat(users): implement subscriber management endpoints and CSV export
feat(ui): build complete writer profile page with subscriber CTAs
feat(ui): implement subscriber management dashboard

```

---

### WEEK 19 — Keyword Search

**Goal:** Meilisearch integrated. Articles indexed on publish. Search page with filters works.

**Owner:** Dev 1 (search backend), Dev 2 (search UI)

```

BACKEND TASKS (Dev 1):
□ Configure Meilisearch index (articles)
□ Define searchable attributes (title, subtitle, body_text, tags, author_username)
□ Define filterable attributes (tags, read_time_min, published_at, is_partner)
□ Define rankable attributes (custom ranking rules: read_completion_rate first, then recency)
□ Implement article indexing event (triggers on article.published event)
□ Implement article de-indexing (on article deletion or unpublish)
□ Implement search service: search(query, filters, pagination)
□ GET /v1/search?q=&tags=&minReadTime=&maxReadTime=&from=&to=
□ GET /v1/search/suggestions?q= → real-time suggestions (typo-tolerant)
□ Index all existing published articles on first run (backfill script)

FRONTEND TASKS (Dev 2):
□ Build SearchBox molecule (already built Week 8 — wire it up)
□ Build SearchSuggestions organism (dropdown below search box)
□ Build Search page: - SearchFilters organism (tags, reading time range, date range) - SearchResultsList organism (highlighted matches, sort options) - Empty state with suggestions
□ Build search keyboard shortcut (Cmd+K opens search)

Branch: feat/57-implement-keyword-search-with-meilisearch
Commit messages:
feat(search): configure Meilisearch index with custom ranking and filters
feat(search): implement article indexing on publish and de-indexing on delete
feat(search): add search and suggestions endpoints
feat(ui): build search page with filters, results list, and keyboard shortcut

```

---

### WEEK 20 — Semantic Search (Vector Embeddings)

**Goal:** Search understands concepts, not just keywords. Hybrid search delivers 10x better results than Medium.

**Owner:** Dev 1 (vector infrastructure), Dev 3 (embedding service)

```

TASKS:
□ Enable pgvector PostgreSQL extension (migration)
□ Create article_embeddings table (migration — already defined Week 3)
□ Install OpenAI SDK
□ Build embeddingService.js: - generateEmbedding(text) → calls OpenAI text-embedding-3-small - storeArticleEmbedding(articleId, embedding) - findSimilarArticles(articleId, limit) → cosine similarity query
□ Trigger embedding generation on article publish (event listener)
□ Backfill embeddings for existing published articles (one-time script)
□ Implement hybrid search: - Run Meilisearch keyword search → get 50 candidates - Generate embedding for query - Re-rank candidates by cosine similarity to query embedding - Combine scores: 0.6 × semantic + 0.4 × keyword relevance
□ Update GET /v1/search to use hybrid search by default
□ Implement semantic similar articles: GET /v1/articles/:id/similar - Uses embedding cosine similarity, not tags
□ Rate limit embedding generation (prevent abuse of OpenAI API)
□ Cache query embeddings in Redis (1-hour TTL, same query = same result)

Branch: feat/60-implement-semantic-search-with-vector-embeddings
Commit messages:
feat(search): enable pgvector and implement article embedding generation
feat(search): implement hybrid keyword + semantic search with OpenAI embeddings
feat(search): add semantic similar articles using cosine similarity
perf(search): cache query embeddings in Redis to reduce API costs

```

**End of Phase 2 Acceptance Criteria:**

```

✓ Writer can create, edit, save, and publish articles
✓ All block types work (text, image, code, table, embed, math)
✓ Autosave works offline
✓ Version history and restore works
✓ Article reading page is beautiful and performant
✓ Reading progress and highlight sharing work
✓ Feed shows personalized content with infinite scroll
✓ Writer profile shows articles, followers, subscriber CTA
✓ Subscriber export downloads CSV immediately
✓ Search returns semantically relevant results
✓ Search suggestions appear in real-time

```

---

## PHASE 3: MONETIZATION (Weeks 21–28)

### WEEK 21 — Stripe Integration Foundation

**Goal:** Stripe connected. Test payments working. Webhook handler secure and reliable.

**Owner:** Dev 1

```

TASKS:
□ Create Stripe account (test mode)
□ Create Stripe Connect account (for creator payouts)
□ Install stripe npm package
□ Build stripeClient.js — Stripe SDK wrapper
□ Implement Stripe webhook handler: - POST /v1/webhooks/stripe - Verify webhook signature (STRIPE_WEBHOOK_SECRET) - Parse event type and route to handler - Idempotent processing (check stripe_events table for duplicates) - Handle: checkout.session.completed, customer.subscription.updated,
customer.subscription.deleted, invoice.payment_succeeded,
invoice.payment_failed, transfer.created
□ Write stripe_events logging (every webhook logged, status tracked)
□ Test with Stripe CLI: stripe listen --forward-to localhost:3000/v1/webhooks/stripe
□ Write webhook handler tests (using Stripe test fixtures)

Branch: feat/63-implement-stripe-integration-foundation
Commit messages:
feat(payments): integrate Stripe SDK with webhook handler and event logging
feat(payments): implement idempotent webhook processing with duplicate detection
test(payments): add Stripe webhook handler tests with test fixtures

```

---

### WEEK 22 — Platform Membership (Reader Tiers)

**Goal:** Readers can subscribe to platform ($4/mo Reader, $8/mo Supporter). Stripe Checkout flow works.

**Owner:** Dev 1 (backend), Dev 2 (frontend), Dev 3 (testing)

```

BACKEND TASKS (Dev 1):
□ Create Stripe products and prices (Reader: $4/mo, Supporter: $8/mo)
□ POST /v1/memberships/checkout → create Stripe Checkout Session (subscription)
□ Webhook handler: checkout.session.completed → create platform_membership record
□ Webhook handler: subscription cancelled → update platform_membership.cancelled_at
□ Webhook handler: invoice.payment_succeeded → update platform_membership.renewed_at
□ GET /v1/auth/me → include membership tier in response
□ Membership middleware: check req.user.membershipTier for gated content

FRONTEND TASKS (Dev 2):
□ Build Membership pricing page (Billing page)
□ Build feature comparison table (Free vs Reader vs Supporter)
□ Build upgrade CTA component (appears at natural upgrade moments)
□ Implement Stripe Checkout redirect flow
□ Build success page (post-Stripe Checkout return)
□ Build billing management page (shows current plan, next renewal, cancel option)
□ Implement soft paywall for creator premium content

Branch: feat/66-implement-platform-membership-tiers
Commit messages:
feat(payments): implement platform membership checkout and lifecycle webhooks
feat(ui): build membership pricing page and Stripe checkout integration
feat(ui): implement soft paywall for member-only content

```

---

### WEEK 23 — Creator Subscription Tiers

**Goal:** Creators can create paid subscription tiers. Readers can subscribe and pay creators directly.

**Owner:** Dev 1 (backend), Dev 3 (integration)

```

BACKEND TASKS (Dev 1):
□ Create Stripe Connect onboarding flow: - POST /v1/payments/connect/onboard → create Stripe Connect account link - GET /v1/payments/connect/status → check Connect account status
□ POST /v1/creator-tiers — creator creates paid tier (name, price, interval, description)
□ PATCH /v1/creator-tiers/:id — update tier
□ DELETE /v1/creator-tiers/:id — archive tier (existing subs continue)
□ GET /v1/creator-tiers/:creatorId — public tier listing
□ POST /v1/creator-tiers/:id/subscribe — reader subscribes to creator tier - Creates Stripe Subscription - 5% application fee via Stripe Connect - Creates creator_subscription record
□ Webhook: subscription cancelled → update creator_subscription
□ Webhook: invoice paid → update creator_subscription.renewed_at

FRONTEND TASKS (Dev 2 + Dev 3):
□ Build Stripe Connect onboarding flow (creator dashboard)
□ Build creator tier management UI (create/edit/delete tiers)
□ Build subscriber-facing tier selection modal
□ Build creator subscription status indicator on writer profile
□ Build "Manage subscription" page for subscribers

Branch: feat/69-implement-creator-subscription-tiers
Commit messages:
feat(payments): implement Stripe Connect onboarding for creator payouts
feat(payments): add creator subscription tiers with application fee
feat(ui): build creator tier management and subscriber onboarding flows

```

---

### WEEK 24 — Platform Revenue Share (Quality Pool)

**Goal:** Monthly earnings pool calculated. Per-article earnings computed with transparent formula. Creators can see their earnings.

**Owner:** Dev 1 (earnings engine), Dev 3 (earnings API)

```

TASKS:
□ Build earnings calculation service: - Input: period, all reading_sessions, all article_bookmarks, all comments - Step 1: Calculate pool size (30% of platform membership revenue for period) - Step 2: Per article score:
memberReadsScore = memberReads / totalMemberReads × 0.40
completionScore = completionRate × 0.30
bookmarkScore = bookmarks / totalBookmarks × 0.20
communityScore = qualifiedComments / totalComments × 0.10 - Step 3: Normalize to 1.0 across all articles - Step 4: Each article earnings = normalizedScore × poolSize - Step 5: Write to article_earnings table with full breakdown_json
□ Schedule: Run earnings calculation monthly (BullMQ cron, 1st of month)
□ GET /v1/analytics/earnings — creator's earnings summary with breakdown
□ GET /v1/analytics/earnings/articles — per-article earnings table
□ GET /v1/analytics/earnings/simulator — what-if endpoint
Input: hypothetical changes to any signal
Output: projected earnings change

Branch: feat/72-implement-platform-revenue-share-engine
Commit messages:
feat(analytics): implement monthly quality pool earnings calculation engine
feat(analytics): add earnings breakdown endpoints with full signal transparency
feat(analytics): implement earnings what-if simulator

```

---

### WEEK 25 — Transparent Earnings Dashboard

**Goal:** Earnings dashboard is the most transparent creator monetization dashboard in the industry.

**Owner:** Dev 2 (UI), Dev 3 (charts)

```

TASKS:
□ Install Recharts (data visualization library)
□ Build EarningsBreakdown organism: - Monthly total (large, prominent) - Signal breakdown donut chart (Member Reads 40%, Completion 30%, etc.) - Formula explanation card (expandable) - "How to earn more" actionable tips
□ Build ArticlePerformanceTable organism: - All partner articles with per-article earnings, reads, completion rate, bookmarks - Sortable columns - Row click → article analytics detail
□ Build EarningsSimulator: - Sliders for each signal (member reads, completion rate, bookmarks) - Real-time earnings projection updates
□ Build PayoutHistory component (past payouts with status)
□ Build EarningsMonth selector (browse historical months)
□ Build ConnectPayout setup prompt (if not on Stripe Connect yet)

Branch: feat/75-build-transparent-earnings-dashboard
Commit messages:
feat(ui): build earnings breakdown with signal visualization and formula explanation
feat(ui): implement article performance table with sortable columns
feat(ui): add earnings simulator with real-time projection updates

```

---

### WEEK 26 — Creator Analytics Dashboard

**Goal:** Creators have deep analytics — views, reads, subscribers, retention — all in one place.

**Owner:** Dev 3 (analytics backend), Dev 2 (analytics UI)

```

BACKEND TASKS (Dev 3):
□ GET /v1/analytics/overview — 30-day summary (views, reads, completion, subs, earnings)
□ GET /v1/analytics/subscribers — subscriber growth chart data + churn events
□ GET /v1/analytics/articles — all articles metrics table
□ GET /v1/analytics/articles/:id — single article deep dive - Traffic sources (referrer breakdown) - Reading funnel (started vs 50% vs completed) - Time-to-complete distribution - Subscriber conversions attributed to this article

FRONTEND TASKS (Dev 2):
□ Build analytics overview page (StatCard row + key charts)
□ Build SubscriberGrowthChart (line chart, daily/weekly/monthly toggle)
□ Build traffic source attribution chart (donut)
□ Build article-level analytics detail page
□ Build reading funnel visualization (horizontal bar)
□ Build date range selector (last 7/30/90/365 days, custom)

Branch: feat/78-build-creator-analytics-dashboard
Commit messages:
feat(analytics): implement creator analytics endpoints with multiple time ranges
feat(analytics): add article-level analytics with reading funnel and attribution
feat(ui): build analytics dashboard with growth charts and article performance

```

---

### WEEK 27 — Newsletter System

**Goal:** Creators can write and send newsletters to their subscriber list. Open/click tracking.

**Owner:** Dev 1 (email infrastructure), Dev 3 (newsletter backend)

```

TASKS:
□ Integrate Resend email API
□ Build email template system (HTML email templates — mobile-responsive)
Templates: newsletter_broadcast, new_article_notification, welcome_subscriber,
new_follower_notification, earnings_report, magic_link
□ POST /v1/newsletters — create newsletter draft
□ PATCH /v1/newsletters/:id — update newsletter content
□ POST /v1/newsletters/:id/send — send to subscriber list - Rate limit: max 1 newsletter per 24 hours - Segment: all / free subscribers / paid subscribers - Personalize: {{firstName}} merge tag support - Unsubscribe link automatically appended
□ POST /v1/newsletters/:id/preview — send test email to creator
□ GET /v1/newsletters/:id/analytics — open rate, click rate, unsub rate
□ Webhook: Resend delivery events → update email_events table
□ Implement email preferences + unsubscribe (respects suppression list)

Branch: feat/81-implement-newsletter-broadcast-system
Commit messages:
feat(email): integrate Resend and build responsive HTML email templates
feat(email): implement newsletter creation, scheduling, and delivery
feat(email): add email analytics tracking with open and click events

```

---

### WEEK 28 — Creator Payout System + Tax Documentation

**Goal:** Monthly payouts execute automatically. Creators can download tax documents.

**Owner:** Dev 1

```

TASKS:
□ Build payout execution service: - Query creators with unpaid earnings above threshold ($25 default) - Create Stripe Transfer to each creator's Connect account - Record in creator_payouts table - Send payout_confirmed email notification
□ Schedule: Run payout on 5th of each month (BullMQ cron)
□ Handle payout failures gracefully: - Log failure in creator_payouts - Send failure notification email with reason - Retry after 48 hours
□ Build creator payout settings: - PATCH /v1/users/me/payout-settings → minimum payout threshold, payout schedule
□ Implement earnings summary email (monthly, sent with payout notification)
□ GET /v1/analytics/earnings/export → CSV of all earnings for tax reporting
□ Build 1099 summary generation (for US creators with >$600/year)

Branch: feat/84-implement-creator-payout-system
Commit messages:
feat(payments): implement automated monthly payout execution via Stripe Connect
feat(payments): add payout failure handling with retry and notifications
feat(payments): build earnings export and tax documentation for creators

```

**End of Phase 3 Acceptance Criteria:**

```

✓ Reader can subscribe to platform ($4/$8/mo) via Stripe Checkout
✓ Creator can create paid subscription tiers
✓ Reader can pay creator directly (5% platform fee)
✓ Monthly earnings calculated with transparent formula
✓ Earnings dashboard shows full signal breakdown
✓ Creator can simulate earnings with different metrics
✓ Newsletter sends to subscriber list with tracking
✓ Monthly payouts execute automatically to bank account
✓ All Stripe webhooks processed idempotently

```

---

## PHASE 4: AI FEATURES (Weeks 29–36)

### WEEK 29 — AI Writing Assistant (Backend)

**Goal:** Claude API integrated. Writing assistance endpoint handles all 5 modes.

**Owner:** Dev 3

```

TASKS:
□ Install Anthropic SDK
□ Build aiService.js: - writingAssistant(content, mode, context) → streaming response - Modes: grammar_style, clarity, restructure, headline_options, expand_paragraph - Rate limiting: 100 requests/day (free), 1000/day (pro) - Cost tracking: log tokens used to ai_usage_log
□ POST /v1/ai/writing-assistant
Body: { content, mode, selectionText, fullDraftContext }
Response: streaming (SSE — Server-Sent Events)
□ Implement SSE handler for streaming AI responses
□ System prompt engineering for each mode: - grammar_style: preserve author voice, fix errors only - clarity: simplify without losing meaning - restructure: suggest section reorganization - headline_options: return 5 options, varying hooks - expand_paragraph: add depth, add examples
□ Implement AI response quality checks (prevent toxic output)
□ Implement context window management (summarize long drafts)

Branch: feat/87-implement-ai-writing-assistant-backend
Commit messages:
feat(ai): integrate Anthropic Claude API with streaming SSE responses
feat(ai): implement five writing assistant modes with voice-preserving prompts
feat(ai): add AI usage tracking and rate limiting by user tier

```

---

### WEEK 30 — AI Writing Assistant (Frontend)

**Goal:** AI assistant panel in editor renders streaming responses. UX is seamless, never disruptive.

**Owner:** Dev 2

```

TASKS:
□ Build AiAssistantPanel organism (slide-in right sidebar): - Mode selector tabs (Grammar, Clarity, Restructure, Headlines, Expand) - Context display (selected text or full draft) - "Improve" trigger button - Streaming response renders in real-time (character by character) - AiThinkingDot molecule (animated during generation) - Response display area (rendered markdown) - Accept / Reject buttons (for paragraph/restructure modes) - 5-item list (for headline options mode) - Each headline has "Apply" button (replaces article title in editor)
□ Implement AiSuggestionChip molecule (inline small chip in editor)
□ Implement streaming SSE consumer (EventSource API)
□ Implement usage counter display ("87 / 100 daily suggestions used")
□ Implement upgrade prompt when limit reached
□ Build keyboard shortcut: Cmd+K opens AI panel with selected text pre-filled
□ Build free tier limitation UI (blurred assistant, upgrade CTA)

Branch: feat/90-build-ai-writing-assistant-editor-panel
Commit messages:
feat(ai): build AI assistant panel with streaming response and mode selection
feat(ai): implement real-time SSE streaming consumer with character animation
feat(ai): add usage limit display and upgrade prompts for AI features

```

---

### WEEK 31 — Feed Recommendation Algorithm V2

**Goal:** Feed recommendations are dramatically better. New writer discovery works. Quality floor enforced.

**Owner:** Dev 3 (algorithm), Dev 1 (infrastructure)

```

TASKS:
□ Build user interest profile: - Compute from: reading history (last 90 days), follows, bookmarks, reactions - Tag affinity scores (how often user reads each tag) - Author affinity scores (engagement rate with each author) - Store in Redis (update daily via background job)
□ Build article quality score: - Input: read_completion_rate, bookmark_rate, response_rate - Quality floor: articles below 0.35 completion rate excluded from recommendations - Score stored on articles table (updated nightly)
□ Build recommendation candidate generation: - Generate 200 candidates per user per request - Sources: followed authors (40%), tag affinity (40%), diversity injection (20%) - Exclude: seen in last 72 hours, author explicitly muted
□ Build recommendation ranking: - Re-rank 200 candidates by: quality × (interest alignment × 0.5 + recency × 0.3 + diversity × 0.2) - Apply diversity penalty (max 2 per author per feed page) - Return top 20
□ Build New to You feed: - Only non-followed authors - Rank by: quality score × tag affinity × serendipity injection
□ Build serendipity injection (20% of feed = outside known interests)

Branch: feat/93-implement-recommendation-algorithm-v2
Commit messages:
feat(feed): build user interest profile with 90-day tag and author affinity
feat(feed): implement quality floor and recommendation candidate generation
feat(feed): add diversity-weighted ranking with serendipity injection

```

---

### WEEK 32 — AI Article Summaries

**Goal:** Every published article gets a 3-sentence AI summary. Shown before article. Improves reader decisions.

**Owner:** Dev 3

```

TASKS:
□ Build summarization service: - Input: article body_text (truncated to 4K tokens for Haiku) - Prompt: extract 3 sentences covering main argument, key insight, practical takeaway - Model: Claude Haiku (cost-efficient, sufficient quality) - Cache result in article_ai_summaries table - Generation triggered on article.published event
□ POST /v1/ai/summarize/:articleId — manual trigger (Pro creator)
□ GET /v1/articles/:slug → include aiSummary field in response
□ Frontend: build collapsible summary panel above article - Collapsed by default on desktop, expanded on mobile - "AI-generated summary" label with info tooltip - Collapse/expand toggle with smooth animation
□ A/B test: show summary to 50% of readers, track if completion rate improves

Branch: feat/96-implement-ai-article-summaries
Commit messages:
feat(ai): implement automated article summarization on publish with Claude Haiku
feat(ui): add collapsible AI summary panel above article content

```

---

### WEEK 33 — AI Content Analytics

**Goal:** After publishing, creators get actionable AI-generated insights on article performance.

**Owner:** Dev 3 (service), Dev 2 (UI)

```

TASKS:
□ Build content analytics AI service: - Input: article metadata + engagement metrics (7 days after publish) - Analyze: headline effectiveness (CTR), hook (first 100 words vs completion), length, topic, structure - Generate: 3 specific insights + 3 actionable recommendations for next article - Model: Claude Haiku - Run 7 days after publish (BullMQ delayed job)
□ GET /v1/analytics/articles/:id/ai-insights → returns insights + recommendations
□ Frontend: build AI Performance Insights card on article analytics page - Loading state: "Generating insights..." (if <7 days old) - 3 insight cards with specific data references - 3 recommendation chips with copy that creators can implement

Branch: feat/99-implement-ai-content-performance-analytics
Commit messages:
feat(ai): implement post-publish performance analysis with Claude Haiku
feat(ui): build AI insights card on article analytics page

```

---

### WEEK 34 — AI Moderation Signals

**Goal:** Published articles receive quality + spam signals. Low-quality content reduced in distribution.

**Owner:** Dev 1 (integration), Dev 3 (classification)

```

TASKS:
□ Build content classification service: - Input: article title + body_text (first 1000 words) - Classify: spam probability (0–1), AI-generated probability (0–1), quality_signal (low/medium/high) - Model: Claude Haiku with constrained classification prompt - Result stored on articles table (moderation_signals JSONB column — add migration) - Triggers on article.published event (async, does not block publish)
□ Integrate moderation signals into feed ranking: - High spam probability → exclude from recommendations - AI-generated probability > 0.8 → distribute at 30% of normal rate - quality_signal = low → exclude from "New to You" feed
□ Build admin moderation queue (basic — just a list of flagged articles for manual review)
□ Human review outcome updates moderation_signals (override AI classification)

Branch: feat/102-implement-ai-content-moderation-signals
Commit messages:
feat(ai): implement content classification for spam and quality signals
feat(feed): integrate moderation signals into feed distribution algorithm
feat(admin): build content moderation review queue

```

---

### WEEK 35 — Weekly Digest Email System

**Goal:** Every reader gets a personalized weekly digest of 5 articles. AI generates subject line.

**Owner:** Dev 3 (digest generation), Dev 1 (email delivery)

```

TASKS:
□ Build weekly digest generator: - Runs every Monday 06:00 UTC (BullMQ cron) - Per active reader (read at least once in last 14 days): - Fetch top 10 candidates from recommendation engine - Remove articles from already-read list - Select top 5 - Generate AI subject line: "Your week in [top tag]: 5 reads you'll love" - Build personalized email HTML (using email template system) - Queue for delivery via Resend (batch, rate-limited)
□ GET /v1/users/me/digest-preferences → manage digest settings
□ PATCH /v1/users/me/digest-preferences → opt out / change day
□ Track: digest open rate, click rate, attributable reads per issue

Branch: feat/105-implement-personalized-weekly-digest
Commit messages:
feat(email): implement AI-personalized weekly reading digest generation
feat(email): add weekly digest scheduling and delivery with performance tracking

```

---

### WEEK 36 — AI Feature Polish & Cost Optimization

**Goal:** AI features are reliable, fast, and within budget. Usage monitoring operational.

**Owner:** Dev 3 (optimization), Dev 1 (monitoring)

```

TASKS:
□ Audit all AI API calls: - Are all responses cached where appropriate? - Are prompts optimized for token efficiency? - Are Haiku vs Sonnet model choices correct?
□ Implement Redis caching for AI responses: - Same article summarization request: serve from cache - Cache key: hash(articleId + model_version) - TTL: 30 days
□ Build AI cost dashboard (admin view): - Total spend by feature, by period - Cost per active user - Top users by AI consumption - Projected monthly cost at current growth rate
□ Implement per-user monthly AI budget: - Free tier: $0.10 equivalent / month - Pro tier: $1.00 equivalent / month
□ Add AI feature degradation (if provider is down, graceful fallback)
□ Load test AI endpoints (concurrent writers using AI assistant)

Branch: perf/108-optimize-ai-feature-cost-and-reliability
Commit messages:
perf(ai): implement Redis caching for AI responses to reduce API costs
feat(admin): build AI cost monitoring dashboard with spend tracking
perf(ai): add per-user AI budget enforcement and graceful degradation

```

---

## PHASE 5: COMMUNITY (Weeks 37–44)

### WEEK 37 — Reaction System

**Goal:** 5-reaction system replaces claps. Each reaction is a meaningful signal.

**Owner:** Dev 3 (backend), Dev 2 (frontend)

```

BACKEND TASKS:
□ POST /v1/reactions/:articleId — { reactionType: 'insightful'|'disagree'|'surprising'|'moving'|'practical' }
□ DELETE /v1/reactions/:articleId — remove reaction (toggle off)
□ GET /v1/reactions/:articleId — reaction counts per type + viewer's reaction
□ Reactions stored in article_reactions table
□ Reaction counts denormalized to articles table (for feed performance)
□ 'disagree' reaction → highest weight in quality signal (valuable debate indicator)

FRONTEND TASKS:
□ Build ReactionButton atom (icon + count, filled/unfilled states)
□ Build ReactionBar molecule (5 reactions in a row)
□ Implement optimistic updates (instant feedback, rollback on error)
□ Build reaction tooltip (hover → see label "Insightful")
□ Build reaction summary in feed card (show top 2 reactions + count)
□ No reaction counts visible in editor draft (only on published articles)

Branch: feat/111-implement-five-reaction-system
Commit messages:
feat(community): implement five-reaction system replacing clap mechanic
feat(ui): build reaction bar with optimistic updates and hover labels

```

---

### WEEK 38 — Inline Paragraph Comments

**Goal:** Comments are anchored to specific paragraphs, not buried at the bottom.

**Owner:** Dev 2 (UI/UX), Dev 3 (backend), Dev 1 (real-time, if Pub/Sub available)

```

BACKEND TASKS:
□ POST /v1/comments — { articleId, blockId, parentCommentId?, content }
□ PATCH /v1/comments/:id — edit own comment
□ DELETE /v1/comments/:id — delete own comment (soft delete)
□ GET /v1/comments/:articleId — all comments grouped by blockId
□ POST /v1/reactions to comments (same reaction types)
□ Notify article author on new comment (notification record)

FRONTEND TASKS:
□ Implement inline comment UI in ArticleBody: - Each paragraph on hover: shows comment bubble icon in margin - Click bubble → CommentThread opens anchored to paragraph - Thread shows existing comments + compose field - Thread is collapsible (doesn't push content)
□ Build CommentThread organism: - Comment item (avatar + author + text + timestamp + reactions) - Reply input (nested, 1 level only) - Edit/delete controls (own comments)
□ Build comment count indicator in article header
□ Build comments panel (all comments listed by section, like GitHub PR review summary)

Branch: feat/114-implement-inline-paragraph-comment-system
Commit messages:
feat(community): implement paragraph-anchored comment threads
feat(ui): build inline comment thread UI anchored to article paragraphs
feat(ui): add comment count indicator and all-comments panel view

```

---

### WEEK 39 — Notification System

**Goal:** In-app notifications. Email notifications. User controls their notification preferences.

**Owner:** Dev 3 (backend), Dev 2 (frontend)

```

BACKEND TASKS:
□ Notification creation service: - createNotification(userId, type, data) → writes to notifications table - Types: new_follower, new_subscriber, new_comment, new_reaction,
article_published_by_followed, earnings_payout_sent, system_announcement
□ GET /v1/users/me/notifications — paginated notifications (latest first)
□ PATCH /v1/users/me/notifications/:id/read — mark read
□ PATCH /v1/users/me/notifications/read-all — mark all read
□ GET /v1/users/me/notifications/unread-count — badge count
□ Email notification dispatch: - On new_comment: send email to article author (if preference enabled) - On new_subscriber: send email to creator (daily digest of new subs, not per-sub) - On earnings_payout_sent: always send email (financial)
□ PATCH /v1/users/me/notification-preferences — control which events trigger email

FRONTEND TASKS:
□ Build notification bell icon with unread count badge
□ Build NotificationPanel (slide-in from right or dropdown): - List of notifications (grouped by date) - Unread state visual distinction - Click → navigate to relevant page - Mark all read button
□ Build NotificationItem molecule (avatar + description + timestamp)
□ Build notification preferences settings page
□ Implement real-time notification count update (polling every 30 seconds — not WebSocket yet)

Branch: feat/117-implement-notification-system
Commit messages:
feat(community): implement notification creation service for all event types
feat(community): add notification endpoints with read state management
feat(ui): build notification panel with unread badge and preference controls

```

---

### WEEK 40 — Bookmarks & Reading Lists

**Goal:** Save articles to organized reading lists. Continue reading with position preserved.

**Owner:** Dev 2 (primary)

```

BACKEND TASKS (Dev 3):
□ POST /v1/bookmarks/:articleId — save article
□ DELETE /v1/bookmarks/:articleId — remove
□ GET /v1/bookmarks — all saved articles (with pagination)
□ Reading position: save scroll_depth per article per user (PATCH /v1/reading-events with position)
□ GET /v1/reading-events/in-progress — articles started but not finished (for "continue reading")

FRONTEND TASKS (Dev 2):
□ Build BookmarkButton atom (toggle, shows filled when saved)
□ Build bookmarks page (grid of saved articles, organized by save date)
□ Build "Continue Reading" section on feed page (3 in-progress articles)
□ Build reading position restore (on article open, scroll to last position)
□ Build reading list empty state with "Start exploring" CTA

Branch: feat/120-implement-bookmarks-and-reading-position
Commit messages:
feat(reading): implement article bookmarking and reading position persistence
feat(ui): build bookmarks page and continue reading feature

```

---

### WEEK 41 — Annotations System

**Goal:** Readers can annotate highlights with private notes. Public highlights show community wisdom.

**Owner:** Dev 2 (UI), Dev 3 (backend)

```

BACKEND TASKS:
□ POST /v1/annotations — { articleId, blockId, selectedText, note, isPublic }
□ PATCH /v1/annotations/:id — update note or visibility
□ DELETE /v1/annotations/:id
□ GET /v1/annotations/:articleId — viewer's own annotations
□ GET /v1/annotations/:articleId/public — public annotations from all readers
(aggregated by blockId — show most-highlighted passages)

FRONTEND TASKS:
□ Build text selection → highlight toolbar in Study mode - Highlight: save with amber/yellow color, no note - Annotate: highlight + open note input - Share: generates shareable card
□ Build annotation sidebar (in Study mode): - List of all annotations in this article - Organized by position in article - Click → scrolls to highlighted text
□ Build public highlights overlay: - Show passages highlighted by 3+ readers (subtle amber underline) - Hover → see count ("47 readers highlighted this")
□ Build annotations export (Markdown format — for Obsidian/Notion compatibility)
□ Build annotation search (search within own annotations)

Branch: feat/123-implement-annotations-and-public-highlights
Commit messages:
feat(reading): implement annotation creation with public/private visibility
feat(ui): build text selection toolbar and annotation sidebar for Study mode
feat(ui): add public highlights overlay showing community wisdom

```

---

### WEEK 42 — Interest Circles (Basic)

**Goal:** Topic-based communities. Create, join, leave circles. Circle feed shows relevant articles.

**Owner:** Dev 3 (backend), Dev 2 (frontend)

```

BACKEND TASKS:
□ POST /v1/circles — create circle (name, description, topic_tags)
□ GET /v1/circles/:slug — circle detail + stats
□ POST /v1/circles/:id/join
□ DELETE /v1/circles/:id/leave
□ GET /v1/circles/:id/feed — articles tagged with circle's topic_tags (curated)
□ GET /v1/circles (search) — discover circles (keyword + tag filter)
□ Recommend circles based on user reading history (tag affinity match)

FRONTEND TASKS:
□ Build CircleCard organism (name, description, member count, join button)
□ Build circle discovery page (search + recommended circles)
□ Build circle detail page (CircleCard header + CircleFeed + member leaderboard)
□ Build circle article feed (same ArticleFeedCard, filtered to circle topic)
□ Build "My Circles" section in authenticated feed sidebar
□ Build Circles tab in main feed (content from joined circles)

Branch: feat/126-implement-interest-circles
Commit messages:
feat(community): implement interest circle creation, discovery, and membership
feat(ui): build circle discovery and detail pages with member leaderboard
feat(feed): add circles tab showing content from joined topic communities

```

---

### WEEK 43 — Creator Office Hours & Ask the Author

**Goal:** Readers can ask questions that authors answer publicly. Creates ongoing engagement loop.

**Owner:** Dev 3 (backend), Dev 2 (frontend)

```

TASKS:
□ Build "Ask the Author" feature (extends comment system): - Any reader can submit a question via comment with type='question' - Author can mark their response as the answer - Questions surface in a separate tab below article - Top questions shown in article feed card (preview)
□ GET /v1/articles/:id/questions → unanswered questions first
□ POST /v1/comments (type: 'question')
□ PATCH /v1/comments/:id/answer → mark comment as author answer
□ Build question tab on article page (Q&A section below article body)
□ Build author answer UI (highlighted, "Author" badge)
□ Build question compose box ("Have a question for the author?")

Branch: feat/129-implement-ask-the-author-feature
Commit messages:
feat(community): implement ask-the-author Q&A feature with answered marking
feat(ui): build article Q&A section with author answer highlighting

```

---

### WEEK 44 — Community Polish & Performance

**Goal:** All community features work together cohesively. Community metrics added to creator analytics.

**Owner:** Dev 3 (metrics), Dev 2 (UX polish)

```

TASKS:
□ Add community metrics to creator analytics: - Comments received per article - Questions asked and answered rate - Reaction breakdown per article
□ Build creator Quality Score display (based on read completion, reactions, comments)
□ Polish: reaction animations (micro-animations on react)
□ Polish: comment notification badge clears on page visit
□ Performance: paginate comment threads (load more)
□ Performance: lazy-load annotation sidebar
□ Fix any cross-feature bugs found during full-feature testing

Branch: feat/132-community-polish-and-metrics
Commit messages:
feat(analytics): add community engagement metrics to creator analytics
perf(community): implement pagination for comment threads
fix(community): resolve notification badge and reaction animation issues

```

**End of Phase 5 Acceptance Criteria:**

```

✓ 5 reactions work with optimistic updates
✓ Inline comments anchored to paragraphs
✓ Authors can answer questions publicly
✓ Notifications appear for all events
✓ Bookmarks save with reading position
✓ Annotations in Study mode work with public highlights
✓ Circles discoverable and joinable
✓ Circle feed shows relevant content

```

---

## PHASE 6: QUALITY & LAUNCH (Weeks 45–52)

### WEEK 45 — Performance Audit & Optimization

**Goal:** Core Web Vitals are green. Article pages load in <1 second. Feed is buttery smooth.

**Owner:** Dev 2 (frontend perf), Dev 1 (backend perf)

```

FRONTEND PERFORMANCE TASKS:
□ Run Lighthouse audit on: Home, Article, Feed, Editor, Profile pages
□ Target: LCP <2.5s, FID <100ms, CLS <0.1, FCP <1.8s
□ Identify and fix all Lighthouse issues
□ Implement route-level code splitting (already via React.lazy, verify)
□ Audit bundle size: install bundle analyzer
□ Remove unused dependencies
□ Optimize images: WebP, correct sizes, lazy loading
□ Implement virtual scrolling for long article feeds (if needed)
□ Profile React renders: eliminate unnecessary re-renders

BACKEND PERFORMANCE TASKS:
□ Identify N+1 query problems in all API responses
□ Add database indexes for all frequent queries (verify EXPLAIN ANALYZE)
□ Implement Redis caching for: feed (TTL 5 min), article (TTL 1 hour), profile (TTL 15 min)
□ Cache invalidation strategy on data mutation
□ Add database connection pooling configuration (pg-pool settings)
□ Run load test (k6 or Artillery): simulate 100 concurrent readers

Branch: perf/135-performance-audit-and-optimization
Commit messages:
perf(web): eliminate render bottlenecks and optimize code splitting
perf(api): add Redis caching layer for feed, article, and profile endpoints
perf(db): add missing indexes and resolve N+1 query patterns

```

---

### WEEK 46 — SEO System

**Goal:** Every article page is SEO-optimized. VAMI content ranks on Google.

**Owner:** Dev 2 (meta tags), Dev 1 (sitemap, structured data)

```

TASKS:
□ Implement dynamic meta tags per page: - <title>: Article title | VAMI - <meta description>: Article subtitle or AI summary - Open Graph: og:title, og:description, og:image, og:url, og:type=article - Twitter Card: summary_large_image - Article meta: article:author, article:published_time, article:tag
□ Implement canonical URL for all article pages
□ Implement hreflang (when translation ships)
□ Generate dynamic sitemap.xml (all published public articles)
□ Generate sitemap for creator profiles
□ robots.txt (allow: articles and profiles, disallow: dashboard, api, editor)
□ Implement JSON-LD structured data (Article, Person, BreadcrumbList)
□ Verify with Google Rich Results Test
□ Set up Google Search Console
□ Implement 301 redirects for old URL patterns (future import traffic)

Branch: feat/138-implement-comprehensive-seo-system
Commit messages:
feat(seo): implement dynamic meta, Open Graph, and Twitter Card tags per page
feat(seo): add JSON-LD structured data for articles and creator profiles
feat(seo): generate dynamic XML sitemap and configure robots.txt

```

---

### WEEK 47 — Accessibility Audit (WCAG AA)

**Goal:** VAMI is accessible to all users. WCAG 2.1 AA compliance across all pages.

**Owner:** Dev 2 (primary audit), Dev 1 (infrastructure)

```

AUDIT CHECKLIST (run on every page):
□ Run axe-core automated scan (fix all critical and serious violations)
□ Keyboard navigation test: can user navigate EVERY interaction without mouse? - Tab order is logical - Focus indicator always visible (never hidden via CSS outline:none) - Modal/dialog traps focus correctly - Dropdown menus openable via keyboard - Editor commands accessible via keyboard shortcuts
□ Screen reader test (VoiceOver on Mac, NVDA on Windows): - All images have meaningful alt text - All icons have aria-label - Form inputs have associated labels - Error messages announced - Dynamic content changes announced (aria-live regions)
□ Color contrast: all text passes WCAG AA (4.5:1 for body, 3:1 for large text)
□ Check dark mode contrast separately
□ Text resize test: app usable at 200% zoom
□ Motion: respect prefers-reduced-motion (no auto-playing animations)
□ Fix ALL issues found before proceeding to Week 48

Branch: fix/141-wcag-aa-accessibility-compliance
Commit messages:
fix(a11y): add missing ARIA labels and keyboard navigation support
fix(a11y): implement focus management for modals and dropdowns
fix(a11y): correct color contrast violations in light and dark modes
fix(a11y): add screen reader announcements for dynamic content

```

---

### WEEK 48 — Security Audit

**Goal:** No critical or high security vulnerabilities. All OWASP Top 10 addressed.

**Owner:** Dev 1 (backend security), Dev 2 (frontend security)

```

SECURITY CHECKLIST:
□ Run npm audit on all packages — fix critical and high vulns
□ SQL injection: verify all queries use parameterized statements (no exceptions)
□ XSS: verify all user content is sanitized before rendering and before storage - Use DOMPurify on any HTML rendered from user input - Verify Tiptap editor serialization is sanitized
□ CSRF: not applicable for JWT-based API, but verify no session cookie auth
□ Authentication: - JWT tokens never stored in localStorage (use httpOnly cookies for refresh tokens) - Verify refresh token rotation on every use - Verify old refresh tokens are invalidated after rotation
□ Authorization: - Verify every endpoint checks ownership (no IDOR vulnerabilities) - Test: can User A access User B's private drafts? (should be 403) - Test: can reader access creator-only endpoints? (should be 403)
□ Rate limiting: verify all auth endpoints are rate limited
□ Stripe webhook signature: verify every webhook is verified (not just trusted)
□ File uploads: verify file type validation, size limits, no execution
□ Secrets: verify no secrets in codebase (git log scan)
□ Security headers: verify all Helmet headers present and correct
□ HTTPS: verify redirect from HTTP → HTTPS everywhere
□ Password handling: N/A (magic link only) — verify tokens are hashed in DB
□ Dependency pinning: lock all dependency versions in package.json

Branch: fix/144-security-audit-and-hardening
Commit messages:
fix(security): enforce parameterized queries and add XSS sanitization
fix(security): implement httpOnly cookie for refresh token storage
fix(security): harden authorization middleware with ownership checks
fix(security): verify Stripe webhook signatures on all payment events

```

---

### WEEK 49 — Test Coverage & Quality Gates

**Goal:** Test coverage meets minimums. E2E tests cover critical user flows.

**Owner:** Dev 3 (test writing), all devs verify their own modules

```

COVERAGE TARGETS:
Backend: 70% line coverage minimum
Frontend: 60% line coverage minimum

CRITICAL FLOWS REQUIRING E2E TESTS (Playwright):
□ User can sign up via magic link, complete onboarding, see feed
□ Writer can create draft, write content, publish article
□ Reader can find article via search, read, bookmark, react
□ Creator can view earnings dashboard, understand formula
□ Subscriber can subscribe to creator, receive newsletter
□ Writer can export subscriber list as CSV

E2E TEST SETUP:
□ Install Playwright
□ Configure test environment (uses staging-like local environment)
□ Write auth helpers (reusable login for test users)
□ Write page object models for: Feed, Editor, Article, Profile, Analytics

UNIT TEST GAPS (fill the biggest gaps):
□ authService (target: 95%)
□ earningsCalculationService (target: 100% — financial logic)
□ recommendationService (target: 85%)
□ aiService (target: 80%)
□ All React hooks (target: 80%)

Branch: test/147-improve-test-coverage-and-add-e2e-tests
Commit messages:
test(api): increase authService and earnings calculation test coverage
test(web): add E2E tests for critical user flows with Playwright
test(web): improve React hook unit test coverage

```

---

### WEEK 50 — Beta Preparation

**Goal:** 100 founding writers recruited. Import tool works. Waitlist system operational.

**Owner:** Dev 3 (import tool), Dev 2 (onboarding), Dev 1 (infrastructure)

```

TASKS:
□ Build content import tool: - Import from Medium: paste profile URL → fetch + convert articles to blocks - Import from Substack: export ZIP upload → parse and import - Import from HTML file: convert to block format - Show import progress, per-article success/failure report
□ Build onboarding wizard (new user flow): - Step 1: Are you a reader, writer, or both? - Step 2: Select 5+ topics you're interested in - Step 3: Follow 3 recommended creators in your topics - Step 4: Read your first article recommendation - (Writer path): Step 2.5: Set up your creator profile
□ Build waitlist page (pre-launch): - Email signup - Referral mechanism (each referral moves up list) - Referral count displayed ("You've referred 3 people")
□ Build founding creator invite flow: - Invite-only signup during beta (invite code required) - Special "Founding Creator" badge on profile - Lifetime Pro plan assignment
□ Infrastructure: verify staging handles 100 concurrent users

Branch: feat/150-beta-launch-preparation
Commit messages:
feat(onboarding): implement content import from Medium, Substack, and HTML
feat(onboarding): build new user onboarding wizard with topic and creator selection
feat(growth): add waitlist page with referral mechanism

```

---

### WEEK 51 — Beta Launch (Invite-Only)

**Goal:** 100 founding creators on platform. Active feedback collection. Bug fixes in real-time.

**Owner:** All devs

```

TASKS:
□ Send invites to 100 founding creators (stagger: 10 per day × 10 days)
□ Monitor: error rate (Sentry dashboard), server health (Railway metrics), DB performance
□ Daily feedback review: synthesize GitHub Issues from creator feedback
□ Bug fix prioritization: - P0 (block): fix within 4 hours, hotfix deploy to production - P1 (bad UX): fix within 2 days, deploy in weekly release - P2 (nice to have): add to backlog
□ Create hotfix pipeline: - hotfix branch → staging (verify) → main (emergency approval, 1 dev is enough)
□ Track: daily active writers, articles published, subscription conversions

HOTFIX PROCESS:

1. Branch: hotfix/[issue-number]-[description] from main
2. Fix issue
3. Deploy to staging, verify fix
4. PR to main (emergency — 1 approval sufficient)
5. Commit message: fix(scope): resolve [specific issue] (hotfix)
6. After merge to main: merge main back to develop (keep in sync)

BETA METRICS TO MONITOR DAILY:

- DAU / WAU
- Articles published
- Errors logged (Sentry)
- P95 API response time
- AI API costs

```

---

### WEEK 52 — Public Launch

**Goal:** Product is public. Product Hunt launch. Press coverage. Growth flywheel initiated.

**Owner:** All devs + founders

```

PRE-LAUNCH CHECKLIST (verify 48 hours before):
□ All P0 and P1 bugs from beta resolved
□ Infrastructure scaled for expected traffic (upgrade plans if needed)
□ Monitoring and alerting configured (PagerDuty or manual on-call rotation)
□ Custom domain fully configured (vami.app) with SSL
□ Email deliverability verified (DMARC, SPF, DKIM records)
□ Stripe is in live mode (not test mode) in production
□ Privacy policy and Terms of Service published
□ GDPR: cookie consent banner (if applicable to user geography)
□ Support email functional (hello@vami.app)

LAUNCH DAY:
□ Product Hunt submission prepared and scheduled (12:01 AM PT)
□ Founding creators informed: post simultaneously on their existing platforms
□ Founders post Twitter/X thread
□ Press pitches sent (The Information, Digiday, creator economy newsletters)
□ Waitlist conversion emails sent
□ Remove invite code requirement (open to all)
□ Monitor all systems continuously for 12 hours post-launch

POST-LAUNCH (first 72 hours):
□ Daily metrics review
□ Personal responses to all feedback
□ Rapid iteration on feedback (have hotfix process ready)

Branch: chore/public-launch-readiness
Commit message: chore: prepare platform for public launch

```

---

# SECTION K — TESTING FRAMEWORK

## K.1 Testing Stack

```

Backend Unit Tests: Jest
Backend Integration: Jest + supertest (HTTP assertions)
Frontend Unit Tests: Vitest
Frontend Components: Vitest + React Testing Library
E2E Tests: Playwright
Visual Regression: (Deferred — Week 52+, use Percy or Chromatic)
Load Testing: k6 (scripts in /scripts/load-tests/)

```

## K.2 Testing Conventions

**Backend test file structure:**

```

Each test file tests ONE module.
Three sections: describe → it/test.

Naming convention:
describe('moduleName')
describe('methodName')
it('should [expected behavior] when [condition]')
it('should throw [error] when [invalid condition]')

Arrange-Act-Assert pattern in every test.
No test shares state with another test (beforeEach resets state).
Database tests use transactions rolled back after each test (not deletion).

```

**Frontend test priorities:**

```

Test in this order of importance:

1. Custom hooks (stateful logic, highest value)
2. Form components (complex interaction)
3. Service layer (API calls)
4. Pure utility functions
5. Simple presentational components (lowest value — skip if rushed)

```

## K.3 Test Coverage Requirements

```

BACKEND:
authService.js: 90% minimum (security-critical)
earningsService.js: 100% minimum (financial-critical)
articleService.js: 75% minimum
recommendationService.js: 70% minimum
All other services: 60% minimum
Route handlers: Integration test coverage only (unit test services)

FRONTEND:
All custom hooks: 80% minimum
All form components: 70% minimum
All service modules: 75% minimum
All utility functions: 90% minimum
UI components: 50% minimum (basic render tests)

```

---

# SECTION L — SECURITY FRAMEWORK

## L.1 Security Principles

**Defense in depth.** Multiple independent security controls. Failure of one does not compromise the system.

**Least privilege.** Every system component has exactly the permissions it needs, nothing more.

**Zero trust API.** Every API request is authenticated and authorized. No implicit trust.

## L.2 Security Controls by Category

```

AUTHENTICATION:

- Magic link tokens: 32-byte random (crypto.randomBytes), stored as SHA-256 hash
- JWT: RS256 asymmetric signing (if possible) or HS256 with 64+ char secret
- JWT lifetime: 15 minutes access token, 90 days refresh token
- Refresh token: rotated on every use, old tokens invalidated
- OAuth state parameter: CSRF prevention on OAuth flows

AUTHORIZATION:

- Every route: authenticated (valid JWT required)
- Every data mutation: ownership verified (user owns the resource)
- Creator-only routes: middleware checks is_creator flag
- Pro-only features: middleware checks creator_tier = 'pro'

INPUT VALIDATION:

- Every API endpoint: Zod schema validation
- File uploads: MIME type check + magic bytes check + size limit
- Image uploads: server-side validation via Cloudinary (not client-only)
- HTML content: DOMPurify sanitization before storage

DATA PROTECTION:

- Passwords: not stored (magic link only)
- Refresh tokens: hashed with SHA-256 before storage
- PII in logs: redacted (email → e\*\*\*@domain.com in logs)
- Database at rest: encrypted by Neon.tech (platform-level)
- Stripe data: never stored locally (reference Stripe IDs only)

TRANSPORT:

- HTTPS only (Cloudflare enforces)
- HSTS header (max-age=31536000, includeSubdomains)
- Certificate: managed by Cloudflare and Vercel

RATE LIMITING:

- Global: 100 req/15 min per IP (unauthenticated)
- Authenticated: 1000 req/15 min per user
- Magic link: 5 req/hour per email + per IP
- AI endpoints: per-tier daily limits
- Newsletter send: 1/24 hours per creator

SECRETS MANAGEMENT:

- All secrets: GitHub Secrets (never in codebase)
- Secret rotation: documented process, perform on team member departure
- .env files: never committed, verified by .gitignore

```

---

# SECTION M — DEPLOYMENT STRATEGY

## M.1 Deployment Protocol

**Every deployment follows this sequence without exception:**

```

FEATURE DEPLOY (standard — weekly):

1. Close sprint: merge all approved feature PRs to develop
2. Create release branch: git checkout -b release/v[version] from develop
3. Version bump only: update package.json version numbers
4. Update CHANGELOG.md (from commit log)
5. Open PR: release/v[version] → main
6. Required: both non-deploying devs approve
7. Required: all CI checks pass
8. Merge (squash): release PR merged to main
9. Tag: git tag v[version] on main
10. Auto-deploy triggers: GitHub Actions deploy-production.yml
11. Monitor: watch Sentry, Railway, and PostHog for 30 minutes
12. Merge main → develop (keep in sync): open PR develop ← main

HOTFIX DEPLOY (emergency):

1. Branch from main: hotfix/[issue]-[description]
2. Fix only the specific issue
3. Deploy to staging, verify fix
4. PR to main: 1 approval sufficient (emergency exception)
5. After merge to main: manually trigger deploy
6. Monitor: 15 minutes
7. Merge main → develop

```

## M.2 Rollback Protocol

**Rollback is not failure. Rollback is discipline.**

```

FRONTEND ROLLBACK (Vercel — takes 30 seconds):

1. Go to Vercel dashboard → Deployments
2. Select previous deployment
3. Click "Promote to Production"
4. Deployment is instant

BACKEND ROLLBACK (Railway — takes 2 minutes):

1. Go to Railway dashboard → Deployments
2. Select previous deployment
3. Click "Redeploy"

DATABASE ROLLBACK (if migration caused issue):

1. Run: pnpm db:rollback (rolls back last migration)
2. Warning: only possible if rollback migration exists and no data loss occurred
3. If data loss: restore from Neon.tech point-in-time recovery (backup before every deployment)

ROLLBACK DECISION CRITERIA:

- Error rate spikes >5x baseline: immediate rollback
- Any P0 bug affecting >10% of users: immediate rollback
- Financial/payment system broken: immediate rollback

```

---

# SECTION N — LAUNCH PROTOCOL & CHECKLIST

## N.1 Pre-Launch Technical Checklist

**Complete 72 hours before public launch:**

```

INFRASTRUCTURE:
□ Production database: backup verified and restorable
□ Redis: memory limits configured, eviction policy set
□ CDN: assets cached correctly (verify Cache-Control headers)
□ Custom domain: DNS records propagated globally
□ SSL certificate: valid and auto-renewing
□ Environment variables: all production values set (no dev/test values)
□ Stripe: live mode activated, webhook endpoint registered with live secret
□ Email: DMARC/SPF/DKIM records verified via MXToolbox
□ Monitoring: Sentry DSN configured for production
□ Error alerting: email alert configured for error spike

SECURITY:
□ npm audit: no high or critical vulnerabilities
□ All API endpoints tested with unauthorized requests (expect 401/403)
□ Stripe webhook signature verified in production
□ No debug logging enabled in production
□ Rate limiting verified at production levels

FUNCTIONALITY:
□ Magic link: sends and works in production email client
□ Google OAuth: works in production (verify redirect URI registered)
□ GitHub OAuth: works in production
□ Article publish: full flow tested in production
□ Stripe checkout: real payment made in test (using Stripe test card in live mode)
□ File upload: image uploads to Cloudinary in production
□ Search: articles indexed and searchable
□ Newsletter: sends from production email address
□ CSV export: downloads correctly

LEGAL & COMPLIANCE:
□ Privacy Policy: published at /privacy
□ Terms of Service: published at /terms
□ Cookie Policy: if using analytics cookies
□ GDPR: data deletion process documented and tested
□ Stripe: terms of service accepted in Dashboard

CONTENT:
□ Landing page: compelling, typo-free, load-tested
□ Onboarding: smooth flow verified by non-team person
□ Help documentation: basic FAQ published
□ Email templates: all look correct in Gmail, Outlook, Apple Mail

```

## N.2 Version Control Throughout Launch

**Version milestones:**

```

v0.1.0 — First beta invite sent (Week 51)
v0.9.0 — Public launch (Week 52)
v1.0.0 — First 1,000 users milestone
v1.x.x — Ongoing feature releases (weekly cadence post-launch)

```

---

# APPENDIX A — COMMIT MESSAGE QUICK REFERENCE

```

feat(editor): add LaTeX math block extension to article editor
fix(auth): resolve refresh token not rotating on mobile Safari
perf(feed): reduce feed query time by adding composite index
refactor(articles): extract slug generation into utility function
test(earnings): add unit tests for quality pool calculation edge cases
docs(api): document subscriber export endpoint response schema
chore(deps): update Anthropic SDK to version 0.24.0
ci(deploy): add database migration step to staging deploy workflow

```

---

# APPENDIX B — BRANCH QUICK REFERENCE

```

PERMANENT: main, develop, staging
FEATURE: feat/[issue#]-[imperative-verb]-[noun]
BUG FIX: fix/[issue#]-[imperative-verb]-[noun]
HOTFIX: hotfix/[issue#]-[imperative-verb]-[noun]
RELEASE: release/v[major].[minor].[patch]
CHORE: chore/[imperative-verb]-[noun]
DOCUMENTATION: docs/[imperative-verb]-[noun]
REFACTOR: refactor/[issue#]-[imperative-verb]-[noun]
PERFORMANCE: perf/[issue#]-[imperative-verb]-[noun]
TEST: test/[issue#]-[imperative-verb]-[noun]

```

---

# APPENDIX C — WEEKLY SPRINT RHYTHM

```

MONDAY:
09:00 — Sprint planning (30 min max)
Review previous week metrics
Confirm this week's tasks and owners
Identify blockers proactively

TUESDAY–THURSDAY:
Async work. Stand-up if needed (blockers only).
PRs open during this period.
Reviews responded to within 4 hours.

FRIDAY:
14:00 — Sprint close (60 min)
Demo: each dev shows what shipped (live demo, not slides)
Metrics: did we hit the week's acceptance criteria?
Retro: one thing that worked, one thing to improve
Next week: confirm tasks for Monday planning
17:00 — Weekly release cut (if features are ready)
Create release branch, open PR

```

---

# APPENDIX D — ESCALATION FRAMEWORK

```

PRODUCTION IS DOWN (all users affected):

1. Anyone can declare P0 incident
2. All devs drop current work immediately
3. Dev 1 leads incident response
4. Dev 2 + Dev 3: support and communicate
5. Target: restored within 1 hour
6. Post-incident review within 24 hours (blameless)

SECURITY INCIDENT:

1. Do NOT commit any security-related information to public channels
2. Dev 1 leads response
3. Assess scope (what was exposed, for how long)
4. Remediate before announcing
5. Notify affected users per legal requirement

DATA LOSS:

1. STOP all writes to affected tables immediately
2. Assess what was lost and for what time period
3. Restore from Neon.tech point-in-time backup
4. Verify restored data
5. Notify affected users

```

---

**Document Version:** 1.0
**Review Cycle:** Monthly. Update required if any architectural decision changes.
**Owner:** Dev 1 (technical lead)
**Status:** This document supersedes all verbal agreements. Conflicts resolved by updating this document first, then implementing.

_Nothing in VAMI is built without a linked GitHub Issue. Nothing is merged without a passing CI pipeline. Nothing ships to production without at minimum one other developer's review. These are not guidelines — they are the operating system._
```
