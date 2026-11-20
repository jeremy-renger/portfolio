import Link from 'next/link';
import { SITE } from '../lib/site';

type PortfolioHeaderProps = {
  title?: string;
  kicker?: string;
};

export default function PortfolioHeader({ title = SITE.name, kicker = SITE.role }: PortfolioHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-wrap">
        <Link href="/" className="portfolio-mark" aria-label={`${SITE.name}, home`}>
          <span className="portfolio-kicker">{kicker}</span>
          <span className="portfolio-title">{title}</span>
        </Link>
        <nav className="header-actions" aria-label="Main">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/projects/spotify-audio-universe" className="nav-link">Spotify Audio Universe</Link>
          <Link href="/projects/frequency-atlas" className="nav-link">Frequency Atlas</Link>
          <a href={SITE.github} className="nav-link" target="_blank" rel="noreferrer">GitHub</a>
          {SITE.linkedin ? <a href={SITE.linkedin} className="nav-link" target="_blank" rel="noreferrer">LinkedIn</a> : null}
          {SITE.email ? <a href={`mailto:${SITE.email}`} className="nav-link">Email</a> : null}
        </nav>
      </div>
    </header>
  );
}
