import { Disclaimer } from '@lezgamez/ui';

const items = [
  { name: 'Violet Umbrella', price: 250, category: 'skin', compatible: 'Golden Rain Zombies', featured: true },
  { name: 'Zombie Egg Skin', price: 500, category: 'skin', compatible: 'Egg games', featured: false },
  { name: 'Amber Rain Trail', price: 750, category: 'trail', compatible: 'Dash and IO games', featured: true },
  { name: 'Glitch Frame', price: 1000, category: 'frame', compatible: 'Puzzle games', featured: false },
];

export default function Store() {
  return (
    <main>
      <h1>Store</h1>
      <Disclaimer />
      <p className="muted">Purchases are server-validated: insufficient balance and incompatible items are blocked by the API before inventory changes.</p>
      <div className="grid">
        {items.map((item) => (
          <article className={`card store-card ${item.featured ? 'featured' : ''}`} key={item.name}>
            <div className="thumb">✦</div>
            <span className="status">{item.category}</span>
            <h2>{item.name}</h2>
            <b className="mono">{item.price} LC</b>
            <p className="muted">Compatible with: {item.compatible}</p>
            <p className="muted">Cosmetic only. No gameplay advantage.</p>
          </article>
        ))}
      </div>
    </main>
  );
}
