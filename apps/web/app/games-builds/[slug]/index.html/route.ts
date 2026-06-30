export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, '');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>LEZGAMEZ Demo Build · ${safeSlug}</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; background: #03040a; color: #f2f0f7; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at 50% 0, rgba(176,38,255,.22), transparent 36%), #03040a; }
    main { width: min(920px, calc(100vw - 32px)); border: 2px solid #3b4054; background: linear-gradient(180deg, #10121a, #07080d); padding: 24px; }
    h1 { margin: 0 0 8px; font-size: clamp(2rem, 8vw, 5rem); line-height: .9; letter-spacing: -.04em; }
    p { color: #a5a9ba; }
    button { min-height: 44px; border: 2px solid #b026ff; background: linear-gradient(180deg, #b026ff, #8b1ed6); color: #f2f0f7; padding: 12px 16px; font-weight: 900; text-transform: uppercase; cursor: pointer; }
    button.secondary { background: #161925; border-color: #3b4054; }
    .hud { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
    .hud span { border: 1px solid #2a2e3d; padding: 12px; background: #03040a; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; }
    @media (max-width: 640px) { .hud { grid-template-columns: 1fr; } .actions { display: grid; } }
  </style>
</head>
<body>
  <main>
    <p class="mono">DEMO HTML5 BUILD · ${safeSlug}</p>
    <h1>${safeSlug}</h1>
    <p>This is a same-origin demo build used to verify Game Shell, launch context, SDK-style postMessage events, score validation and wallet rewards before real game bundles are uploaded.</p>
    <section class="hud">
      <span><b class="mono" id="score">0</b><br />Score</span>
      <span><b class="mono" id="session">waiting</b><br />Launch session</span>
      <span><b class="mono" id="state">booting</b><br />State</span>
    </section>
    <div class="actions">
      <button type="button" id="start">Start run</button>
      <button type="button" class="secondary" id="scoreBtn">+250 score</button>
      <button type="button" id="gameOver">Game over</button>
    </div>
  </main>
  <script>
    let score = 0;
    let context = null;
    const scoreEl = document.getElementById('score');
    const sessionEl = document.getElementById('session');
    const stateEl = document.getElementById('state');

    function send(event, payload) {
      window.parent.postMessage({ source: 'lezgamez-game', event, payload }, window.location.origin);
    }

    function setState(value) {
      stateEl.textContent = value;
    }

    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.source !== 'lezgamez-shell' || event.data.type !== 'launch_context') return;
      context = event.data.context;
      sessionEl.textContent = context.launchSessionId.slice(0, 14) + '…';
      setState('context ready');
    });

    document.getElementById('start').addEventListener('click', () => {
      score = 0;
      scoreEl.textContent = String(score);
      setState('playing');
      send('game_start', { slug: '${safeSlug}' });
    });

    document.getElementById('scoreBtn').addEventListener('click', () => {
      score += 250;
      scoreEl.textContent = String(score);
      send('level_complete', { score, level: Math.max(1, Math.floor(score / 1000)) });
    });

    document.getElementById('gameOver').addEventListener('click', () => {
      setState('game over');
      send('game_over', { score, reason: 'demo_build_game_over' });
    });

    setState('ready');
    send('ready', { slug: '${safeSlug}' });
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
