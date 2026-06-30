-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('live', 'beta', 'coming_soon');
CREATE TYPE "GameType" AS ENUM ('iframe', 'canvas');
CREATE TYPE "LaunchSessionStatus" AS ENUM ('created', 'started', 'completed', 'rejected');
CREATE TYPE "WalletTransactionType" AS ENUM ('reward', 'purchase', 'admin_grant', 'reversal');
CREATE TYPE "StoreCategory" AS ENUM ('skins', 'trails', 'hit_effects', 'profile_badges', 'frames', 'seasonal_items');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "thumbnail" TEXT NOT NULL,
    "ogImage" TEXT NOT NULL,
    "isPlayable" BOOLEAN NOT NULL DEFAULT false,
    "gameUrl" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL DEFAULT 'iframe',
    "supportedDevices" TEXT[],
    "controls" TEXT[],
    "rewardBaseCoins" INTEGER NOT NULL,
    "rewardDailyCap" INTEGER NOT NULL,
    "adEveryDeaths" INTEGER NOT NULL,
    "adBanner" BOOLEAN NOT NULL DEFAULT true,
    "storeCompatibility" TEXT[],
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "faq" JSONB NOT NULL,
    "relatedGames" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GameLaunchSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameSlug" TEXT NOT NULL,
    "status" "LaunchSessionStatus" NOT NULL DEFAULT 'created',
    "sessionToken" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "adblockStatus" TEXT NOT NULL DEFAULT 'clear',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "GameLaunchSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameSlug" TEXT NOT NULL,
    "launchSessionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "coins" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'LC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StoreItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "StoreCategory" NOT NULL,
    "price" INTEGER NOT NULL,
    "compatibleGames" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StoreItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeItemId" TEXT NOT NULL,
    "equippedFor" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeItemId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "gameSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RewardCap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameSlug" TEXT NOT NULL,
    "baseCoins" INTEGER NOT NULL,
    "dailyCap" INTEGER NOT NULL,
    "earnedToday" INTEGER NOT NULL DEFAULT 0,
    "capDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RewardCap_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "gameSlug" TEXT,
    "launchSessionId" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE INDEX "Game_status_idx" ON "Game"("status");
CREATE INDEX "Game_category_idx" ON "Game"("category");
CREATE UNIQUE INDEX "GameLaunchSession_sessionToken_key" ON "GameLaunchSession"("sessionToken");
CREATE INDEX "GameLaunchSession_userId_idx" ON "GameLaunchSession"("userId");
CREATE INDEX "GameLaunchSession_gameSlug_idx" ON "GameLaunchSession"("gameSlug");
CREATE INDEX "GameLaunchSession_status_idx" ON "GameLaunchSession"("status");
CREATE INDEX "Score_gameSlug_accepted_score_idx" ON "Score"("gameSlug", "accepted", "score");
CREATE INDEX "Score_userId_gameSlug_idx" ON "Score"("userId", "gameSlug");
CREATE INDEX "Score_createdAt_idx" ON "Score"("createdAt");
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");
CREATE UNIQUE INDEX "WalletTransaction_auditId_key" ON "WalletTransaction"("auditId");
CREATE INDEX "WalletTransaction_userId_createdAt_idx" ON "WalletTransaction"("userId", "createdAt");
CREATE INDEX "WalletTransaction_type_idx" ON "WalletTransaction"("type");
CREATE INDEX "StoreItem_category_idx" ON "StoreItem"("category");
CREATE INDEX "StoreItem_active_idx" ON "StoreItem"("active");
CREATE UNIQUE INDEX "InventoryItem_userId_storeItemId_key" ON "InventoryItem"("userId", "storeItemId");
CREATE INDEX "InventoryItem_userId_idx" ON "InventoryItem"("userId");
CREATE INDEX "Purchase_userId_createdAt_idx" ON "Purchase"("userId", "createdAt");
CREATE UNIQUE INDEX "RewardCap_userId_gameSlug_key" ON "RewardCap"("userId", "gameSlug");
CREATE INDEX "RewardCap_gameSlug_idx" ON "RewardCap"("gameSlug");
CREATE INDEX "AnalyticsEvent_name_createdAt_idx" ON "AnalyticsEvent"("name", "createdAt");
CREATE INDEX "AnalyticsEvent_gameSlug_createdAt_idx" ON "AnalyticsEvent"("gameSlug", "createdAt");

-- AddForeignKey
ALTER TABLE "GameLaunchSession" ADD CONSTRAINT "GameLaunchSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GameLaunchSession" ADD CONSTRAINT "GameLaunchSession_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Score" ADD CONSTRAINT "Score_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Score" ADD CONSTRAINT "Score_launchSessionId_fkey" FOREIGN KEY ("launchSessionId") REFERENCES "GameLaunchSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RewardCap" ADD CONSTRAINT "RewardCap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RewardCap" ADD CONSTRAINT "RewardCap_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_launchSessionId_fkey" FOREIGN KEY ("launchSessionId") REFERENCES "GameLaunchSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
