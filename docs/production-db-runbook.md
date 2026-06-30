# Production DB, Redis, backup and deploy runbook

## Required services

- PostgreSQL 16+ for persistent platform data.
- Redis 7+ for rate limiting and short-lived runtime controls.
- A staging database that receives every migration before production.

## Required environment

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/lezgamez?schema=public"
REDIS_URL="redis://HOST:6379"
SCORE_CHECKSUM_SALT="replace-me"
PORT=4000
```

## Staging deploy flow

1. Deploy branch to staging API.
2. Point `DATABASE_URL` to staging PostgreSQL.
3. Point `REDIS_URL` to staging Redis.
4. Run:

```bash
pnpm --filter @lezgamez/api prisma:generate
pnpm --filter @lezgamez/api db:deploy
pnpm --filter @lezgamez/api db:seed
pnpm --filter @lezgamez/api typecheck
pnpm --filter @lezgamez/api test:unit
pnpm --filter @lezgamez/api test:int
pnpm --filter @lezgamez/api build
```

5. Validate manually:

```bash
curl https://staging-api.lezgamez.com/api/v1/health
curl https://staging-api.lezgamez.com/api/v1/modules
curl https://staging-api.lezgamez.com/api/v1/games
curl https://staging-api.lezgamez.com/api/v1/store/items
```

## Production deploy flow

1. Confirm staging is green.
2. Create a production DB backup before migration.
3. Record current app commit SHA.
4. Run migration deploy:

```bash
pnpm --filter @lezgamez/api db:deploy
```

5. Deploy API and web using the same commit SHA.
6. Validate health, modules and one launch-session flow.

## Backup command

For managed PostgreSQL, prefer provider snapshots. For self-hosted PostgreSQL:

```bash
pg_dump "$DATABASE_URL" --format=custom --file="backup-$(date -u +%Y%m%dT%H%M%SZ).dump"
```

## Restore command

```bash
pg_restore --clean --if-exists --dbname "$DATABASE_URL" backup-file.dump
```

## Rollback policy

Prisma migrations should be treated as forward-only in production.

1. Roll back application code first when possible.
2. Keep database changes backwards-compatible across one deploy.
3. Use corrective forward migrations instead of editing applied migrations.
4. Restore from backup only for severe incidents and after stopping writes.

## Redis validation

Rate limit responses should include:

```txt
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
X-RateLimit-Backend
```

In staging/production `X-RateLimit-Backend` should be `redis`. `memory-fallback` is acceptable only in local development.
