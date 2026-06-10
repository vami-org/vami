#!/usr/bin/env bash
# Vami Developer Setup Script

set -e

echo "🚀 Starting Vami setup..."

# 1. Verify Node.js version
REQUIRED_NODE="v20.11.0"
NODE_VERSION=$(node --version)
if [ "$NODE_VERSION" != "$REQUIRED_NODE" ]; then
  echo "❌ Error: Node.js version must be exactly $REQUIRED_NODE. Found $NODE_VERSION"
  echo "Please run: nvm use 20.11.0"
  exit 1
fi
echo "✓ Node.js version is $REQUIRED_NODE"

# 2. Verify pnpm version
REQUIRED_PNPM="9.1.0"
PNPM_VERSION=$(pnpm --version)
if [ "$PNPM_VERSION" != "$REQUIRED_PNPM" ]; then
  echo "❌ Error: pnpm version must be exactly $REQUIRED_PNPM. Found $PNPM_VERSION"
  echo "Please run: npm install -g pnpm@9.1.0"
  exit 1
fi
echo "✓ pnpm version is $REQUIRED_PNPM"

# 3. Copy env files
echo "⚙️ Setting up environment variables..."
if [ ! -f "apps/api/.env" ]; then
  cp apps/api/.env.example apps/api/.env
  echo "✓ Created apps/api/.env"
else
  echo "✓ apps/api/.env already exists"
fi

if [ ! -f "apps/web/.env" ]; then
  cp apps/web/.env.example apps/web/.env
  echo "✓ Created apps/web/.env"
else
  echo "✓ apps/web/.env already exists"
fi

# 4. Install dependencies
echo "📦 Installing packages..."
pnpm install
echo "✓ Dependency installation complete"

echo "🎉 Vami environment setup complete!"
echo "👉 Start services: pnpm services:up"
echo "👉 Start dev servers: pnpm dev"
