export type DeviceType = 'mobile' | 'desktop' | 'tablet' | 'unknown';
export type AdblockStatus = 'unknown' | 'clear' | 'blocked';
export type GameOverPayload = { score: number; reason: string; checksum?: string };
export type InventoryItem = { id: string; type: string; equipped?: boolean; compatibleGames: string[] };
export type EquippedItems = Record<string, InventoryItem | undefined>;
export type GameConfig = Record<string, string | number | boolean | null>;
export type LezGamezLaunchContext = {
  userId: string;
  language: string;
  deviceType: DeviceType;
  walletBalance: number;
  inventory: InventoryItem[];
  equippedItems: EquippedItems;
  adStatus: 'ready' | 'cooldown' | 'unavailable';
  adblockStatus: AdblockStatus;
  sessionToken: string;
  launchSessionId: string;
  gameConfig: GameConfig;
};
export type SdkEvent =
  | 'ready'
  | 'game_start'
  | 'pause'
  | 'resume'
  | 'game_over'
  | 'level_complete'
  | 'score_submit'
  | 'coins_earned'
  | 'ad_opportunity'
  | 'reward_request'
  | 'inventory_request'
  | 'equipped_items_request'
  | 'bug_reported';
export type LezGamezSDK = {
  context: LezGamezLaunchContext;
  ready(): void;
  startGame(): void;
  pauseGame(): void;
  resumeGame(): void;
  gameOver(payload: GameOverPayload): void;
  levelComplete(payload: { level: number; score: number }): void;
  submitScore(payload: { score: number; checksum: string }): Promise<{ accepted: boolean; launchSessionId: string }>;
  coinsEarned(payload: { amount: number; reason: string }): Promise<{ confirmedAmount: number; launchSessionId: string }>;
  requestAdBreak(payload: { reason: string }): Promise<{ shown: boolean; launchSessionId: string }>;
  requestReward(payload: { type: string }): Promise<{ granted: boolean; launchSessionId: string }>;
  getInventory(): Promise<InventoryItem[]>;
  getEquippedItems(): Promise<EquippedItems>;
  reportBug(payload: { message: string }): void;
};

export type LezGamezShellMessage = {
  source: 'lezgamez-shell';
  type: 'launch_context';
  context: LezGamezLaunchContext;
};

export type LezGamezGameMessage = {
  source: 'lezgamez-game';
  event: SdkEvent;
  payload?: unknown;
};

const defaultContext: LezGamezLaunchContext = {
  userId: 'guest',
  language: 'en',
  deviceType: 'unknown',
  walletBalance: 0,
  inventory: [],
  equippedItems: {},
  adStatus: 'unavailable',
  adblockStatus: 'unknown',
  sessionToken: 'server-session-token-required',
  launchSessionId: 'server-launch-session-required',
  gameConfig: {},
};

export function createLezGamezSDK(post: (event: SdkEvent, payload?: unknown) => void, context: Partial<LezGamezLaunchContext> = {}): LezGamezSDK {
  const launchContext = { ...defaultContext, ...context };
  return {
    context: launchContext,
    ready: () => post('ready', { launchSessionId: launchContext.launchSessionId }),
    startGame: () => post('game_start', { launchSessionId: launchContext.launchSessionId }),
    pauseGame: () => post('pause', { launchSessionId: launchContext.launchSessionId }),
    resumeGame: () => post('resume', { launchSessionId: launchContext.launchSessionId }),
    gameOver: (payload) => post('game_over', { ...payload, launchSessionId: launchContext.launchSessionId }),
    levelComplete: (payload) => post('level_complete', { ...payload, launchSessionId: launchContext.launchSessionId }),
    submitScore: async (payload) => (post('score_submit', { ...payload, launchSessionId: launchContext.launchSessionId }), { accepted: true, launchSessionId: launchContext.launchSessionId }),
    coinsEarned: async (payload) => (post('coins_earned', { ...payload, launchSessionId: launchContext.launchSessionId }), { confirmedAmount: payload.amount, launchSessionId: launchContext.launchSessionId }),
    requestAdBreak: async (payload) => (post('ad_opportunity', { ...payload, launchSessionId: launchContext.launchSessionId }), { shown: false, launchSessionId: launchContext.launchSessionId }),
    requestReward: async (payload) => (post('reward_request', { ...payload, launchSessionId: launchContext.launchSessionId }), { granted: false, launchSessionId: launchContext.launchSessionId }),
    getInventory: async () => (post('inventory_request', { launchSessionId: launchContext.launchSessionId }), launchContext.inventory),
    getEquippedItems: async () => (post('equipped_items_request', { launchSessionId: launchContext.launchSessionId }), launchContext.equippedItems),
    reportBug: (payload) => post('bug_reported', { ...payload, launchSessionId: launchContext.launchSessionId }),
  };
}

export function createPostMessageLezGamezSDK(context: Partial<LezGamezLaunchContext> = {}, targetOrigin = '*') {
  return createLezGamezSDK((event, payload) => {
    if (typeof window === 'undefined' || !window.parent) return;
    const message: LezGamezGameMessage = { source: 'lezgamez-game', event, payload };
    window.parent.postMessage(message, targetOrigin);
  }, context);
}

export function waitForLezGamezLaunchContext(timeoutMs = 8000): Promise<LezGamezLaunchContext> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('waitForLezGamezLaunchContext can only run in a browser.'));
      return;
    }

    const timeout = window.setTimeout(() => {
      window.removeEventListener('message', handleMessage);
      reject(new Error('Timed out waiting for LezGamez launch context.'));
    }, timeoutMs);

    function handleMessage(event: MessageEvent<LezGamezShellMessage>) {
      if (event.data?.source !== 'lezgamez-shell' || event.data.type !== 'launch_context') return;
      window.clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      resolve(event.data.context);
    }

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ source: 'lezgamez-game', event: 'ready' } satisfies LezGamezGameMessage, '*');
  });
}
