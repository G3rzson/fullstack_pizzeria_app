# Production Database Initialization Script (PowerShell)
# Run this ONCE to initialize a fresh Railway production database

Write-Host "🚀 Railway Production Database Initialization" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
  Write-Host "❌ Error: DATABASE_URL environment variable is not set" -ForegroundColor Red
  Write-Host ""
  Write-Host "Set your Railway production DATABASE_URL:" -ForegroundColor Yellow
  Write-Host '$env:DATABASE_URL = "mysql://user:password@host:port/database"' -ForegroundColor Yellow
  exit 1
}

Write-Host "⚠️  WARNING: This will initialize the production database." -ForegroundColor Yellow
Write-Host "Only run this if the database is completely empty/new." -ForegroundColor Yellow
Write-Host ""
$response = Read-Host "Are you sure you want to continue? (yes/no)"

if ($response -ne "yes") {
  Write-Host "❌ Initialization cancelled" -ForegroundColor Red
  exit 0
}

Write-Host ""
Write-Host "📊 Checking current migration status..." -ForegroundColor Yellow
npx prisma migrate status

Write-Host ""
Write-Host "🎯 Applying all migrations to production database..." -ForegroundColor Yellow
npx prisma migrate deploy

Write-Host ""
Write-Host "✅ Production database initialized successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Verifying migration status..." -ForegroundColor Yellow
npx prisma migrate status

Write-Host ""
Write-Host "✨ All done! You can now redeploy on Vercel." -ForegroundColor Green
