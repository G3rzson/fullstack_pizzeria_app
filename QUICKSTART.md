# 🚀 Quick Start: Deployment & Database Migration

## Egyszerű használat - automatikus migration

### 1. Feature development (dev2 branch)

```bash
# dev2 branch-en dolgozol
git checkout dev2

# 1. Módosítsd a prisma/schema.prisma file-t
# 2. Futtasd a migrációt LOKÁLISAN
npm run db:migrate

# 3. Adj nevet a migration-nek (pl: "add_new_field")
```

### 2. Push to dev2 (preview)

```bash
git add .
git commit -m "feat: add new field to schema"
git push origin dev2
```

**Mi történik:**

- ✅ Vercel **preview deployment** (pl: `dev2.vercel.app`)
- ✅ **NEM** fut migration (csak build)
- ✅ Tesztelheted a feature-t production érintése nélkül

### 3. Merge to main (production)

Amikor készen vagy:

```bash
git checkout main
git merge dev2
git push origin main
```

**Mi történik:**

- ✅ Vercel **production deployment**
- ✅ **Automatikusan** fut `prisma migrate deploy`
- ✅ Railway production DB frissül
- ✅ Éles környezet élő az új feature-rel 🎉

---

## Ha manuálisan szeretnél migrálni

### Windows:

```powershell
$env:DATABASE_URL = "your-railway-mysql-url"
.\scripts\migrate-production.ps1
```

### Linux/Mac:

```bash
export DATABASE_URL="your-railway-mysql-url"
./scripts/migrate-production.sh
```

---

## Vercel Environment Variables Setup

Ezeket állítsd be a Vercel dashboard-on (Project Settings → Environment Variables):

```
DATABASE_URL=mysql://user:pass@railway-host:port/db
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=production
```

**Railway DATABASE_URL megszerzése:**
Railway Dashboard → MySQL Service → Variables → Copy `DATABASE_URL`

---

## Package.json scriptek

| Script                | Leírás                                     | Használat |
| --------------------- | ------------------------------------------ | --------- |
| `npm run db:migrate`  | Új migration lokálisan                     | Dev only  |
| `npm run db:deploy`   | Migration alkalmazása production-ben       | Manual    |
| `npm run db:status`   | Migration status ellenőrzése               | Any       |
| `npm run db:generate` | Prisma Client újragenerálása               | Any       |
| `npm run build`       | Conditional build (auto migration if main) | Vercel    |

---

## 🌿 Branch Strategy

| Branch                                 | Deploy Type                            | Migration? | Use Case |
| -------------------------------------- | -------------------------------------- | ---------- | -------- |
| `m**dev2 → Preview** (nincs migration) | **main → Production** (auto migration) |

- ✅ Feature branch → PR → main merge (best practice)

---

További dokumentáció:

- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - Részletes deployment guide
- 🌿 [BRANCHING.md](./BRANCHING.md) - Branch strategy & workflow

## ⚠️ Fontos

- ✅ `.env.local` **NEM** kerül git-be (gitignore-olva van)
- ✅ `prisma/migrations/` **IGEN**, commit-old mindig
- ✅ Schema változásnál először lokálban tesztelj
- ✅ Vercel minden push után automatically redeploy-ol

---

Részletes dokumentáció: [DEPLOYMENT.md](./DEPLOYMENT.md)
