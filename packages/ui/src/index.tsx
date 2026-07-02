import type { ReactNode } from 'react';

export function Button({ children, href, variant = 'primary' }: { children: ReactNode; href?: string; variant?: 'primary' | 'dark' | 'warm' }) {
  const cls = `btn ${variant}`;
  return href ? <a className={cls} href={href}>{children}</a> : <button className={cls}>{children}</button>;
}

export function WalletPill() {
  return <div className="wallet-pill"><span>Bug Coins</span><b>12,450</b></div>;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status ${status}`}>{status.replace('_', ' ')}</span>;
}

export function Disclaimer() {
  return <p className="disclaimer">Bug Coins are internal credits only and cannot be withdrawn, sold, transferred or exchanged for real money.</p>;
}
