import Image from 'next/image';
import Link from 'next/link';
import PortfolioHeader from '../components/portfolio-header';
import { SITE } from '../lib/site';
import summary from '../lib/spotify-summary.json';

const songs = summary.count.toLocaleString('en-US');
const overall = Math.round(summary.purity.overall * 100);

export default function HomePage() {
  return (
    <div className="page-theme page-theme-visualizer portfolio-shell">
      <PortfolioHeader />

      <main className="main">
        <section className="hero reveal home-hero">
          <div className="home-hero-copy">
            <p className="hero-subtitle">Software engineer · data visualization · interactive systems</p>
            <h1 className="hero-title">I build interfaces that make dense technical data readable.</h1>
            <p className="hero-copy">
              Two case studies: a real-data map of {songs} songs built with UMAP and t-SNE, and a research atlas
              designed so that weak evidence looks weak. Each one covers the data pipeline, the interaction design
              and the front end.
            </p>
            <div className="actions">
              <Link href="/projects/spotify-audio-universe" className="btn btn-primary">Explore the song map</Link>
              <Link href="/projects/frequency-atlas" className="btn">See the research atlas</Link>
              <Link href="/writing" className="btn">Read the paper</Link>
            </div>
          </div>
          <article className="home-feature-card">
            <div className="home-hero-stage">
              <div className="stage-panel stage-panel-primary">
                <span className="stage-kicker">Spotify Audio Universe</span>
                <strong className="stage-title">{songs} real songs</strong>
                <span className="stage-metric">UMAP ↔ t-SNE morph · search · neighbors</span>
              </div>
              <div className="stage-panel stage-panel-secondary">
                <span className="stage-kicker">Frequency Atlas</span>
                <strong className="stage-title">Evidence-first design</strong>
                <span className="stage-metric">10 interventions · 31 cited sources</span>
              </div>
            </div>
            <figcaption className="home-feature-caption">Real data, measured claims, working code.</figcaption>
          </article>
        </section>

        <section className="trust-bar reveal reveal-delay-1">
          <div className="trust-item">
            <span className="trust-label">Focus</span>
            <span className="trust-value">Front-end engineering and data visualization</span>
          </div>
          <div className="trust-item">
            <span className="trust-label">Stack</span>
            <span className="trust-value">TypeScript, React, Next.js, canvas · Python, scikit-learn, UMAP</span>
          </div>
          <div className="trust-item">
            <span className="trust-label">Working style</span>
            <span className="trust-value">Measure first, then design what the numbers support</span>
          </div>
          <div className="trust-item">
            <span className="trust-label">Code</span>
            <a href={SITE.github} target="_blank" rel="noreferrer" className="trust-link">github.com/Jeremy-Renger</a>
          </div>
        </section>

        <section className="project-grid reveal reveal-delay-1">
          <article className="project-card">
            <Link href="/projects/spotify-audio-universe" className="project-card-shot" aria-label="Open Spotify Audio Universe">
              <Image src="/projects/spotify-map.jpg" alt={`UMAP map of ${songs} Spotify songs, colored by genre`} width={1400} height={867} sizes="(max-width: 900px) 100vw, 50vw" priority />
            </Link>
            <p className="project-card-kicker">Flagship project</p>
            <h2 className="project-card-title">Spotify Audio Universe</h2>
            <p className="project-card-copy">
              {songs} real Spotify songs placed by nine audio features. Switch between UMAP and t-SNE and watch every
              point move; hover, search, and pin a track to see its nearest neighbors.
            </p>
            <ul className="detail-list compact-list">
              <li><strong>Pipeline:</strong> Python, z-scored features, UMAP and t-SNE with fixed seeds.</li>
              <li><strong>Finding:</strong> only {overall}% of a song&apos;s nearest neighbors share its genre label.</li>
              <li><strong>Front end:</strong> every song drawn on one canvas, with grid-indexed hover.</li>
            </ul>
            <div className="actions">
              <Link href="/projects/spotify-audio-universe" className="btn btn-primary">Open project</Link>
            </div>
          </article>

          <article className="project-card">
            <Link href="/projects/frequency-atlas" className="project-card-shot" aria-label="Open Frequency Atlas">
              <Image src="/projects/atlas-evidence.jpg" alt="Evidence overview: studies per intervention, colored by evidence strength" width={1299} height={476} sizes="(max-width: 900px) 100vw, 50vw" />
            </Link>
            <p className="project-card-kicker">Design study</p>
            <h2 className="project-card-title">Frequency Atlas</h2>
            <p className="project-card-copy">
              Neuromodulation research ranges from replicated trials to single small studies. This atlas grades and
              sorts by evidence strength, so the difference is visible at a glance.
            </p>
            <ul className="detail-list compact-list">
              <li><strong>Problem:</strong> show uncertainty without hiding the content.</li>
              <li><strong>Method:</strong> a typed data model, an evidence grade on everything, and sources inline.</li>
              <li><strong>Output:</strong> filterable atlas plus an evidence overview.</li>
            </ul>
            <div className="actions">
              <Link href="/projects/frequency-atlas" className="btn">Open case study</Link>
            </div>
          </article>
        </section>

        <section className="detail-panel reveal reveal-delay-2">
          <h2 className="section-title" style={{ marginTop: 0 }}>Get in touch</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            Open to software engineering roles in data visualization, front end, and robotics software.
          </p>
          <div className="actions">
            <a href={SITE.github} className="btn" target="_blank" rel="noreferrer">GitHub</a>
            {SITE.linkedin ? <a href={SITE.linkedin} className="btn" target="_blank" rel="noreferrer">LinkedIn</a> : null}
            {SITE.email ? <a href={`mailto:${SITE.email}`} className="btn btn-primary">Email me</a> : null}
          </div>
        </section>
      </main>
    </div>
  );
}
