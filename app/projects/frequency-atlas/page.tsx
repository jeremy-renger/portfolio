import type { Metadata } from 'next';
import PortfolioHeader from '../../../components/portfolio-header';
import FrequencyAtlasVisualizer from '../../../components/frequency-atlas-visualizer';
import { FINDING_AUDIT as F, INTERVENTIONS, SOURCE_AUDIT as A } from '../../../lib/frequency-atlas-data';

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
              <li><strong>Intervention:</strong> category, sourced findings, per-band changes, evidence grade, citations.</li>
              <li><strong>Evidence:</strong> a four-level strength grade plus, for every source, an audit status and a link to the record.</li>
              <li><strong>Bands:</strong> delta, theta, alpha, beta and gamma as stable comparison anchors.</li>
            </ul>
          </article>
        </section>

        <section className="detail-panel reveal reveal-delay-1">
          <h2 className="section-title" style={{ marginTop: 0 }}>Auditing my own sources</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            The first draft of this atlas was written with an AI assistant. I checked every one of its {A.checked} references
            against the publisher, PubMed or the journal&apos;s own site. Only {A.correctAsWritten} were right as written.
          </p>
          <div className="audit-bar" role="img" aria-label={`Of ${A.checked} citations: ${A.correctAsWritten} correct, ${A.realButWrongDetails} real but wrong details, ${A.notFound} not found, ${A.unconfirmed} unconfirmed`}>
            <span className="audit-ok" style={{ flex: A.correctAsWritten }}>{A.correctAsWritten} correct</span>
            <span className="audit-fixed" style={{ flex: A.realButWrongDetails }}>{A.realButWrongDetails} wrong journal, title or year</span>
            <span className="audit-missing" style={{ flex: A.notFound }}>{A.notFound} not found</span>
            <span className="audit-unknown" style={{ flex: Math.max(A.unconfirmed, 1) }}>{A.unconfirmed}</span>
          </div>
          <ul className="detail-list">
            <li><strong>Fixed:</strong> {A.realButWrongDetails} citations pointed at real papers with the wrong journal, title or year. One &quot;human mortality&quot; source was really a study in rats.</li>
            <li><strong>Replaced or removed:</strong> {A.notFound} could not be found. {A.replacedWithRealSources} were replaced by real studies that support the same point; the rest were removed with the findings they backed, including one that a real trial contradicts.</li>
            <li><strong>Also removed:</strong> the draft&apos;s study counts, participant numbers, effect sizes, safety ratings and clinical-outcome scores, none of which had a source.</li>
            <li><strong>Findings:</strong> of the draft&apos;s {F.drafted} findings, only {F.supportedAsWritten} matched their source as written. {F.rewordedToMatchSource} were reworded to say what the source actually says, {F.contradictedBySource} were contradicted by their own source and corrected, and {F.removedNoSource + F.removedEarlier} were removed ({F.removedNoSource} with no support in any cited source, {F.removedEarlier} earlier as overstated or backed by references that do not exist). The draft&apos;s {F.inventedProtocolsRemoved} &ldquo;combination protocols&rdquo; with invented synergy numbers were removed too.</li>
            <li><strong>Now:</strong> {verified} of {sources.length} sources verified and linked; every finding and every band change points to its source; grades follow one stated rule.</li>
          </ul>
          <div className="actions">
            <a href="/papers/Renger_2026_Frequency_Atlas_Source_Audit.pdf" className="btn btn-primary" target="_blank" rel="noreferrer">Read the audit paper (PDF)</a>
          </div>
        </section>

        <section className="detail-panel reveal reveal-delay-1" id="visualizer">
          <h2 className="section-title" style={{ marginTop: 0 }}>The atlas</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            Filter by intervention type and search findings. Every finding links to its source. Grades follow one rule applied to the cited sources: strong = a large randomized trial or meta-analysis; moderate = controlled human studies or systematic reviews; limited = small pilots only; preliminary = hypotheses, animal studies or secondhand reports only.
          </p>
          <FrequencyAtlasVisualizer />
          <p className="atlas-notice" role="note">
            <strong>Not medical advice.</strong> This is an information-design project. Evidence grades follow the
            rule stated above and are not a formal clinical assessment. Every finding is matched to a verified source
            or labeled as the author&apos;s note. Talk to a clinician before trying any intervention.
          </p>
        </section>
      </main>
    </div>
  );
}
