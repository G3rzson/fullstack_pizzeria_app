# 🚨 Production Database Initialization Required

## Probléma

A Railway production adatbázis üres/új, és a Vercel build során a migration-ök nem tudnak lefutni automatikusan.

## Megoldás: Manuális Inicializálás

Először **inicializálnod kell a Railway production database-t** az összes migration lefuttatásával.

### Windows (PowerShell):

```powershell
# 1. Szerezd meg a Railway DATABASE_URL-t
# Railway Dashboard → MySQL Service → Variables → Copy DATABASE_URL

# 2. Állítsd be environment variable-ként
$env:DATABASE_URL = "mysql://root:password@containers-us-west-xxx.railway.app:7032/railway"

# 3. Futtasd az initialization scriptet
.\scripts\init-production-db.ps1
```

### Linux/Mac (Bash):

```bash
# 1. Szerezd meg a Railway DATABASE_URL-t
# Railway Dashboard → MySQL Service → Variables → Copy DATABASE_URL

# 2. Állítsd be environment variable-ként
export DATABASE_URL="mysql://root:password@containers-us-west-xxx.railway.app:7032/railway"

# 3. Futtasd az initialization scriptet
chmod +x scripts/init-production-db.sh
./scripts/init-production-db.sh
```

### Vagy közvetlenül Prisma CLI-vel:

```bash
DATABASE_URL="your-railway-url" npx prisma migrate deploy
```

## Mi fog történni:

1. ✅ Az **összes migration** lefut sorrendben
2. ✅ A `_prisma_migrations` tábla létrejön
3. ✅ Minden schema objektum (User, Pizza, Image, stb.) létrejön
4. ✅ A database készen áll

## Miután inicializáltad:

1. **Redeploy Vercel-en:**
   - Vercel Dashboard → Deployments → Latest deployment → Redeploy
2. **Vagy push egy új commit-ot:**

   ```bash
   git commit --allow-empty -m "trigger redeploy"
   git push origin main
   ```

3. ✅ A build most **sikeresen** fog lefutni!

## Jövőbeli deploymentekhez:

Az inicializálás után minden további migration **automatikusan** fog futni Vercel build során.

**Csak egyszer kell inicializálni** az új production database-t!

---

## Ellenőrzés

Migration status ellenőrzése:

```bash
# Állítsd be a Railway URL-t
$env:DATABASE_URL = "railway-url"

# Ellenőrizd a status-t
npm run db:status
```

Successful output:

```
Database schema is up to date!
✅ All migrations applied
```

## Troubleshooting

### "Table already exists" hiba

Ha már létező táblák vannak, de nincs migration history:

```bash
# Baseline a database (mark migrations as applied)
DATABASE_URL="railway-url" npx prisma migrate resolve --applied "20260320190758_init"
DATABASE_URL="railway-url" npx prisma migrate resolve --applied "20260327085141_init"
# ... repeat for all migrations
```

### Case sensitivity problémák (User vs user)

MySQL-ben táblaneveknél case-sensitivity lehet probléma. Ellenőrizd:

```sql
SHOW TABLES;  -- Nézd meg hogy User vagy user van-e
```

Ha kisbetűs `user` van, de a migration `User`-t vár, akkor konzisztens naming kell.

---

További segítségért: https://www.prisma.io/docs/guides/migrate/production-troubleshooting
