import { Disclaimer } from '@lezgamez/ui';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:4000/api';

type StoreItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  compatibleGames: string[];
  featured?: boolean;
};

type StoreResponse = {
  items: StoreItem[];
  categories: string[];
};

async function getStore(): Promise<StoreResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/v1/store/items`, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default async function Store() {
  const store = await getStore();
  const items = store?.items ?? [];

  return (
    <main>
      <h1>Store</h1>
      <Disclaimer />
      <p className="muted">Purchases are server-validated: insufficient balance and incompatible items are blocked by the API before inventory changes.</p>
      {!store && <section className="panel"><h2>API unavailable</h2><p className="muted">Start the API at {API_BASE} to load the live demo store.</p></section>}
      <div className="grid">
        {items.map((item) => (
          <article className={`card store-card ${item.featured ? 'featured' : ''}`} key={item.id}>
            <div className="thumb">✦</div>
            <span className="status">{item.category}</span>
            <h2>{item.name}</h2>
            <b className="mono">{item.price.toLocaleString('en-US')} BC</b>
            <p className="muted">Compatible with: {item.compatibleGames.join(', ')}</p>
            <p className="muted">Cosmetic only. No gameplay advantage.</p>
          </article>
        ))}
      </div>
    </main>
  );
}
