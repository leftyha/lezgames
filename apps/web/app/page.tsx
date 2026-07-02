import { games, liveGames } from '@lezgamez/catalog';
import { GameCard } from '@/components/game-card';

export default function Home() {
  return (
    <main>
      <section className="hero brand-hero">
        <div className="hero-mark" aria-hidden="true">◥◤</div>
        <p className="mono eyebrow">WAGONBUG ARCADE</p>
        <h1 className="glitch"><span>Wagon</span><strong>Bug</strong></h1>
        <h2>Weird games. Rolling chaos.</h2>
        <p className="muted">A fast browser arcade for weird instant games, chaos leaderboards, daily quests, skins and internal-only Bug Coins.</p>
        <p><a className="btn" href="/games">Explore games</a> <a className="btn dark" href="/daily-challenges">Daily quests</a></p>
      </section>
      <section className="layout">
        <div>
          <h2>Featured live games</h2>
          <div className="grid">{liveGames.slice(0, 6).map((game) => <GameCard key={game.slug} game={game} />)}</div>
        </div>
        <aside className="panel">
          <h2>MVP checks</h2>
          <div className="row"><b>10</b><span>Playable live games</span><span>✅</span></div>
          <div className="row"><b>4</b><span>Beta / coming soon SEO pages</span><span>✅</span></div>
          <div className="row"><b>{games.length}</b><span>Catalog records with SDK rules</span><span>✅</span></div>
        </aside>
      </section>
    </main>
  );
}
