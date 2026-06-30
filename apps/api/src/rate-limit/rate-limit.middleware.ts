import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RedisService } from '../redis/redis.service';

type RateProfile = { windowSeconds: number; max: number };

const DEFAULT_PROFILE: RateProfile = { windowSeconds: 60, max: 120 };
const MUTATION_PROFILE: RateProfile = { windowSeconds: 60, max: 40 };
const SCORE_PROFILE: RateProfile = { windowSeconds: 60, max: 12 };
const LAUNCH_PROFILE: RateProfile = { windowSeconds: 60, max: 20 };

function getClientIp(request: Request) {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim() || request.ip;
  return request.ip || request.socket.remoteAddress || 'unknown';
}

function getProfile(request: Request): RateProfile {
  if (request.path.includes('/v1/scores')) return SCORE_PROFILE;
  if (request.path.includes('/v1/launch-sessions')) return LAUNCH_PROFILE;
  if (request.method !== 'GET') return MUTATION_PROFILE;
  return DEFAULT_PROFILE;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly redis: RedisService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const profile = getProfile(request);
    const key = `rate:${request.method}:${request.path}:${getClientIp(request)}`;
    const result = await this.redis.incrWithTtl(key, profile.windowSeconds);

    response.setHeader('X-RateLimit-Limit', profile.max);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, profile.max - result.count));
    response.setHeader('X-RateLimit-Reset', result.ttlSeconds);
    response.setHeader('X-RateLimit-Backend', result.backend);

    if (result.count > profile.max) {
      response.status(429).json({
        ok: false,
        error: {
          statusCode: 429,
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please try again later.',
          path: request.originalUrl,
          retryAfterSeconds: result.ttlSeconds,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  }
}
