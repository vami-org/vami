# Local Development Setup Guide

Follow this guide to set up a local development environment for the Vami platform.

## Prerequisites

Ensure the following tools are installed and match the exact versions:

1. **Node.js (v20.11.0)**
   - Recommended tool: `nvm-windows` (Windows) or `nvm` (macOS/Linux)
   - Command: `nvm use 20.11.0`
2. **pnpm (v9.1.0)**
   - Install globally: `npm install -g pnpm@9.1.0`
3. **Docker Desktop**
   - Required to run local Postgres, Redis, Meilisearch, and MailHog.
4. **Git (v2.43.0 or higher)**
5. **VS Code** (with recommended extensions)

---

## One-Command Setup

Run the setup script from the root workspace:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

On Windows Git Bash or WSL, this script will:

- Check Node.js and pnpm versions.
- Copy `apps/api/.env.example` -> `apps/api/.env`
- Copy `apps/web/.env.example` -> `apps/web/.env`
- Install all dependencies via pnpm workspaces.

---

## Environment Variables Validation

Vami validates environment variables at boot. If any required variables are missing, the server will crash instantly with a descriptive error.
Please ensure your local `.env` files contain active keys and secrets as described in their comments.

---

## Running Local Services (Docker)

To start the local databases, caching layers, search engine, and mail catcher:

```bash
pnpm services:up
```

This starts:

- **PostgreSQL 16** (port 5432)
- **Redis 7.2** (port 6379)
- **Meilisearch 1.7** (port 7700)
- **MailHog** (port 1025 for SMTP, port 8025 for web UI)

To stop services:

```bash
pnpm services:down
```

To reset databases/volumes:

```bash
pnpm services:reset
```

---

## Launching Applications

Start the development servers for both apps simultaneously:

```bash
pnpm dev
```

- API backend will be available at: http://localhost:3000
- Web frontend will be available at: http://localhost:5173

---

## Linting and Code Style

This project enforces strict standards before code can be committed:

- **Lint check:** `pnpm lint`
- **Formatting check:** `pnpm format:check`
- **Auto format:** `pnpm format`
