#!/bin/bash

# Production Database Initialization Script
# Run this ONCE to initialize a fresh Railway production database

set -e

echo "🚀 Railway Production Database Initialization"
echo "=============================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo ""
  echo "Set your Railway production DATABASE_URL:"
  echo 'export DATABASE_URL="mysql://user:password@host:port/database"'
  exit 1
fi

echo "⚠️  WARNING: This will initialize the production database."
echo "Only run this if the database is completely empty/new."
echo ""
read -p "Are you sure you want to continue? (yes/no) " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "❌ Initialization cancelled"
  exit 0
fi

echo "📊 Checking current migration status..."
npx prisma migrate status || true

echo ""
echo "🎯 Applying all migrations to production database..."
npx prisma migrate deploy

echo ""
echo "✅ Production database initialized successfully!"
echo ""
echo "🔍 Verifying migration status..."
npx prisma migrate status

echo ""
echo "✨ All done! You can now redeploy on Vercel."
