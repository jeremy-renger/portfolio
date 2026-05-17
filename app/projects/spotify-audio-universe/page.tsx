import PortfolioHeader from '../../../components/portfolio-header';
import SpotifyVisualizer from '../../../components/spotify-visualizer';

export default function SpotifyAudioUniversePage() {
  return (
    <div className="page-theme page-theme-visualizer portfolio-shell">
      <PortfolioHeader title="Spotify Audio Universe" kicker="Interactive systems case study" />

      <main className="main">
        <section className="hero reveal">
          <p className="hero-subtitle">Flagship project</p>
          <h1 className="hero-title">Music data becomes an explorable spatial interface.</h1>
          <p className="hero-copy">
            Spotify Audio Universe maps a 25,000-track feature space into a browser-native visual system that makes
            similarity, genre clustering, and sonic contrast legible at a glance.
          </p>
          <div className="actions">
            <a href="#demo" className="btn btn-primary">Open Demo</a>
            <a href="https://github.com/Jeremy-Renger/portfolio" className="btn" target="_blank" rel="noreferrer">
              View Repo
            </a>
          </div>
          <div className="trust-bar">
            <div className="trust-item">
              <span className="trust-label">Role</span>
              <span className="trust-value">Product design + frontend engineering</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Input</span>
              <span className="trust-value">25,000 tracks across 30 genres</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Core methods</span>
              <span className="trust-value">UMAP, t-SNE, filtering, export</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Why it matters</span>
              <span className="trust-value">Turns high-dimensional audio features into a usable interface</span>
            </div>
          </div>
        </section>

        <section className="detail-panel reveal reveal-delay-1">
          <h2 className="section-title" style={{ marginTop: 0 }}>Problem</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            Recommendation systems and audio datasets are often numerically rich but visually opaque. This project asks
            how to make latent musical structure readable enough for analysis, curation, and product experimentation.
          </p>
        </section>

        <section className="detail-panel reveal reveal-delay-1" id="demo">
          <h2 className="section-title" style={{ marginTop: 0 }}>Interactive Demo</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            The demo recreates the interaction model with a synthetic Spotify-style dataset so reviewers can inspect the
            full workflow quickly: projection switching, genre filtering, track inspection, and exportable views.
          </p>
          <SpotifyVisualizer />
        </section>

        <section className="project-columns reveal reveal-delay-2">
          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Method</h2>
            <ul className="detail-list">
              <li><strong>Input:</strong> energy, valence, danceability, tempo, acousticness, and related audio features.</li>
              <li><strong>Transform:</strong> dimensionality reduction via UMAP and t-SNE to expose local and global similarity.</li>
              <li><strong>Output:</strong> clustered genre islands, point-level inspection, and exportable visual snapshots.</li>
            </ul>
          </article>

          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Stack</h2>
            <ul className="detail-list">
              <li><strong>App:</strong> Next.js App Router + TypeScript</li>
              <li><strong>Rendering:</strong> React + canvas-based plotting</li>
              <li><strong>Data model:</strong> feature synthesis, genre weighting, projection switching</li>
              <li><strong>Focus:</strong> fast exploratory interaction, not just static charts</li>
            </ul>
          </article>
        </section>

        <section className="detail-panel reveal reveal-delay-2">
          <h2 className="section-title" style={{ marginTop: 0 }}>Employer signal</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            This is the strongest example of how I like to work: start from a dense model, decide what a reviewer
            needs to understand quickly, and design the interface so exploration feels immediate instead of academic.
          </p>
        </section>
      </main>
    </div>
  );
}
