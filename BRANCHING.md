# 🌿 Branch Strategy & Deployment

## Branch Struktúra

```
main (production)
  ├── dev2 (feature branch)
  ├── feature-x (feature branch)
  └── hotfix-y (hotfix branch)
```

## 🚀 Deployment Flow

### **1. Feature Development (dev2 branch)**

```bash
# dev2 branch-en dolgozol
git checkout dev2

# Schema változás
npm run db:migrate
# Migration: "add_user_profile"

# Commit & Push
git add .
git commit -m "feat: add user profile"
git push origin dev2
```

**Mi történik:**

- ✅ Vercel **preview deployment** (pl: `dev2.vercel.app`)
- ✅ **NEM** fut `prisma migrate deploy` (csak build)
- ✅ Használja a **preview DATABASE_URL**-t (ha van külön preview DB)
- ✅ Tesztelheted a feature-t production érintése nélkül

### **2. Production Deployment (main branch)**

Amikor a feature készen van:

```bash
# Merge dev2 → main
git checkout main
git merge dev2
git push origin main
```

**Mi történik:**

- ✅ Vercel **production deployment** (`yourdomain.com`)
- ✅ **Automatikusan** fut `prisma migrate deploy` → Railway production DB
- ✅ New migrations alkalmazva production-ben
- ✅ App deployed új verzióval

## ⚙️ Build Behavior

| Branch      | Environment | Migration? | Database                               |
| ----------- | ----------- | ---------- | -------------------------------------- |
| `main`      | Production  | ✅ Yes     | Railway Production                     |
| `dev2`      | Preview     | ❌ No      | Preview DB vagy Production (read-only) |
| `feature-*` | Preview     | ❌ No      | Preview DB vagy Production (read-only) |

## 🗄️ Database Strategy

### Option 1: Egyetlen Production DB (egyszerűbb)

**Setup:**

- Preview build-ek **NEM** futtatnak migration-öket
- Preview-ok csak read-et csinálnak vagy mock data-t használnak
- Migration csak main merge után megy production-be

**Előnyök:**

- Egyszerűbb setup
- Egy database költség
- Kevesebb komplexitás

**Hátrányok:**

- Preview-ok nem tudják tesztelni a schema változásokat
- Breaking changes rizikósabbak

### Option 2: Külön Preview Database (ajánlott production-höz)

**Setup Railway:**

1. Hozz létre második MySQL service-t Railway-en ("Preview DB")
2. Add hozzá Vercel Preview Environment Variables:
   ```
   DATABASE_URL=mysql://preview-db-url
   ```

**Előnyök:**

- Preview-ok isolated environment-ben futnak
- Teljes schema testing
- Zero risk a production DB-re

**Hátrányok:**

- Dupla database költség
- Több konfiguráció

## 📋 Vercel Environment Variables Setup

### Production Environment (main branch)

```
DATABASE_URL=mysql://railway-production-url
NODE_ENV=production
JWT_ACCESS_SECRET=***
JWT_REFRESH_SECRET=***
CLOUDINARY_NAME=***
CLOUDINARY_KEY=***
CLOUDINARY_SECRET=***
```

### Preview Environment (dev2, feature-\* branches)

```
DATABASE_URL=mysql://railway-preview-url  # Vagy ugyanaz mint production
NODE_ENV=preview
JWT_ACCESS_SECRET=***  # Lehet ugyanaz mint production
JWT_REFRESH_SECRET=***
CLOUDINARY_NAME=***
CLOUDINARY_KEY=***
CLOUDINARY_SECRET=***
```

## 🛡️ Best Practices

### ✅ DO (Csináld)

1. **Feature branch-ekre push előtt tesztelj lokálban:**

   ```bash
   npm run db:migrate  # Lokális DB
   npm run dev
   # Tesztelés...
   ```

2. **Pull Request használata:**
   - dev2 → main: GitHub Pull Request
   - Code review before merge
   - CI tests running

3. **Migration neveket legyen beszédes:**
   - ✅ `add_user_profile_table`
   - ❌ `update123`

4. **Small, incremental migrations:**
   - Egy migration = egy logical change
   - Könnyebb rollback

### ❌ DON'T (Ne csináld)

1. **Ne merge-elj main-be ha migration breaking:**
   - Ha breaking change van, készülj fel downtime-ra
   - Vagy használj multi-step migration strategy-t

2. **Ne felejtsd el commit-olni migration file-okat:**

   ```bash
   git add prisma/migrations/
   ```

3. **Ne dolgozz közvetlenül main branch-en:**
   - Mindig feature branch → PR → main

## 🔄 Example Workflow

### Teljes Feature Development Cycle

```bash
# 1. Create feature branch
git checkout -b dev2

# 2. Develop locally
npm run db:migrate  # Lokális schema változás
# Edit code...
npm run dev  # Test locally

# 3. Push to preview
git add .
git commit -m "feat: add user profiles"
git push origin dev2

# 4. Check preview deployment
# https://dev2-yourapp.vercel.app
# Verify everything works

# 5. Create PR & merge to main
# GitHub: Create Pull Request dev2 → main
# Review → Approve → Merge

# 6. Automatic production deployment
# Vercel detects main branch push
# Runs: prisma migrate deploy → next build
# ✅ Production updated with migrations!
```

## 🚨 Emergency Rollback

Ha production-ben probléma van a migration után:

### Option 1: Quick Fix Forward

```bash
# Create hotfix branch
git checkout -b hotfix-revert-migration main

# Create reverse migration
npm run db:migrate
# Manually write SQL to revert changes

# Push & merge to main
git push origin hotfix-revert-migration
```

### Option 2: Database Restore (Last Resort)

1. Railway Dashboard → Backups
2. Restore previous backup
3. Revert code to previous working commit

## 📊 Monitoring

### Ellenőrizd a migration status-t production-ben:

```bash
# Set Railway production URL
$env:DATABASE_URL = "railway-production-url"

# Check migration status
npm run db:status
```

### Preview deployment ellenőrzése:

```bash
# Set preview URL (if separate)
$env:DATABASE_URL = "railway-preview-url"

# Check what migrations would run
npm run db:status
```

---

További info: [DEPLOYMENT.md](./DEPLOYMENT.md)
