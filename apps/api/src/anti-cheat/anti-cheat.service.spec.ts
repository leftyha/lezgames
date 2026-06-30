import { describe, expect, it } from 'vitest';
import { buildScoreChecksum } from '../common/domain.utils';
import { AntiCheatService } from './anti-cheat.service';

describe('AntiCheatService', () => {
  const service = new AntiCheatService();

  it('accepts a valid score range', () => {
    expect(() => service.validateScoreRange(5000)).not.toThrow();
  });

  it('rejects invalid score ranges', () => {
    expect(() => service.validateScoreRange(-1)).toThrow();
    expect(() => service.validateScoreRange(1_000_001)).toThrow();
  });

  it('rejects invalid checksums', () => {
    expect(() => service.validateChecksum('session_1', 100, 'bad')).toThrow();
  });

  it('accepts valid checksums', () => {
    const valid = buildScoreChecksum('session_1', 100);
    expect(() => service.validateChecksum('session_1', 100, valid)).not.toThrow();
  });
});
