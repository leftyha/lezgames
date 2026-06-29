import { Game } from '@lezgamez/catalog';
import { StatusBadge } from '@lezgamez/ui';
export function GameCard({game}:{game:Game}){return <article className="card"><div className="thumb">☠</div><StatusBadge status={game.status}/><h3>{game.title}</h3><p className="muted">{game.shortDescription}</p><div className="tags">{game.tags.map((t,index)=><span className="tag" key={`${game.slug}-${t}-${index}`}>{t}</span>)}</div><p><a className="btn dark" href={`/games/${game.slug}`}>Details</a> {game.isPlayable && <a className="btn" href={`/play/${game.slug}`}>Play</a>}</p></article>}
