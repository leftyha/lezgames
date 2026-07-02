import type { ReactNode } from 'react';
import './globals.css';
import { WalletPill, Disclaimer } from '@lezgamez/ui';

export const metadata = {
  title: 'WagonBug Arcade — Weird games, rolling chaos',
  description: 'Fast browser arcade games with rankings, internal Bug Coins, skins and instant play.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <a className="logo" href="/" aria-label="WagonBug Arcade home"><span>Wagon</span><strong>Bug</strong></a>
          <nav>
            <a href="/games">Games</a>
            <a href="/store">Store</a>
            <a href="/wallet">Wallet</a>
            <a href="/inventory">Inventory</a>
            <a href="/leaderboards">Leaderboards</a>
            <a href="/daily-challenges">Daily</a>
            <a href="/admin">Admin</a>
          </nav>
          <WalletPill />
          <a className="btn" href="/games">Play Now</a>
        </header>
        {children}
        <footer>
          <div>
            <b>WagonBug Arcade</b>
            <p className="muted">Weird games. Rolling chaos.</p>
            <Disclaimer />
          </div>
          <div><b>Play</b><p><a href="/games">Catalog</a></p><p><a href="/zombie-games">Zombie games</a></p><p><a href="/egg-games">Egg games</a></p></div>
          <div><b>Account</b><p><a href="/wallet">Wallet</a></p><p><a href="/inventory">Inventory</a></p><p><a href="/support">Support</a></p></div>
          <div><b>Legal</b><p><a href="/privacy">Privacy</a></p><p><a href="/terms">Terms</a></p><p><a href="/cookies">Cookies</a></p><p><a href="/contact">Contact</a></p></div>
        </footer>
      </body>
    </html>
  );
}
