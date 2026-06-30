import { AdminRole, PrismaClient, QuestCadence, QuestStatus, StoreCategory, WalletTransactionType } from '@prisma/client';
import { games } from '@lezgamez/catalog';

const prisma = new PrismaClient();

const storeItems = [
  { id: 'item_violet_umbrella', name: 'Violet Umbrella', category: StoreCategory.skins, price: 250, compatibleGames: ['golden-rain-zombies', 'zombie-umbrella-run'], featured: true },
  { id: 'item_zombie_egg', name: 'Zombie Egg Skin', category: StoreCategory.skins, price: 500, compatibleGames: ['huevo-no-te-quiebres', 'egg-catch-me', 'egg-vs-moon'], featured: false },
  { id: 'item_amber_rain', name: 'Amber Rain Trail', category: StoreCategory.trails, price: 750, compatibleGames: ['gravity-dungeon-dash', 'cell-front-lite'], featured: true },
  { id: 'item_glitch_frame', name: 'Glitch Frame', category: StoreCategory.frames, price: 1000, compatibleGames: ['break-me', 'glitch-maze-beta'], featured: false },
];

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

async function seedGames() {
  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        title: game.title,
        status: game.status,
        shortDescription: game.shortDescription,
        fullDescription: game.fullDescription,
        category: game.category,
        tags: game.tags,
        thumbnail: game.thumbnail,
        ogImage: game.ogImage,
        isPlayable: game.isPlayable,
        gameUrl: game.gameUrl,
        gameType: game.gameType,
        supportedDevices: game.supportedDevices,
        controls: game.controls,
        rewardBaseCoins: game.rewardRules.baseCoins,
        rewardDailyCap: game.rewardRules.dailyCap,
        adEveryDeaths: game.adRules.interstitialEveryDeaths,
        adBanner: game.adRules.banner,
        storeCompatibility: game.storeCompatibility,
        releaseDate: new Date(game.releaseDate),
        seoTitle: game.seoTitle,
        seoDescription: game.seoDescription,
        faq: game.faq,
        relatedGames: game.relatedGames,
      },
      create: {
        slug: game.slug,
        title: game.title,
        status: game.status,
        shortDescription: game.shortDescription,
        fullDescription: game.fullDescription,
        category: game.category,
        tags: game.tags,
        thumbnail: game.thumbnail,
        ogImage: game.ogImage,
        isPlayable: game.isPlayable,
        gameUrl: game.gameUrl,
        gameType: game.gameType,
        supportedDevices: game.supportedDevices,
        controls: game.controls,
        rewardBaseCoins: game.rewardRules.baseCoins,
        rewardDailyCap: game.rewardRules.dailyCap,
        adEveryDeaths: game.adRules.interstitialEveryDeaths,
        adBanner: game.adRules.banner,
        storeCompatibility: game.storeCompatibility,
        releaseDate: new Date(game.releaseDate),
        seoTitle: game.seoTitle,
        seoDescription: game.seoDescription,
        faq: game.faq,
        relatedGames: game.relatedGames,
      },
    });

    await prisma.gameVersion.upsert({
      where: { gameSlug_version: { gameSlug: game.slug, version: 'mvp-demo' } },
      update: { buildUrl: game.gameUrl, isActive: game.isPlayable, releaseNotes: 'Seeded MVP demo build metadata.' },
      create: { gameSlug: game.slug, version: 'mvp-demo', buildUrl: game.gameUrl, isActive: game.isPlayable, releaseNotes: 'Seeded MVP demo build metadata.', activatedAt: game.isPlayable ? new Date() : null },
    });
  }
}

async function seedStore() {
  for (const item of storeItems) {
    await prisma.storeItem.upsert({ where: { id: item.id }, update: item, create: item });
  }
}

async function seedQuest() {
  const title = 'Play 3 MVP runs';
  const existing = await prisma.quest.findFirst({ where: { title, cadence: QuestCadence.daily } });
  const data = {
    title,
    description: 'Play three LezGamez runs to validate the daily quest loop.',
    cadence: QuestCadence.daily,
    status: QuestStatus.active,
    targetEvent: 'game_start',
    targetValue: 3,
    rewardCoins: 25,
    startsAt: startOfUtcDay(),
    endsAt: new Date(startOfUtcDay().getTime() + 24 * 60 * 60 * 1000),
  };

  if (existing) {
    await prisma.quest.update({ where: { id: existing.id }, data });
  } else {
    await prisma.quest.create({ data });
  }
}

async function seedDemoUser() {
  const user = await prisma.user.upsert({
    where: { username: 'demo-user' },
    update: { language: 'en' },
    create: { username: 'demo-user', language: 'en' },
  });

  await prisma.adminUser.upsert({
    where: { userId: user.id },
    update: { role: AdminRole.super_admin, active: true },
    create: { userId: user.id, role: AdminRole.super_admin, active: true },
  });

  await prisma.wallet.upsert({ where: { userId: user.id }, update: { currency: 'LC' }, create: { userId: user.id, currency: 'LC' } });

  const seedTransactions = [
    { auditId: 'audit_wallet_001', type: WalletTransactionType.reward, amount: 450, reason: 'valid_score_reward', source: 'scores/game_1/session_demo_001' },
    { auditId: 'audit_wallet_002', type: WalletTransactionType.purchase, amount: -250, reason: 'cosmetic_purchase', source: 'store/item_violet_umbrella' },
    { auditId: 'audit_wallet_003', type: WalletTransactionType.admin_grant, amount: 12000, reason: 'mvp_seed_balance', source: 'admin/bootstrap' },
  ];

  for (const transaction of seedTransactions) {
    await prisma.walletTransaction.upsert({ where: { auditId: transaction.auditId }, update: transaction, create: { ...transaction, userId: user.id } });
  }

  await prisma.inventoryItem.upsert({
    where: { userId_storeItemId: { userId: user.id, storeItemId: 'item_violet_umbrella' } },
    update: { equippedFor: ['golden-rain-zombies'] },
    create: { userId: user.id, storeItemId: 'item_violet_umbrella', equippedFor: ['golden-rain-zombies'] },
  });

  await prisma.inventoryItem.upsert({
    where: { userId_storeItemId: { userId: user.id, storeItemId: 'item_amber_rain' } },
    update: { equippedFor: [] },
    create: { userId: user.id, storeItemId: 'item_amber_rain', equippedFor: [] },
  });

  const capDate = startOfUtcDay();
  for (const game of games) {
    await prisma.rewardCap.upsert({
      where: { userId_gameSlug_capDate: { userId: user.id, gameSlug: game.slug, capDate } },
      update: { baseCoins: game.rewardRules.baseCoins, dailyCap: game.rewardRules.dailyCap },
      create: {
        userId: user.id,
        gameSlug: game.slug,
        capDate,
        baseCoins: game.rewardRules.baseCoins,
        dailyCap: game.rewardRules.dailyCap,
        earnedToday: game.slug === 'golden-rain-zombies' ? 45 : game.slug === 'huevo-no-te-quiebres' ? 32 : 0,
      },
    });
  }
}

async function main() {
  await seedGames();
  await seedStore();
  await seedQuest();
  await seedDemoUser();
  console.log('Seeded persistent LezGamez MVP data idempotently.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
