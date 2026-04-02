# 🚀 Deployment & Database Migration Guide

Ez a dokumentáció leírja, hogyan kezeld a Railway production adatbázis migrációkat Vercel deployment esetén.

## 📋 Setup Áttekintés

- **Alkalmazás**: Vercel (Next.js)
- **Adatbázis**: Railway (MySQL)
- **Lokális fejlesztés**: Lokális MySQL
- **Migration tool**: Prisma Migrate

## 🔄 Workflow

### 1. Lokális Fejlesztés

Amikor változtatsz a Prisma schemán lokálisan:

```bash
# Módosítsd a prisma/schema.prisma file-t
# Például: új mező hozzáadása, új model, stb.

# Futtass migrációt lokális DB-re
npm run db:migrate

# Add meg a migration nevét
# Például: "add_user_role_field"
```

Ez létrehoz egy új migration file-t a `prisma/migrations/` mappában.

### 2. Git Commit & Push

```bash
git add .
git commit -m "feat: add user role field to schema"
git push origin main
```

### 3. Vercel Automatikus Deploy

Amikor push-olsz a main branch-re:

1. Vercel automatic trigger build-et
2. A `build` script fut: `prisma migrate deploy && next build`
3. Ez **automatikusan alkalmazza** a migration-öket a Railway DB-re

**⚠️ FONTOS**: Győződj meg róla, hogy a Vercel environment variables-ben be van állítva:

- `DATABASE_URL` → Railway MySQL connection string

## 🛠️ Hasznos Scriptek

### Lokális Fejlesztés

```bash
# Új migration létrehozása (lokális DB)
npm run db:migrate

# Prisma Client újragenerálása
npm run db:generate

# Migration status ellenőrzése
npm run db:status

# Schema push DB-re migration file nélkül (dev only!)
npm run db:push
```

### Production Migration (Manuális)

Ha manuálisan szeretnél migrálni a Railway DB-re:

#### Windows (PowerShell):

```powershell
# 1. Állítsd be a Railway DATABASE_URL-t
$env:DATABASE_URL = "mysql://user:password@host:port/database"

# 2. Futtasd a migration scriptet
.\scripts\migrate-production.ps1
```

#### Linux/Mac (Bash):

```bash
# 1. Állítsd be a Railway DATABASE_URL-t
export DATABASE_URL="mysql://user:password@host:port/database"

# 2. Futtasd a migration scriptet
./scripts/migrate-production.sh
```

Vagy közvetlenül:

```bash
DATABASE_URL="your-railway-url" npm run db:deploy
```

## 📊 Migration Status Ellenőrzése

### Lokális DB status:

```bash
npm run db:status
```

### Production DB status:

```bash
# Windows
$env:DATABASE_URL = "railway-url"
npm run db:status

# Linux/Mac
DATABASE_URL="railway-url" npm run db:status
```

## ⚠️ Fontos Szabályok

### ✅ DO (Csináld)

1. **Mindig tesztelj lokálban először**: Futtass migrációt lokális DB-n mielőtt production-be megy
2. **Commit migration file-okat**: A `prisma/migrations/` mappa tartalmát mindig commit-old
3. **Vercel environment variables**: Ellenőrizd hogy a `DATABASE_URL` helyes-e
4. **Backup**: Railway-en rendszeres backup-ot állíts be

### ❌ DON'T (Ne csináld)

1. **Ne használj `prisma migrate dev`-et production-ben**: Csak `prisma migrate deploy`
2. **Ne módosítsd manuálisan a migration file-okat**: Ha már commit-oltad őket
3. **Ne futtass `prisma db push`-ot production-ben**: Ez kihagyja a migration history-t
4. **Ne törölj migration file-okat**: Csak ha biztos vagy benne

## 🐛 Troubleshooting

### "Migration already applied" error

Ez normális, ha a Vercel már futtatta a migration-t. Ellenőrizd:

```bash
npm run db:status
```

### Migration conflict

Ha migration conflict van (pl. két fejlesztő különböző migration-öket hozott létre):

1. Pull-old a legfrissebb változásokat
2. Resolve conflicts
3. Ha szükséges, reset-eld a lokális DB-t és újra migráld

### Schema drift detected

Ha a production schema eltér a migration history-tól:

```bash
# Ellenőrizd a drift-et
npx prisma migrate status

# Production schema baseline-olása (veszélyes!)
# Csak akkor használd, ha tudod mit csinálsz
npx prisma migrate resolve --applied "migration-name"
```

## 🔐 Railway Database URL Megszerzése

1. Menj a Railway dashboardra
2. Válaszd ki a MySQL service-t
3. Variables tab → Copy `DATABASE_URL`
4. Formátum: `mysql://user:password@host:port/database`

Vercel-en:

1. Project Settings → Environment Variables
2. Add: `DATABASE_URL` = Railway connection string
3. Save → Redeploy

## 📝 Changelog Best Practices

Migration neveket jelentéssel bíróan add meg:

- ✅ `add_user_role_field`
- ✅ `create_orders_table`
- ✅ `update_pizza_prices_decimal`
- ❌ `migration1`
- ❌ `update`

## 🚨 Emergency Rollback

Ha rollback-elni kell egy migration-t:

**⚠️ VESZÉLYES - Csak szükség esetén!**

1. Restore database backup (Railway dashboard)
2. Revert migration file-ok a git-ben
3. Redeploy Vercel-en

Jobb megoldás: Új migration-t írni ami "visszaállítja" a változást
