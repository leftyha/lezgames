import { liveGames } from '@lezgamez/catalog';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:4000/api';

type LeaderboardRow = {
  rank: number;
  userId: string;
  score: number;
  createdAt: string;
};

async function getLeaderboard(gameSlug: string): Promise<LeaderboardRow[]> {
  try {
    const response = await fetch(`${API_BASE}/v1/leaderboards/${gameSlug}`, { cache: 'no-store' });
    if (!response.ok) return [];
    const payload = await response.json();
    return payload.ranked ?? [];
  } catch {
    return [];
  }
}

export default async function Leaderboards() {
  const featuredGames = liveGames.slice(0, 3);
  const boards = await Promise.all(featuredGames.map(async (game) => ({ game, rows: await getLeaderboard(game.slug) })));

  return (
    <main>
      <h1>Leaderboards</h1>
      <p className="muted">Scores are loaded from the API mock and update after a validated Game Shell score submit.</p>
      {boards.map(({ game, rows }) => (
        <section className="panel" key={game.slug}>
          <h2>{game.title}</h2>
          {rows.length === 0 && <p className="muted">No validated scores yet. Play the demo shell for this game to seed the board.</p>}
          {rows.map((row) => (
            <div className="row" key={`${game.slug}-${row.rank}-${row.createdAt}`}>
              <b className="mono">#{row.rank}</b>
              <span>{row.userId}</span>
              <b className="mono">{row.score.toLocaleString('en-US')}</b>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
