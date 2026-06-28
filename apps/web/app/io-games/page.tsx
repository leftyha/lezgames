import { games } from '@lezgamez/catalog';import { GameCard } from '@/components/game-card';
export const metadata={title:'io-games — LEZGAMEZ'};
export default function Category(){const key='io-games'.replace('-games','').replace('no-download','no-download'); const list=games.filter(g=>g.tags.includes(key)||g.category===key).slice(0,8);return <main><h1>io-games</h1><p className="muted">Unique SEO category copy with internal links to related live, beta and coming soon games.</p><div className="grid">{list.map(g=><GameCard key={g.slug} game={g}/>)}</div></main>}
