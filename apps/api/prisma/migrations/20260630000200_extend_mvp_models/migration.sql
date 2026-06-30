-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'admin', 'support');
CREATE TYPE "SessionStatus" AS ENUM ('active', 'revoked', 'expired');
CREATE TYPE "LeaderboardPeriod" AS ENUM ('daily', 'weekly', 'all_time');
CREATE TYPE "QuestCadence" AS ENUM ('daily', 'weekly', 'seasonal');
CREATE TYPE "QuestStatus" AS ENUM ('draft', 'active', 'archived');
CREATE TYPE "QuestProgressStatus" AS ENUM ('in_progress', 'completed', 'claimed', 'expired');
CREATE TYPE "AdEventType" AS ENUM ('opportunity', 'requested', 'started', 'completed', 'skipped', 'failed', 'blocked');

-- RewardCap is daily, not global per user/game.
DROP INDEX IF EXISTS "RewardCap_userId_gameSlug_key";
CREATE UNIQUE INDEX "RewardCap_userId_gameSlug_capDate_key" ON "RewardCap"("userId", "gameSlug", "capDate");
CREATE INDEX IF NOT EXISTS "RewardCap_gameSlug_capDate_idx" ON "RewardCap"("gameSlug", "capDate");
DROP INDEX IF EXISTS "RewardCap_gameSlug_idx";

-- Extra leaderboard growth indexes.
CREATE INDEX IF NOT EXISTS "Score_gameSlug_accepted_createdAt_idx" ON "Score"("gameSlug", "accepted", "createdAt");
CREATE INDEX IF NOT EXISTS "Game_status_category_idx" ON "Game"("status", "category");
CREATE INDEX IF NOT EXISTS "GameLaunchSession_gameSlug_status_createdAt_idx" ON "GameLaunchSession"("gameSlug", "status", "createdAt");

-- New MVP tables.
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'admin',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'active',
    "userAgent" TEXT,
    "ipHash" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GameVersion" (
    "id" TEXT NOT NULL,
    "gameSlug" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "buildUrl" TEXT NOT NULL,
    "checksum" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "releaseNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" TIMESTAMP(3),
    CONSTRAINT "GameVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameSlug" TEXT NOT NULL,
    "period" "LeaderboardPeriod" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3),
    "score" INTEGER NOT NULL,
    "scoreId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RewardLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameSlug" TEXT NOT NULL,
    "launchSessionId" TEXT,
    "scoreId" TEXT,
    "coins" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RewardLedger_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cadence" "QuestCadence" NOT NULL,
    "status" "QuestStatus" NOT NULL DEFAULT 'draft',
    "gameSlug" TEXT,
    "targetEvent" TEXT NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "rewardCoins" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestProgress" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "QuestProgressStatus" NOT NULL DEFAULT 'in_progress',
    "completedAt" TIMESTAMP(3),
    "claimedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "QuestProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BugReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "gameSlug" TEXT,
    "launchSessionId" TEXT,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'open',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BugReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "gameSlug" TEXT,
    "launchSessionId" TEXT,
    "type" "AdEventType" NOT NULL,
    "provider" TEXT,
    "placement" TEXT,
    "revenueMicros" INTEGER,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdEvent_pkey" PRIMARY KEY ("id")
);

-- Indexes.
CREATE UNIQUE INDEX "AdminUser_userId_key" ON "AdminUser"("userId");
CREATE INDEX "AdminUser_role_idx" ON "AdminUser"("role");
CREATE INDEX "AdminUser_active_idx" ON "AdminUser"("active");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_status_idx" ON "Session"("userId", "status");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE UNIQUE INDEX "GameVersion_gameSlug_version_key" ON "GameVersion"("gameSlug", "version");
CREATE INDEX "GameVersion_gameSlug_isActive_idx" ON "GameVersion"("gameSlug", "isActive");
CREATE UNIQUE INDEX "LeaderboardEntry_userId_gameSlug_period_periodStart_key" ON "LeaderboardEntry"("userId", "gameSlug", "period", "periodStart");
CREATE INDEX "LeaderboardEntry_gameSlug_period_periodStart_score_idx" ON "LeaderboardEntry"("gameSlug", "period", "periodStart", "score");
CREATE INDEX "LeaderboardEntry_userId_gameSlug_idx" ON "LeaderboardEntry"("userId", "gameSlug");
CREATE INDEX "RewardLedger_userId_createdAt_idx" ON "RewardLedger"("userId", "createdAt");
CREATE INDEX "RewardLedger_gameSlug_createdAt_idx" ON "RewardLedger"("gameSlug", "createdAt");
CREATE INDEX "Quest_status_cadence_idx" ON "Quest"("status", "cadence");
CREATE INDEX "Quest_startsAt_endsAt_idx" ON "Quest"("startsAt", "endsAt");
CREATE UNIQUE INDEX "QuestProgress_questId_userId_key" ON "QuestProgress"("questId", "userId");
CREATE INDEX "QuestProgress_userId_status_idx" ON "QuestProgress"("userId", "status");
CREATE INDEX "BugReport_status_createdAt_idx" ON "BugReport"("status", "createdAt");
CREATE INDEX "BugReport_gameSlug_createdAt_idx" ON "BugReport"("gameSlug", "createdAt");
CREATE INDEX "AdEvent_type_createdAt_idx" ON "AdEvent"("type", "createdAt");
CREATE INDEX "AdEvent_gameSlug_createdAt_idx" ON "AdEvent"("gameSlug", "createdAt");

-- Foreign keys.
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GameVersion" ADD CONSTRAINT "GameVersion_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RewardLedger" ADD CONSTRAINT "RewardLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RewardLedger" ADD CONSTRAINT "RewardLedger_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RewardLedger" ADD CONSTRAINT "RewardLedger_launchSessionId_fkey" FOREIGN KEY ("launchSessionId") REFERENCES "GameLaunchSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RewardLedger" ADD CONSTRAINT "RewardLedger_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "QuestProgress" ADD CONSTRAINT "QuestProgress_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestProgress" ADD CONSTRAINT "QuestProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BugReport" ADD CONSTRAINT "BugReport_launchSessionId_fkey" FOREIGN KEY ("launchSessionId") REFERENCES "GameLaunchSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_launchSessionId_fkey" FOREIGN KEY ("launchSessionId") REFERENCES "GameLaunchSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
