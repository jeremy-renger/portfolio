import type { Metadata } from 'next';
import PortfolioHeader from '../../../components/portfolio-header';
import FrequencyAtlasVisualizer from '../../../components/frequency-atlas-visualizer';
import { INTERVENTIONS } from '../../../lib/frequency-atlas-data';

const sources = INTERVENTIONS.flatMap((i) => i.citations);
const verified = sources.filter((c) => c.status === 'verified').length;

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
              <span className="trust-value">{INTERVENTIONS.length} intervention types · {sources.length} sources · {verified} verified so far</span>
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
              <li><strong>Audit in view:</strong> the source chart shows, per intervention, how many sources have been checked.</li>
              <li><strong>Honest charts:</strong> band bars show the reported direction of change only, and say so.</li>
              <li><strong>Sources inline:</strong> each finding sits beside the papers it came from.</li>
            </ul>
          </article>

          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Data model</h2>
            <ul className="detail-list">
              <li><strong>Intervention:</strong> category, mechanism, per-band effects, evidence, citations.</li>
              <li><strong>Evidence:</strong> a four-level strength grade plus, for every source, an audit status and a link to the record.</li>
              <li><strong>Bands:</strong> delta, theta, alpha, beta and gamma as stable comparison anchors.</li>
            </ul>
          </article>
        </section>

        <section className="detail-panel reveal reveal-delay-1">
          <h2 className="section-title" style={{ marginTop: 0 }}>Auditing my own sources</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            The first draft of this atlas was written with an AI assistant. When I checked its references against
            publishers and PubMed, most of the first eight had the wrong journal or a reworded title, and one paper
            could not be found at all; the finding it supported contradicted a real trial. So the atlas now carries
            its own audit: every source is marked verified or unverified, unfound sources and their findings are
            removed, and the draft&apos;s study counts and effect sizes are no longer shown.
          </p>
          <ul className="detail-list">
            <li><strong>{verified} of {sources.length}</strong> sources verified, each linked to its publisher or PubMed record.</li>
            <li><strong>1</strong> source not found and removed, with the finding it backed.</li>
            <li><strong>Lesson:</strong> AI-drafted references look right and are often wrong in the details. Check every one.</li>
          </ul>
        </section>

        <section className="detail-panel reveal reveal-delay-1" id="visualizer">
          <h2 className="section-title" style={{ marginTop: 0 }}>The atlas</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            Filter by intervention type, search findings, and see which sources have been checked. Grades are from the original draft and are being re-assessed as sources are verified.
          </p>
          <FrequencyAtlasVisualizer />
          <p className="atlas-notice" role="note">
            <strong>Not medical advice.</strong> This is an information-design project. Evidence grades are the
            author&apos;s own and not a formal clinical assessment. Findings come from the original draft and count as
            checked only where their source is marked verified. Talk to a clinician before trying any intervention.
          </p>
        </section>
      </main>
    </div>
  );
}
