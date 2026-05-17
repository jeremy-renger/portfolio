import Link from 'next/link';

type PortfolioHeaderProps = {
  title?: string;
  kicker?: string;
};

export default function PortfolioHeader({
  title = 'Jeremy Renger',
  kicker = 'Creative technologist'
}: PortfolioHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-wrap">
        <div className="portfolio-mark">
          <span className="portfolio-kicker">{kicker}</span>
          <span className="portfolio-title">{title}</span>
        </div>
        <div className="header-actions">
          <Link href="/" className="nav-link">Portfolio</Link>
          <Link href="/projects/spotify-audio-universe" className="nav-link">Spotify Audio Universe</Link>
          <Link href="/projects/frequency-atlas" className="nav-link">Frequency Atlas</Link>
          <a href="https://github.com/Jeremy-Renger" className="nav-link" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
