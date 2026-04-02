# Production Database Migration Script (PowerShell)
# This script safely migrates the Railway production database

Write-Host "🚀 Production Database Migration" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
  Write-Host "❌ Error: DATABASE_URL environment variable is not set" -ForegroundColor Red
  Write-Host ""
  Write-Host "Please set it to your Railway database URL:" -ForegroundColor Yellow
  Write-Host '$env:DATABASE_URL = "mysql://user:password@host:port/database"' -ForegroundColor Yellow
  exit 1
}

Write-Host "📊 Checking current migration status..." -ForegroundColor Yellow
npm run db:status

Write-Host ""
$response = Read-Host "Do you want to apply pending migrations? (y/n)"

if ($response -eq "y" -or $response -eq "Y") {
  Write-Host "⚙️  Applying migrations to production database..." -ForegroundColor Yellow
  npm run db:deploy
  Write-Host ""
  Write-Host "✅ Production database migration completed successfully!" -ForegroundColor Green
} else {
  Write-Host "❌ Migration cancelled" -ForegroundColor Red
  exit 0
}
