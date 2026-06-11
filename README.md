# Vami — Monorepo Platform

A custom-designed developer content platform with robust atomic design tokens, serverless caching, database migration tooling, and automated pipelines setup.

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
