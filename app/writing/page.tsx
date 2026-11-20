import type { Metadata } from 'next';
import Link from 'next/link';
import PortfolioHeader from '../../components/portfolio-header';
import summary from '../../lib/spotify-summary.json';
import { FINDING_AUDIT as F, SOURCE_AUDIT as A } from '../../lib/frequency-atlas-data';

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
        <article className="detail-panel reveal paper-card">
          <p className="hero-subtitle">Paper · November 2026 · 7 pages</p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Auditing an AI-Drafted Research Atlas: {A.checked} References, {F.drafted} Findings
          </h1>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            Before publishing Frequency Atlas I checked every reference and every finding in its AI-written first draft.
            Most did not survive. This paper reports what failed, the patterns behind it, and a checklist for AI-assisted research.
          </p>
          <ul className="detail-list">
            <li><strong>{A.correctAsWritten} of {A.checked}</strong> references were correct as written; {A.notFound} could not be found at all.</li>
            <li><strong>{F.supportedAsWritten} of {F.drafted}</strong> findings were supported by their source as written.</li>
            <li><strong>Real authors, wrong journals:</strong> 9 of the {A.realButWrongDetails} miscited references had the right author and year, so a quick search seemed to confirm them.</li>
          </ul>
          <div className="actions">
            <a href="/papers/Renger_2026_Frequency_Atlas_Source_Audit.pdf" className="btn btn-primary" target="_blank" rel="noreferrer">Read the PDF</a>
            <Link href="/projects/frequency-atlas" className="btn">See the audited atlas</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
