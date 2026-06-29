import { getGame, games } from '@lezgamez/catalog';
import { notFound } from 'next/navigation';

export function generateStaticParams() { return games.map((g) => ({ slug: g.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGame(slug);
  return { title: `Play shell — ${g?.title}`, alternates: { canonical: `/games/${slug}` } };
}

export default async function Play({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGame(slug);
  if (!g) notFound();
  const recommended = games.find((game) => game.slug !== g.slug && game.category === g.category) ?? games.find((game) => game.slug !== g.slug);
  return <main>
    <h1>Game Shell: {g.title}</h1>
    <p className="muted">Pre-play gate. Assets are not loaded until Play is pressed. Adblock check blocks play with the official message.</p>
    <div className="game-shell-layout">
      <section className="stage shell" aria-label={`${g.title} launch shell`}>
        <div className="shell-overlay">
          <p className="mono">LAUNCH SESSION MOCK · SDK CONTEXT REQUIRED</p>
          <h2>Tap Play after the adblock check</h2>
          <p className="muted">Adblock detected. LezGamez is free because ads keep the games online. Please disable your adblocker to play.</p>
          <div className="shell-actions">
            <button className="btn">Play</button>
            <button className="btn dark">Pause</button>
            <button className="btn dark">Retry</button>
            <a className="btn dark" href="/games">Exit to catalog</a>
          </div>
        </div>
      </section>
      <aside className="panel shell-sidebar">
        <h2>Post-game preview</h2>
        <div className="stat-grid">
          <span><b className="mono">8,420</b><small>Final score</small></span>
          <span><b className="mono">9,900</b><small>Best score</small></span>
          <span><b className="mono">+{g.rewardRules.baseCoins} LC</b><small>Coins earned</small></span>
        </div>
        <h3>Leaderboard snapshot</h3>
        {['NOX', 'EGG', 'ZED'].map((name, index) => <div className="row" key={name}><b className="mono">#{index + 1}</b><span>{name}</span><b className="mono">{9900 - index * 640}</b></div>)}
        {recommended && <p className="muted">Recommended next game: <a href={`/games/${recommended.slug}`}>{recommended.title}</a>.</p>}
      </aside>
    </div>
  </main>;
}
