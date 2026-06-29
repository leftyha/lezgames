import { Disclaimer } from '@lezgamez/ui';

const transactions = [
  { id: 'wtx_reward_001', type: 'reward', amount: '+450 LC', reason: 'Valid score reward', source: 'scores/game_1/session_demo_001' },
  { id: 'wtx_purchase_001', type: 'purchase', amount: '-250 LC', reason: 'Cosmetic purchase', source: 'store/item_violet_umbrella' },
  { id: 'wtx_admin_001', type: 'admin grant', amount: '+12,000 LC', reason: 'MVP seed balance', source: 'admin/bootstrap' },
];

export default function Wallet() {
  return (
    <main>
      <h1>Wallet</h1>
      <Disclaimer />
      <section className="panel">
        <h2 className="mono">12,200 LC</h2>
        <p className="muted">Server-side wallet preview. The client displays balances only after the API calculates the ledger.</p>
      </section>
      <section className="panel">
        <h2>Wallet ledger</h2>
        <p className="muted">Every balance change requires a transaction with reason, source and audit id.</p>
        {transactions.map((transaction) => (
          <div className="row" key={transaction.id}>
            <b className="mono">{transaction.amount}</b>
            <span>
              {transaction.reason}<br />
              <small className="muted">{transaction.source}</small>
            </span>
            <span className="status">{transaction.type}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
