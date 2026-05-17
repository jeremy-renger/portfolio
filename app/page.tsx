import Link from 'next/link';
import PortfolioHeader from '../components/portfolio-header';

export default function HomePage() {
  return (
    <div className="page-theme page-theme-visualizer portfolio-shell">
      <PortfolioHeader />

      <main className="main">
        <section className="hero reveal home-hero">
          <div className="home-hero-copy">
            <p className="hero-subtitle">Software engineer • interactive systems • data visualization</p>
            <h1 className="hero-title">I build product-grade interfaces for dense, technical information.</h1>
            <p className="hero-copy">
              This portfolio pairs a browser-native audio visualization system with a research atlas for intervention
              studies. Together they show interface design, frontend implementation, and technical communication in one
              concise employer-facing surface.
            </p>
            <div className="actions">
              <Link href="/projects/spotify-audio-universe" className="btn btn-primary">View Flagship Project</Link>
              <Link href="/projects/frequency-atlas" className="btn">Open Research Case Study</Link>
            </div>
            <div className="hero-signal-strip">
              <div className="signal-chip">
                <span className="signal-chip-label">Primary signal</span>
                <span className="signal-chip-value">Product thinking + frontend execution</span>
              </div>
              <div className="signal-chip">
                <span className="signal-chip-label">Interaction focus</span>
                <span className="signal-chip-value">Explorable data, not static dashboards</span>
              </div>
            </div>
          </div>
          <article className="home-feature-card">
            <div className="home-hero-stage">
              <div className="stage-panel stage-panel-primary">
                <span className="stage-kicker">Spotify Audio Universe</span>
                <strong className="stage-title">25K-track feature space</strong>
                <span className="stage-metric">UMAP • t-SNE • live genre filtering</span>
              </div>
              <div className="stage-panel stage-panel-secondary">
                <span className="stage-kicker">Frequency Atlas</span>
                <strong className="stage-title">150+ mapped interventions</strong>
                <span className="stage-metric">Evidence modeling • comparison views</span>
              </div>
            </div>
            <figcaption className="home-feature-caption">Two case studies. One sharp, readable technical portfolio.</figcaption>
          </article>
        </section>

        <section className="trust-bar reveal reveal-delay-1">
          <div className="trust-item">
            <span className="trust-label">Focus</span>
            <span className="trust-value">Frontend engineering + data visualization</span>
          </div>
          <div className="trust-item">
            <span className="trust-label">Primary stack</span>
            <span className="trust-value">Next.js, TypeScript, React, custom interaction design</span>
          </div>
          <div className="trust-item">
            <span className="trust-label">Working style</span>
            <span className="trust-value">Research-led product thinking with fast prototype loops</span>
          </div>
          <div className="trust-item">
            <span className="trust-label">GitHub</span>
            <a href="https://github.com/Jeremy-Renger" target="_blank" rel="noreferrer" className="trust-link">Jeremy-Renger</a>
          </div>
        </section>

        <section className="project-grid reveal reveal-delay-1">
          <article className="project-card">
            <div className="project-card-visual project-card-visual-primary" />
            <p className="project-card-kicker">Flagship project</p>
            <h2 className="project-card-title">Spotify Audio Universe</h2>
            <p className="project-card-copy">
              A browser-native visual system that projects a 25,000-track feature space into an explorable interface
              for cluster analysis, genre filtering, and track-level inspection.
            </p>
            <ul className="detail-list compact-list">
              <li><strong>Problem:</strong> make high-dimensional audio features legible.</li>
              <li><strong>Method:</strong> UMAP and t-SNE driven interaction flows.</li>
              <li><strong>Signal:</strong> product design plus implementation depth.</li>
            </ul>
            <p className="project-card-meta">Best read as: a frontend-heavy product prototype with clear analytical value.</p>
            <div className="actions">
              <Link href="/projects/spotify-audio-universe" className="btn btn-primary">Open Project</Link>
            </div>
          </article>

          <article className="project-card">
            <div className="project-card-visual project-card-visual-secondary" />
            <p className="project-card-kicker">Research case study</p>
            <h2 className="project-card-title">Frequency Atlas</h2>
            <p className="project-card-copy">
              A research interface that organizes intervention studies across frequency bands, evidence levels, and
              protocol combinations into a navigable atlas.
            </p>
            <ul className="detail-list compact-list">
              <li><strong>Problem:</strong> translate dense research into a usable system.</li>
              <li><strong>Method:</strong> evidence modeling, filtering, and comparative views.</li>
              <li><strong>Signal:</strong> technical communication through interface design.</li>
            </ul>
            <p className="project-card-meta">Best read as: a research interface that turns an uneven evidence base into something navigable.</p>
            <div className="actions">
              <Link href="/projects/frequency-atlas" className="btn">Open Case Study</Link>
            </div>
          </article>
        </section>

        <section className="detail-panel reveal reveal-delay-2">
          <h2 className="section-title" style={{ marginTop: 0 }}>What employers should notice</h2>
          <ul className="detail-list">
            <li><strong>System thinking:</strong> both projects translate abstract data models into readable interfaces.</li>
            <li><strong>Execution:</strong> the work spans UX framing, component architecture, interaction design, and implementation.</li>
            <li><strong>Communication:</strong> each project explains problem, method, output, and practical value quickly.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
