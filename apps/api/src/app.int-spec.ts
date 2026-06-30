import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from './app.module';
import { buildScoreChecksum } from './common/domain.utils';

describe('App integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns health and module status', async () => {
    const health = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(health.body.ok).toBe(true);
    expect(health.body.architecture).toBe('modular-nest-domains');

    const modules = await request(app.getHttpServer()).get('/api/v1/modules').expect(200);
    expect(modules.body.implemented).toContain('ScoresModule');
  });

  it('reads seeded catalog, store, quests and leaderboards', async () => {
    const games = await request(app.getHttpServer()).get('/api/v1/games').expect(200);
    expect(games.body.games.length).toBeGreaterThan(0);

    const store = await request(app.getHttpServer()).get('/api/v1/store/items').expect(200);
    expect(store.body.items.length).toBeGreaterThan(0);

    const quests = await request(app.getHttpServer()).get('/api/v1/quests').expect(200);
    expect(Array.isArray(quests.body.quests)).toBe(true);

    const leaderboard = await request(app.getHttpServer()).get('/api/v1/leaderboards/golden-rain-zombies/all_time').expect(200);
    expect(leaderboard.body.period).toBe('all_time');
  });

  it('creates launch session and submits a validated score', async () => {
    const launch = await request(app.getHttpServer())
      .post('/api/v1/launch-sessions')
      .send({ userId: 'demo-user', gameSlug: 'golden-rain-zombies', deviceType: 'desktop', adblockStatus: 'clear' })
      .expect(201);

    const score = 5000;
    const checksum = buildScoreChecksum(launch.body.launchSessionId, score);

    const result = await request(app.getHttpServer())
      .post('/api/v1/scores')
      .send({ userId: 'demo-user', gameSlug: 'golden-rain-zombies', launchSessionId: launch.body.launchSessionId, score, reason: 'integration_test', checksum })
      .expect(201);

    expect(result.body.accepted).toBe(true);
    expect(result.body.serverValidated).toBe(true);
  });
});
