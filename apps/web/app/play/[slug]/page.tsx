import { getGame, games } from '@lezgamez/catalog';
import { notFound } from 'next/navigation';
import { GameShell } from '@/components/game-shell';

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGame(slug);

  return {
    title: g ? `Play ${g.title} — LEZGAMEZ` : 'Play — LEZGAMEZ',
    alternates: { canonical: g ? `/games/${slug}` : '/games' },
  };
}

export default async function Play({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGame(slug);

  if (!g) notFound();

  const recommended = games.find((game) => game.slug !== g.slug && game.category === g.category) ?? games.find((game) => game.slug !== g.slug);

  return (
    <main>
      <GameShell
        game={{
          slug: g.slug,
          title: g.title,
          gameUrl: g.gameUrl,
          gameType: g.gameType,
          rewardRules: g.rewardRules,
          adRules: g.adRules,
        }}
        recommended={recommended ? { slug: recommended.slug, title: recommended.title } : undefined}
      />
    </main>
  );
}
