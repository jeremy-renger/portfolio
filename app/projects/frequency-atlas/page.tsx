import type { Metadata } from 'next';
import PortfolioHeader from '../../../components/portfolio-header';
import FrequencyAtlasVisualizer from '../../../components/frequency-atlas-visualizer';

export const metadata: Metadata = {
  title: 'Frequency Atlas | Jeremy Renger',
  description:
    'An interface design study: presenting research of very uneven quality so weak evidence looks weak and strong evidence looks strong.'
};

export default function FrequencyAtlasPage() {
  return (
    <div className="page-theme page-theme-research-hub portfolio-shell">
      <PortfolioHeader title="Frequency Atlas" kicker="Interface design study" />

      <main className="main frequency-whitepaper-shell">
        <section className="hero reveal">
          <p className="hero-subtitle">Design study</p>
          <h1 className="hero-title">Making weak evidence look weak.</h1>
          <p className="hero-copy">
            Brainwave and neuromodulation research ranges from replicated clinical trials to single unblinded studies.
            Most interfaces flatten that into one list where everything looks equally credible. Frequency Atlas puts the
            strength of the evidence first, so a reader can tell the difference at a glance.
          </p>
          <div className="actions">
            <a href="#visualizer" className="btn btn-primary">Open the atlas</a>
          </div>
          <div className="trust-bar">
            <div className="trust-item">
              <span className="trust-label">Scope</span>
              <span className="trust-value">10 intervention types · 5 EEG bands · 31 cited sources</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Design problem</span>
              <span className="trust-value">Show uncertainty without hiding the content</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Build</span>
              <span className="trust-value">Next.js · TypeScript · typed research data model</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Role</span>
              <span className="trust-value">Research synthesis, information design, implementation</span>
            </div>
          </div>
        </section>

        <section className="project-columns reveal reveal-delay-1">
          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Design decisions</h2>
            <ul className="detail-list">
              <li><strong>Evidence first:</strong> every intervention carries a strength badge, and lists sort strongest first.</li>
              <li><strong>Counts are not quality:</strong> the overview shows study counts coloured by strength, because many weak studies are still weak.</li>
              <li><strong>Honest charts:</strong> band bars show the reported direction of change only, and say so.</li>
              <li><strong>Sources inline:</strong> each finding sits beside the papers it came from.</li>
            </ul>
          </article>

          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Data model</h2>
            <ul className="detail-list">
              <li><strong>Intervention:</strong> category, mechanism, per-band effects, evidence, citations.</li>
              <li><strong>Evidence:</strong> study count, participants, pooled effect size (Cohen&apos;s d), replication status, and a four-level strength grade.</li>
              <li><strong>Bands:</strong> delta, theta, alpha, beta and gamma as stable comparison anchors.</li>
            </ul>
          </article>
        </section>

        <section className="detail-panel reveal reveal-delay-1" id="visualizer">
          <h2 className="section-title" style={{ marginTop: 0 }}>The atlas</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            Filter by intervention type, search findings, and compare evidence strength across the field.
          </p>
          <FrequencyAtlasVisualizer />
          <p className="atlas-notice" role="note">
            <strong>Not medical advice.</strong> This is an information-design project. Evidence grades are the
            author&apos;s own, based on study count, design and replication, not a formal clinical assessment. Findings
            are summarised from the cited papers and have not been independently verified. Talk to a clinician before
            trying any intervention.
          </p>
        </section>
      </main>
    </div>
  );
}
