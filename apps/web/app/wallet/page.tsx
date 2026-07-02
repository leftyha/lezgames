import { Disclaimer } from '@lezgamez/ui';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:4000/api';
const DEMO_USER_ID = 'demo-user';

type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  reason: string;
  source: string;
  auditId: string;
  createdAt: string;
};

type WalletResponse = {
  userId: string;
  balance: number;
  currency: string;
  disclaimer: string;
  calculatedServerSide: boolean;
  transactions: WalletTransaction[];
};

async function getWallet(): Promise<WalletResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/v1/wallet/${DEMO_USER_ID}`, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function formatAmount(amount: number, currency: string) {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toLocaleString('en-US')} ${currency}`;
}

export default async function Wallet() {
  const wallet = await getWallet();
  const currency = wallet?.currency ?? 'BC';
  const transactions = wallet?.transactions ?? [];

  return (
    <main>
      <h1>Wallet</h1>
      <Disclaimer />
      <section className="panel">
        <h2 className="mono">{wallet ? `${wallet.balance.toLocaleString('en-US')} ${currency}` : 'API unavailable'}</h2>
        <p className="muted">
          {wallet
            ? 'Balance is calculated from the server-side ledger. The browser only displays the result.'
            : `Start the API at ${API_BASE} to load the live demo ledger.`}
        </p>
      </section>
      <section className="panel">
        <h2>Wallet ledger</h2>
        <p className="muted">Every balance change requires a transaction with reason, source and audit id.</p>
        {transactions.length === 0 && <p className="muted">No transactions loaded.</p>}
        {transactions.map((transaction) => (
          <div className="row" key={transaction.id}>
            <b className="mono">{formatAmount(transaction.amount, currency)}</b>
            <span>
              {transaction.reason}<br />
              <small className="muted">{transaction.source}</small><br />
              <small className="muted">audit: {transaction.auditId}</small>
            </span>
            <span className="status">{transaction.type}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
