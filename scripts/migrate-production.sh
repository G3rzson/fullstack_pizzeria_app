#!/bin/bash

# Production Database Migration Script
# This script safely migrates the Railway production database

set -e  # Exit on error

echo "🚀 Production Database Migration"
echo "================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set it to your Railway database URL:"
  echo "export DATABASE_URL='mysql://user:password@host:port/database'"
  exit 1
fi

echo "📊 Checking current migration status..."
npm run db:status

echo ""
read -p "Do you want to apply pending migrations? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "⚙️  Applying migrations to production database..."
  npm run db:deploy
  echo ""
  echo "✅ Production database migration completed successfully!"
else
  echo "❌ Migration cancelled"
  exit 0
fi
