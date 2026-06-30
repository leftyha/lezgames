export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:4000/api';
const DEMO_USER_ID = 'demo-user';

type InventoryItem = {
  id: string;
  storeItemId: string;
  equippedFor: string[];
  item?: {
    name: string;
    category: string;
    compatibleGames: string[];
    price: number;
  };
};

type InventoryResponse = {
  userId: string;
  owned: InventoryItem[];
};

async function getInventory(): Promise<InventoryResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/v1/inventory/${DEMO_USER_ID}`, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default async function Inventory() {
  const inventory = await getInventory();
  const owned = inventory?.owned ?? [];

  return (
    <main>
      <h1>Inventory</h1>
      {!inventory && <section className="panel"><h2>API unavailable</h2><p className="muted">Start the API at {API_BASE} to load owned items.</p></section>}
      <div className="grid">
        {owned.length === 0 && <article className="card"><h2>No owned items</h2><p className="muted">Purchases will appear here after the API validates wallet and compatibility.</p></article>}
        {owned.map((inventoryItem) => (
          <article className="card" key={inventoryItem.id}>
            <div className="thumb">◆</div>
            <span className="status">{inventoryItem.item?.category ?? 'item'}</span>
            <h2>{inventoryItem.item?.name ?? inventoryItem.storeItemId}</h2>
            <p className="muted">Compatible with: {inventoryItem.item?.compatibleGames.join(', ') ?? 'unknown'}</p>
            <p className="muted">Equipped for: {inventoryItem.equippedFor.length > 0 ? inventoryItem.equippedFor.join(', ') : 'not equipped'}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
