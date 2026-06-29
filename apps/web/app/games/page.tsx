import { games } from '@lezgamez/catalog';import { GameCard } from '@/components/game-card';
export const metadata={title:'All free no-download arcade games — LEZGAMEZ'};
export default function Games(){return <main><h1>All LEZGAMEZ games</h1><p className="muted">SEO-rendered catalog for live, beta and coming soon arcade games.</p><div className="grid">{games.map(g=><GameCard key={g.slug} game={g}/>)}</div></main>}
