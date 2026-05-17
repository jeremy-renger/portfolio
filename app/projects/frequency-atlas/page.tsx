import PortfolioHeader from '../../../components/portfolio-header';
import FrequencyAtlasVisualizer from '../../../components/frequency-atlas-visualizer';

export default function FrequencyAtlasPage() {
  return (
    <div className="page-theme page-theme-research-hub portfolio-shell">
      <PortfolioHeader title="Frequency Atlas" kicker="Research systems case study" />

      <main className="main frequency-whitepaper-shell">
        <section className="hero reveal">
          <p className="hero-subtitle">Research case study</p>
          <h1 className="hero-title">Signal-state research organized into a navigable intervention atlas.</h1>
          <p className="hero-copy">
            Frequency Atlas reframes a dense evidence base around brainwave, entrainment, and intervention studies into
            a browsable system for comparison, communication, and exploratory analysis.
          </p>
          <div className="actions">
            <a href="#visualizer" className="btn btn-primary">Open Visualizer</a>
            <a href="/research/frequency-atlas-research-paper.pdf" className="btn" download="frequency-atlas-research-paper.pdf">
              Download Paper
            </a>
            <a href="/research/frequency-atlas-download-guide.md" className="btn" download="frequency-atlas-download-guide.md">
              Download Guide
            </a>
          </div>
          <div className="trust-bar">
            <div className="trust-item">
              <span className="trust-label">Research surface</span>
              <span className="trust-value">150+ mapped intervention references</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Core value</span>
              <span className="trust-value">Comparative reasoning across frequency bands</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Output</span>
              <span className="trust-value">Interactive atlas plus downloadable paper</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Why it matters</span>
              <span className="trust-value">Technical communication through interface design</span>
            </div>
          </div>
        </section>

        <section className="project-columns reveal reveal-delay-1">
          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Question</h2>
            <p className="hero-copy" style={{ maxWidth: 'none' }}>
              How can a large, uneven body of consciousness, neuromodulation, and entrainment research be translated
              into a product-like interface without flattening its methodological nuance?
            </p>
          </article>

          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Method</h2>
            <ul className="detail-list">
              <li><strong>Scope:</strong> 150+ intervention and study references mapped across named frequency bands.</li>
              <li><strong>Model:</strong> evidence quality, effect size, and outcome framing surface alongside each intervention.</li>
              <li><strong>Output:</strong> searchable intervention comparisons, band-response views, and protocol combinations.</li>
            </ul>
          </article>
        </section>

        <section className="detail-panel reveal reveal-delay-1" id="visualizer">
          <h2 className="section-title" style={{ marginTop: 0 }}>Interactive Atlas</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            The atlas turns static research notes into a live exploration surface. Reviewers can filter by intervention
            class, inspect estimated band shifts, and compare the practical shape of different protocols in one place.
          </p>
          <FrequencyAtlasVisualizer />
        </section>

        <section className="project-columns reveal reveal-delay-2">
          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Findings</h2>
            <ul className="detail-list">
              <li><strong>Evidence framing:</strong> quality, participant count, and effect size stay visible.</li>
              <li><strong>Information design:</strong> Delta, Theta, Alpha, Beta, and Gamma become stable comparison anchors.</li>
              <li><strong>Use case:</strong> technical communication for signal-state research and intervention mapping.</li>
            </ul>
          </article>

          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Artifacts</h2>
            <p className="hero-copy" style={{ maxWidth: 'none' }}>
              This case study includes a concise download guide for quick context and a corrected PDF paper export for
              deeper review. Both assets are aligned with the real-name portfolio.
            </p>
            <div className="artifact-stack">
              <div className="artifact-card">
                <span className="artifact-label">Paper</span>
                <strong>Frequency Atlas Research Paper</strong>
                <span className="artifact-note">Corrected author attribution for external sharing.</span>
              </div>
              <div className="artifact-card">
                <span className="artifact-label">Guide</span>
                <strong>Download and context notes</strong>
                <span className="artifact-note">Short explanation of what the atlas and paper contain.</span>
              </div>
            </div>
            <div className="actions" style={{ marginTop: '1rem' }}>
              <a href="/research/frequency-atlas-research-paper.pdf" className="btn btn-primary" download="frequency-atlas-research-paper.pdf">
                Download Paper
              </a>
              <a href="/research/frequency-atlas-download-guide.md" className="btn" download="frequency-atlas-download-guide.md">
                Download Guide
              </a>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
