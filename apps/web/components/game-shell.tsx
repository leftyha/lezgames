'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdPlacement } from './ad-placement';
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

type LaunchResponse = { launchSessionId: string; sessionToken: string; gameUrl: string; context: LaunchContext };
type ScoreResponse = { accepted: boolean; coinsEarned: number; wallet: { balance: number; currency: string }; score: { score: number; reason: string; createdAt: string }; bestScore?: { bestScore: number } };
type LeaderboardRow = { rank: number; userId: string; score: number; updatedAt: string };
type ShellState = 'idle' | 'checking_adblock' | 'blocked' | 'launching' | 'loading_game' | 'playing' | 'paused' | 'game_over' | 'error';
type AdConsent = 'unknown' | 'accepted' | 'declined';

type GameShellProps = { game: ShellGame; recommended?: { slug: string; title: string } };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
const DEMO_USER_ID = 'demo-user';
const ENABLE_DEMO_SCORE = process.env.NEXT_PUBLIC_ENABLE_DEMO_SCORE === 'true';
const LOAD_TIMEOUT_MS = 12_000;

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
  const frameWrapRef = useRef<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [state, setState] = useState<ShellState>('idle');
  const [launch, setLaunch] = useState<LaunchResponse | null>(null);
  const [scoreResult, setScoreResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [adblockResult, setAdblockResult] = useState<AdblockCheckResult | null>(null);
  const [adConsent, setAdConsent] = useState<AdConsent>('unknown');
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [bugMessage, setBugMessage] = useState('');
  const [bugSubmitted, setBugSubmitted] = useState(false);

  const gameUrl = useMemo(() => launch?.gameUrl ?? game.gameUrl, [game.gameUrl, launch?.gameUrl]);
  const canShowGame = state === 'loading_game' || state === 'playing' || state === 'paused' || state === 'game_over';
  const adsEnabled = adConsent === 'accepted' && !adblockResult?.blocked;

  const pushEvent = useCallback((event: string) => {
    setEvents((current) => [`${new Date().toLocaleTimeString()} · ${event}`, ...current].slice(0, 8));
  }, []);

  const postAnalytics = useCallback(async (name: string, payload?: Record<string, unknown>) => {
    try {
      await fetch(`${API_BASE}/v1/analytics/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, userId: DEMO_USER_ID, gameSlug: game.slug, launchSessionId: launch?.launchSessionId, payload }) });
    } catch {}
  }, [game.slug, launch?.launchSessionId]);

  const postAdEvent = useCallback(async (type: 'opportunity' | 'blocked' | 'failed' | 'completed' | 'started', placement: string, payload?: Record<string, unknown>) => {
    try {
      await fetch(`${API_BASE}/v1/ads/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, userId: DEMO_USER_ID, gameSlug: game.slug, launchSessionId: launch?.launchSessionId, provider: 'client-controlled-placement', placement, payload }) });
    } catch {}
  }, [game.slug, launch?.launchSessionId]);

  const fetchPostGameData = useCallback(async () => {
    try {
      const [bestResponse, leaderboardResponse] = await Promise.all([
        fetch(`${API_BASE}/v1/scores/${DEMO_USER_ID}/${game.slug}/best`, { cache: 'no-store' }),
        fetch(`${API_BASE}/v1/leaderboards/${game.slug}/all_time`, { cache: 'no-store' }),
      ]);
      if (bestResponse.ok) {
        const best = await bestResponse.json();
        setPersonalBest(best.bestScore ?? 0);
      }
      if (leaderboardResponse.ok) {
        const board = await leaderboardResponse.json();
        setLeaderboard(board.ranked ?? []);
      }
    } catch {}
  }, [game.slug]);

  const setConsent = useCallback((consent: Exclude<AdConsent, 'unknown'>) => {
    setAdConsent(consent);
    window.localStorage.setItem('lezgamez-ad-consent', consent);
    void postAnalytics('ad_consent_updated', { consent });
  }, [postAnalytics]);

  useEffect(() => {
    const stored = window.localStorage.getItem('lezgamez-ad-consent');
    if (stored === 'accepted' || stored === 'declined') setAdConsent(stored);
  }, []);

  useEffect(() => {
    if (state !== 'loading_game') return;
    const timer = window.setTimeout(() => {
      setState('error');
      setError('Game load timed out. Please retry or report a bug.');
      pushEvent('game_load_timeout');
      void postAnalytics('game_load_timeout', { timeoutMs: LOAD_TIMEOUT_MS, gameUrl });
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [gameUrl, postAnalytics, pushEvent, state]);

  useEffect(() => {
    if (game.gameType !== 'canvas' || state !== 'loading_game' || !launch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '22px sans-serif';
      ctx.fillText(`${game.title} canvas runtime`, 24, 48);
      ctx.fillText('SDK context ready. Waiting for game bundle.', 24, 84);
    }
    setState('playing');
    pushEvent('canvas_runtime_ready');
    void postAnalytics('canvas_runtime_ready');
  }, [game.gameType, game.title, launch, postAnalytics, pushEvent, state]);

  const start = useCallback(async () => {
    setError(null);
    setScoreResult(null);
    setAdblockResult(null);
    setShowInterstitial(false);
    setShowRewardAd(false);
    setBugSubmitted(false);

    if (adConsent === 'unknown') {
      setError('Choose an ads consent option before starting. Ads keep LezGamez free.');
      return;
    }

    setState('checking_adblock');
    pushEvent('checking_adblock');
    void postAdEvent('opportunity', 'pre_launch_probe', { consent: adConsent });

    const adblockCheck = adConsent === 'accepted'
      ? await detectAdblock()
      : { status: 'unknown' as const, blocked: false, reasons: ['personalized_ads_declined'], baitHidden: false, providerProbeResults: [] };
    setAdblockResult(adblockCheck);
    pushEvent(`adblock_${adblockCheck.status}`);

    if (adblockCheck.blocked) {
      setState('blocked');
      setError(`Adblock detected: ${adblockCheck.reasons.join(', ') || 'provider probe blocked'}`);
      void postAdEvent('blocked', 'pre_launch_probe', adblockCheck as unknown as Record<string, unknown>);
      return;
    }

    void postAdEvent('completed', 'pre_launch_probe', adblockCheck as unknown as Record<string, unknown>);
    setState('launching');
    pushEvent('launch_session_request');

    try {
      const response = await fetch(`${API_BASE}/v1/launch-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEMO_USER_ID, gameSlug: game.slug, deviceType: detectDeviceType(), language: window.navigator.language || 'en', adblockStatus: adblockCheck.status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getApiError(payload, 'Could not create launch session.'));

      setLaunch(payload);
      setState('loading_game');
      pushEvent(`launch_created:${payload.launchSessionId}`);
      void fetchPostGameData();
      await postAnalytics('play_clicked', { gameType: game.gameType, adblockStatus: adblockCheck.status, adblockReasons: adblockCheck.reasons, adConsent });
    } catch (cause) {
      setState('error');
      setError(cause instanceof Error ? cause.message : 'Could not start the game.');
    }
  }, [adConsent, fetchPostGameData, game.gameType, game.slug, postAdEvent, postAnalytics, pushEvent]);

  const sendCommandToGame = useCallback((type: 'pause' | 'resume' | 'retry') => {
    if (game.gameType === 'iframe' && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ source: 'lezgamez-shell', type }, window.location.origin);
    }
    pushEvent(`shell_command:${type}`);
  }, [game.gameType, pushEvent]);

  const sendContextToGame = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !launch) return;
    iframeRef.current.contentWindow.postMessage({ source: 'lezgamez-shell', type: 'launch_context', context: launch.context }, window.location.origin);
    pushEvent('context_sent_to_game');
  }, [launch, pushEvent]);

  const submitScore = useCallback(async (score: number, reason = 'game_over') => {
    if (!launch) return;
    pushEvent(`score_submit:${score}`);
    try {
      const response = await fetch(`${API_BASE}/v1/scores`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: DEMO_USER_ID, gameSlug: game.slug, launchSessionId: launch.launchSessionId, score, reason, checksum: buildScoreChecksum(launch.launchSessionId, score) }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(getApiError(payload, 'Score rejected.'));
      setScoreResult(payload);
      setPersonalBest(payload.bestScore?.bestScore ?? null);
      setState('game_over');
      setShowInterstitial(adsEnabled && game.adRules.interstitialEveryDeaths > 0);
      pushEvent(`score_accepted:+${payload.coinsEarned}LC`);
      await fetchPostGameData();
      await postAnalytics('game_over', { score, reason, coinsEarned: payload.coinsEarned });
    } catch (cause) {
      setState('error');
      setError(cause instanceof Error ? cause.message : 'Score rejected. Please retry or report a bug.');
      pushEvent('score_rejected');
    }
  }, [adsEnabled, fetchPostGameData, game.adRules.interstitialEveryDeaths, game.slug, launch, postAnalytics, pushEvent]);

  const requestFullscreen = useCallback(async () => {
    try {
      await frameWrapRef.current?.requestFullscreen?.();
      pushEvent('fullscreen_requested');
    } catch {
      setError('Fullscreen is not available in this browser.');
    }
  }, [pushEvent]);

  const reportBug = useCallback(async () => {
    if (!bugMessage.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/v1/bug-reports`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: DEMO_USER_ID, gameSlug: game.slug, launchSessionId: launch?.launchSessionId, message: bugMessage, severity: 'normal', metadata: { state, events } }) });
      if (!response.ok) throw new Error('Bug report rejected.');
      setBugSubmitted(true);
      setBugMessage('');
      pushEvent('bug_report_submitted');
    } catch {
      setError('Could not submit bug report.');
    }
  }, [bugMessage, events, game.slug, launch?.launchSessionId, pushEvent, state]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { source?: string; event?: string; payload?: { score?: number; reason?: string } };
      if (data?.source !== 'lezgamez-game') return;
      pushEvent(data.event ?? 'unknown_game_event');
      if (data.event === 'ready') sendContextToGame();
      if (data.event === 'game_start') { setState('playing'); void postAnalytics('game_start'); }
      if (data.event === 'pause') setState('paused');
      if (data.event === 'resume') setState('playing');
      if (data.event === 'game_over') void submitScore(Number(data.payload?.score ?? 0), data.payload?.reason ?? 'game_over');
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [postAnalytics, pushEvent, sendContextToGame, submitScore]);

  return (
    <div>
      <section className="game-shell-layout">
        <div>
          <header className="shell-heading">
            <p className="mono">GAME SHELL · SDK SESSION REQUIRED</p>
            <h1>{game.title}</h1>
            <p className="muted">Play creates a launch session, checks adblock, respects ad consent, loads iframe/canvas after approval and validates score server-side.</p>
          </header>

          {adConsent === 'unknown' && (
            <section className="consent-panel">
              <b>Ads consent</b>
              <p className="muted">Ads keep LezGamez free. Choose before Play. Personalized ads load only after consent.</p>
              <div className="shell-actions compact">
                <button className="btn" type="button" onClick={() => setConsent('accepted')}>Accept ads</button>
                <button className="btn dark" type="button" onClick={() => setConsent('declined')}>Decline personalized ads</button>
              </div>
            </section>
          )}

          {game.adRules.banner && <AdPlacement placement="banner" enabled={adsEnabled} onServed={() => postAdEvent('completed', 'banner')} onFailed={() => postAdEvent('failed', 'banner')} />}

          <section ref={frameWrapRef} className="game-frame-wrap">
            {!canShowGame && (
              <div className="shell-overlay">
                <p className="mono">STATE · {state}</p>
                <h2>{state === 'blocked' ? 'Adblock detected' : 'Ready to launch'}</h2>
                <p className="muted">{state === 'blocked' ? 'LezGamez is free because ads keep the games online. Please disable your adblocker to play.' : 'The game build will not download until Play creates a valid launch session.'}</p>
                {error && <p className="shell-error">{error}</p>}
                <div className="shell-actions">
                  <button className="btn" type="button" onClick={start} disabled={state === 'checking_adblock' || state === 'launching'}>Play</button>
                  <a className="btn dark" href="/games">Exit to catalog</a>
                </div>
              </div>
            )}

            {canShowGame && game.gameType === 'iframe' && <iframe ref={iframeRef} className="game-frame" title={`${game.title} game build`} src={gameUrl} sandbox="allow-scripts allow-same-origin allow-pointer-lock" allow="fullscreen" onLoad={() => { setState((current) => (current === 'loading_game' ? 'playing' : current)); sendContextToGame(); }} />}
            {canShowGame && game.gameType === 'canvas' && <canvas ref={canvasRef} className="game-frame canvas-frame" width={960} height={540} aria-label={`${game.title} canvas runtime`} />}
          </section>

          {showInterstitial && (
            <div className="interstitial-panel">
              <button className="btn dark" type="button" onClick={() => setShowInterstitial(false)}>Close ad</button>
              <AdPlacement placement="interstitial" enabled={adsEnabled} onServed={() => postAdEvent('completed', 'interstitial')} onFailed={() => postAdEvent('failed', 'interstitial')} />
            </div>
          )}

          <div className="shell-actions shell-actions-below">
            <button className="btn dark" type="button" onClick={() => { sendCommandToGame('pause'); setState('paused'); }} disabled={!canShowGame || state === 'game_over'}>Pause</button>
            <button className="btn dark" type="button" onClick={() => { sendCommandToGame('resume'); setState('playing'); }} disabled={!canShowGame || state !== 'paused'}>Resume</button>
            <button className="btn dark" type="button" onClick={() => { sendCommandToGame('retry'); void start(); }}>Retry</button>
            <button className="btn dark" type="button" onClick={requestFullscreen} disabled={!canShowGame}>Fullscreen</button>
            {ENABLE_DEMO_SCORE && <button className="btn warm" type="button" onClick={() => submitScore(Math.floor(1000 + Math.random() * 9000), 'demo_score')} disabled={!launch || state === 'game_over'}>Submit demo score</button>}
          </div>
        </div>

        <aside className="panel shell-sidebar">
          <h2>Session</h2>
          <div className="row"><b className="mono">State</b><span>{state}</span><span>{launch ? '✅' : '—'}</span></div>
          <div className="row"><b className="mono">Consent</b><span>{adConsent}</span><span>{adsEnabled ? '✅' : '—'}</span></div>
          <div className="row"><b className="mono">Adblock</b><span>{adblockResult?.status ?? 'not checked'}</span><span>{adblockResult?.blocked ? '🚫' : adblockResult ? '✅' : '—'}</span></div>
          {adblockResult && <div className="adblock-diagnostics"><p className="muted">Bait hidden: {adblockResult.baitHidden ? 'yes' : 'no'}</p>{adblockResult.providerProbeResults.map((probe) => <p className="mono" key={`${probe.name}-${probe.src}`}>{probe.name}: {probe.status}</p>)}{adblockResult.reasons.length > 0 && <p className="muted">Reasons: {adblockResult.reasons.join(', ')}</p>}</div>}
          <div className="row"><b className="mono">Best</b><span>Personal</span><b className="mono">{personalBest ?? '—'}</b></div>
          <div className="row"><b className="mono">Base</b><span>Reward</span><b className="mono">{game.rewardRules.baseCoins} LC</b></div>
          <div className="row"><b className="mono">Cap</b><span>Daily</span><b className="mono">{game.rewardRules.dailyCap} LC</b></div>

          {scoreResult && <div className="postgame-card"><h2>Post-game validated</h2><div className="stat-grid"><span><b className="mono">{scoreResult.score.score}</b><small>Final score</small></span><span><b className="mono">+{scoreResult.coinsEarned}</b><small>Coins earned</small></span><span><b className="mono">{scoreResult.wallet.balance}</b><small>Wallet</small></span></div><button className="btn warm" type="button" onClick={() => setShowRewardAd(true)} disabled={!adsEnabled}>Watch reward ad</button>{showRewardAd && <AdPlacement placement="reward" enabled={adsEnabled} onServed={() => postAdEvent('completed', 'reward')} onFailed={() => postAdEvent('failed', 'reward')} />}</div>}

          {leaderboard.length > 0 && <div className="leaderboard-mini"><h3>All-time leaderboard</h3>{leaderboard.map((row) => <p className="mono" key={`${row.rank}-${row.userId}`}>#{row.rank} {row.userId} · {row.score}</p>)}</div>}

          <h3>Bug report</h3>
          <textarea className="bug-report-input" value={bugMessage} onChange={(event) => setBugMessage(event.target.value)} placeholder="Describe what happened..." />
          <button className="btn dark" type="button" onClick={reportBug} disabled={!bugMessage.trim()}>Send bug report</button>
          {bugSubmitted && <p className="muted">Bug report sent.</p>}

          <h3>SDK events</h3>
          <div className="event-log">{events.length === 0 ? <p className="muted">No events yet.</p> : events.map((event) => <p className="mono" key={event}>{event}</p>)}</div>
          {recommended && <p className="muted">Recommended next game: <a href={`/games/${recommended.slug}`}>{recommended.title}</a>.</p>}
        </aside>
      </section>
    </div>
  );
}
