'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdblockCheckResult, detectAdblock } from '../lib/adblock-detector';

type ShellGame = {
  slug: string;
  title: string;
  gameUrl: string;
  gameType: 'iframe' | 'canvas';
  rewardRules: { baseCoins: number; dailyCap: number };
  adRules: { interstitialEveryDeaths: number; banner: boolean };
};

type LaunchContext = {
  userId: string;
  language: string;
  deviceType: string;
  walletBalance: number;
  inventory: unknown[];
  equippedItems: Record<string, unknown>;
  adStatus: 'ready' | 'cooldown' | 'unavailable';
  adblockStatus: 'unknown' | 'clear' | 'blocked';
  sessionToken: string;
  launchSessionId: string;
  gameConfig: Record<string, unknown>;
};

type LaunchResponse = {
  launchSessionId: string;
  sessionToken: string;
  gameUrl: string;
  context: LaunchContext;
};

type ScoreResponse = {
  accepted: boolean;
  coinsEarned: number;
  wallet: { balance: number; currency: string };
  score: { score: number; reason: string; createdAt: string };
};

type ShellState = 'idle' | 'checking_adblock' | 'blocked' | 'launching' | 'loading_game' | 'playing' | 'paused' | 'game_over' | 'error';

type GameShellProps = {
  game: ShellGame;
  recommended?: { slug: string; title: string };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
const DEMO_USER_ID = 'demo-user';

function detectDeviceType() {
  if (typeof window === 'undefined') return 'unknown';
  if (/iPad|Tablet/i.test(window.navigator.userAgent)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(window.navigator.userAgent)) return 'mobile';
  return 'desktop';
}

function buildScoreChecksum(launchSessionId: string, score: number) {
  const base64 = window.btoa(`${launchSessionId}:${score}:lezgamez-mvp`);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function getSameOriginGameUrl(path: string) {
  if (path.startsWith('http')) return path;
  return path;
}

function getApiError(payload: unknown, fallback: string) {
  if (payload && typeof payload === 'object') {
    if ('message' in payload && typeof payload.message === 'string') return payload.message;
    if ('error' in payload && payload.error && typeof payload.error === 'object' && 'message' in payload.error) {
      const message = payload.error.message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message.join(', ');
    }
  }
  return fallback;
}

export function GameShell({ game, recommended }: GameShellProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [state, setState] = useState<ShellState>('idle');
  const [launch, setLaunch] = useState<LaunchResponse | null>(null);
  const [scoreResult, setScoreResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [adblockResult, setAdblockResult] = useState<AdblockCheckResult | null>(null);

  const gameUrl = useMemo(() => getSameOriginGameUrl(launch?.gameUrl ?? game.gameUrl), [game.gameUrl, launch?.gameUrl]);

  const pushEvent = useCallback((event: string) => {
    setEvents((current) => [`${new Date().toLocaleTimeString()} · ${event}`, ...current].slice(0, 8));
  }, []);

  const postAnalytics = useCallback(
    async (name: string, payload?: Record<string, unknown>) => {
      try {
        await fetch(`${API_BASE}/v1/analytics/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            userId: DEMO_USER_ID,
            gameSlug: game.slug,
            launchSessionId: launch?.launchSessionId,
            payload,
          }),
        });
      } catch {
        // Analytics must never block gameplay in the MVP shell.
      }
    },
    [game.slug, launch?.launchSessionId],
  );

  const postAdEvent = useCallback(
    async (type: 'opportunity' | 'blocked' | 'failed' | 'completed', payload?: Record<string, unknown>) => {
      try {
        await fetch(`${API_BASE}/v1/ads/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            userId: DEMO_USER_ID,
            gameSlug: game.slug,
            launchSessionId: launch?.launchSessionId,
            provider: 'client-adblock-detector',
            placement: 'pre_launch_probe',
            payload,
          }),
        });
      } catch {
        // Ad telemetry must never block gameplay in the MVP shell.
      }
    },
    [game.slug, launch?.launchSessionId],
  );

  const start = useCallback(async () => {
    setError(null);
    setScoreResult(null);
    setAdblockResult(null);
    setState('checking_adblock');
    pushEvent('checking_adblock');
    void postAdEvent('opportunity', { placement: 'pre_launch_probe' });

    const adblockCheck = await detectAdblock();
    setAdblockResult(adblockCheck);
    pushEvent(`adblock_${adblockCheck.status}`);

    if (adblockCheck.blocked) {
      setState('blocked');
      setError(`Adblock detected: ${adblockCheck.reasons.join(', ') || 'provider probe blocked'}`);
      void postAdEvent('blocked', adblockCheck as unknown as Record<string, unknown>);
      return;
    }

    void postAdEvent('completed', adblockCheck as unknown as Record<string, unknown>);
    setState('launching');
    pushEvent('launch_session_request');

    try {
      const response = await fetch(`${API_BASE}/v1/launch-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          gameSlug: game.slug,
          deviceType: detectDeviceType(),
          language: window.navigator.language || 'en',
          adblockStatus: adblockCheck.status,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(getApiError(payload, 'Could not create launch session.'));
      }

      setLaunch(payload);
      setState('loading_game');
      pushEvent(`launch_created:${payload.launchSessionId}`);
      await postAnalytics('play_clicked', { gameType: game.gameType, adblockStatus: adblockCheck.status, adblockReasons: adblockCheck.reasons });
    } catch (cause) {
      setState('error');
      setError(cause instanceof Error ? cause.message : 'Could not start the game.');
    }
  }, [game.gameType, game.slug, postAdEvent, postAnalytics, pushEvent]);

  const sendContextToGame = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !launch) return;

    iframeRef.current.contentWindow.postMessage(
      {
        source: 'lezgamez-shell',
        type: 'launch_context',
        context: launch.context,
      },
      window.location.origin,
    );
    pushEvent('context_sent_to_game');
  }, [launch, pushEvent]);

  const submitScore = useCallback(
    async (score: number, reason = 'game_over') => {
      if (!launch) return;

      pushEvent(`score_submit:${score}`);

      try {
        const response = await fetch(`${API_BASE}/v1/scores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: DEMO_USER_ID,
            gameSlug: game.slug,
            launchSessionId: launch.launchSessionId,
            score,
            reason,
            checksum: buildScoreChecksum(launch.launchSessionId, score),
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(getApiError(payload, 'Score rejected.'));
        }

        setScoreResult(payload);
        setState('game_over');
        pushEvent(`score_accepted:+${payload.coinsEarned}LC`);
        await postAnalytics('game_over', { score, reason, coinsEarned: payload.coinsEarned });
      } catch (cause) {
        setState('error');
        setError(cause instanceof Error ? cause.message : 'Could not submit score.');
      }
    },
    [game.slug, launch, postAnalytics, pushEvent],
  );

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { source?: string; event?: string; payload?: { score?: number; reason?: string } };
      if (data?.source !== 'lezgamez-game') return;

      pushEvent(data.event ?? 'unknown_game_event');

      if (data.event === 'ready') {
        sendContextToGame();
      }

      if (data.event === 'game_start') {
        setState('playing');
        void postAnalytics('game_start');
      }

      if (data.event === 'pause') {
        setState('paused');
      }

      if (data.event === 'resume') {
        setState('playing');
      }

      if (data.event === 'game_over') {
        void submitScore(Number(data.payload?.score ?? 0), data.payload?.reason ?? 'game_over');
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [postAnalytics, pushEvent, sendContextToGame, submitScore]);

  const canShowGame = state === 'loading_game' || state === 'playing' || state === 'paused' || state === 'game_over';

  return (
    <div>
      <section className="game-shell-layout">
        <div>
          <header className="shell-heading">
            <p className="mono">GAME SHELL · SDK SESSION REQUIRED</p>
            <h1>{game.title}</h1>
            <p className="muted">
              Play now creates a launch session, checks adblock with bait + provider script probes, loads the iframe only after approval, sends SDK context and validates score server-side.
            </p>
          </header>

          <section className="game-frame-wrap">
            {!canShowGame && (
              <div className="shell-overlay">
                <p className="mono">STATE · {state}</p>
                <h2>{state === 'blocked' ? 'Adblock detected' : 'Ready to launch'}</h2>
                <p className="muted">
                  {state === 'blocked'
                    ? 'LezGamez is free because ads keep the games online. Please disable your adblocker to play.'
                    : 'The game build will not download until Play creates a valid launch session.'}
                </p>
                {error && <p className="shell-error">{error}</p>}
                <div className="shell-actions">
                  <button className="btn" type="button" onClick={start} disabled={state === 'checking_adblock' || state === 'launching'}>
                    Play
                  </button>
                  <a className="btn dark" href="/games">
                    Exit to catalog
                  </a>
                </div>
              </div>
            )}

            {canShowGame && (
              <iframe
                ref={iframeRef}
                className="game-frame"
                title={`${game.title} game build`}
                src={gameUrl}
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                allow="fullscreen"
                onLoad={() => {
                  setState((current) => (current === 'loading_game' ? 'playing' : current));
                  sendContextToGame();
                }}
              />
            )}
          </section>

          <div className="shell-actions shell-actions-below">
            <button className="btn dark" type="button" onClick={() => setState('paused')} disabled={!canShowGame || state === 'game_over'}>
              Pause
            </button>
            <button className="btn dark" type="button" onClick={() => setState('playing')} disabled={!canShowGame || state !== 'paused'}>
              Resume
            </button>
            <button className="btn dark" type="button" onClick={start}>
              Retry
            </button>
            <button className="btn warm" type="button" onClick={() => submitScore(Math.floor(1000 + Math.random() * 9000), 'demo_score')} disabled={!launch || state === 'game_over'}>
              Submit demo score
            </button>
          </div>
        </div>

        <aside className="panel shell-sidebar">
          <h2>Session</h2>
          <div className="row">
            <b className="mono">State</b>
            <span>{state}</span>
            <span>{launch ? '✅' : '—'}</span>
          </div>
          <div className="row">
            <b className="mono">Adblock</b>
            <span>{adblockResult?.status ?? 'not checked'}</span>
            <span>{adblockResult?.blocked ? '🚫' : adblockResult ? '✅' : '—'}</span>
          </div>
          {adblockResult && (
            <div className="adblock-diagnostics">
              <p className="muted">Bait hidden: {adblockResult.baitHidden ? 'yes' : 'no'}</p>
              {adblockResult.providerProbeResults.map((probe) => (
                <p className="mono" key={`${probe.name}-${probe.src}`}>
                  {probe.name}: {probe.status}
                </p>
              ))}
              {adblockResult.reasons.length > 0 && <p className="muted">Reasons: {adblockResult.reasons.join(', ')}</p>}
            </div>
          )}
          <div className="row">
            <b className="mono">Base</b>
            <span>Reward</span>
            <b className="mono">{game.rewardRules.baseCoins} LC</b>
          </div>
          <div className="row">
            <b className="mono">Cap</b>
            <span>Daily</span>
            <b className="mono">{game.rewardRules.dailyCap} LC</b>
          </div>

          {scoreResult && (
            <div className="postgame-card">
              <h2>Post-game validated</h2>
              <div className="stat-grid">
                <span>
                  <b className="mono">{scoreResult.score.score}</b>
                  <small>Final score</small>
                </span>
                <span>
                  <b className="mono">+{scoreResult.coinsEarned}</b>
                  <small>Coins earned</small>
                </span>
                <span>
                  <b className="mono">{scoreResult.wallet.balance}</b>
                  <small>Wallet</small>
                </span>
              </div>
            </div>
          )}

          <h3>SDK events</h3>
          <div className="event-log">
            {events.length === 0 ? <p className="muted">No events yet.</p> : events.map((event) => <p className="mono" key={event}>{event}</p>)}
          </div>

          {recommended && <p className="muted">Recommended next game: <a href={`/games/${recommended.slug}`}>{recommended.title}</a>.</p>}
        </aside>
      </section>
    </div>
  );
}
