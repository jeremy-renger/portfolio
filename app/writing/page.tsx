import type { Metadata } from 'next';
import Link from 'next/link';
import PortfolioHeader from '../../components/portfolio-header';
import summary from '../../lib/spotify-summary.json';

export const metadata: Metadata = {
  title: 'Writing | Jeremy Renger',
  description: 'Technical write-ups behind the portfolio projects.'
};

const pct = (v: number) => `${Math.round(v * 100)}%`;
const songs = summary.count.toLocaleString('en-US');
const chance = Object.values(summary.purity.by_genre).reduce((t, v) => t + v.chance * v.chance, 0);

export default function WritingPage() {
  return (
    <div className="page-theme page-theme-visualizer portfolio-shell">
      <PortfolioHeader title="Writing" />
      <main className="main">
        <article className="detail-panel reveal paper-card">
          <p className="hero-subtitle">Paper · November 2026 · 6 pages</p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            How Songs Sound vs. What They&apos;re Called: Mapping {songs} Spotify Tracks
          </h1>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            Playlist genre is a weak label for how a song sounds. I projected {songs} songs into two dimensions with UMAP
            and t-SNE, measured how faithful each map is, and tested how well genre matches the structure of the sound.
          </p>
          <ul className="detail-list">
            <li><strong>{pct(summary.purity.overall)}</strong> of a song&apos;s ten nearest neighbors share its genre, against {pct(chance)} by chance.</li>
            <li><strong>{pct(summary.confusion.accuracy)}</strong> genre accuracy for a random forest that hears only nine audio features, against 20% for guessing the largest genre.</li>
            <li><strong>t-SNE</strong> keeps local neighborhoods more faithfully than UMAP (trustworthiness {summary.method.tsne.trustworthiness10.toFixed(2)} vs {summary.method.umap.trustworthiness10.toFixed(2)}).</li>
          </ul>
          <div className="actions">
            <a href="/papers/Renger_2026_Songs_vs_Genre.pdf" className="btn btn-primary" target="_blank" rel="noreferrer">Read the PDF</a>
            <Link href="/projects/spotify-audio-universe" className="btn">Explore the interactive map</Link>
            <a href="https://github.com/jeremy-renger/portfolio/tree/main/scripts" className="btn" target="_blank" rel="noreferrer">Code to reproduce it</a>
          </div>
        </article>
      </main>
    </div>
  );
}
