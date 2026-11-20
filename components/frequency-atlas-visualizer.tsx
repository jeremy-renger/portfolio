'use client';

import { useMemo, useState } from 'react';
import {
  FREQUENCY_BANDS,
  INTERVENTIONS,
  type Intervention
} from '../lib/frequency-atlas-data';

type Category = 'all' | Intervention['category'];

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'sound', label: 'Sound' },
  { value: 'electromagnetic', label: 'Electromagnetic' },
  { value: 'neuromodulation', label: 'Neuromodulation' },
  { value: 'pharmacological', label: 'Pharmacological' },
  { value: 'physiological', label: 'Physiological' }
];

// The author's own grading of each evidence base, from study count, design and
// replication. Not a formal GRADE assessment.
// Grades come from the original draft and are pending the source audit.
const EVIDENCE: Record<Intervention['evidence']['quality'], { label: string; rank: number; className: string }> = {
  gold: { label: 'Strong', rank: 0, className: 'ev-strong' },
  silver: { label: 'Moderate', rank: 1, className: 'ev-moderate' },
  bronze: { label: 'Limited', rank: 2, className: 'ev-limited' },
  preliminary: { label: 'Preliminary', rank: 3, className: 'ev-prelim' }
};

const byEvidence = (a: Intervention, b: Intervention) =>
  EVIDENCE[a.evidence.quality].rank - EVIDENCE[b.evidence.quality].rank || b.evidence.studyCount - a.evidence.studyCount;

function effectToAfter(change: string, magnitude: string) {
  const map: Record<string, number> = { small: 12, medium: 22, large: 34 };
  const delta = map[magnitude] ?? 12;
  if (change === 'increase') return Math.min(92, 50 + delta);
  if (change === 'decrease') return Math.max(8, 50 - delta);
  return 62;
}

export default function FrequencyAtlasVisualizer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [selectedId, setSelectedId] = useState<string>(INTERVENTIONS[0]?.id ?? '');

  const filtered = useMemo(() => {
    return INTERVENTIONS.filter((item) => {
      const byCategory = category === 'all' || item.category === category;
      const q = query.trim().toLowerCase();
      const byQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keyFindings.some((k) => k.toLowerCase().includes(q));
      return byCategory && byQuery;
    }).sort(byEvidence);
  }, [query, category]);

  const sourceTotal = INTERVENTIONS.reduce((t, i) => t + i.citations.length, 0);
  const verifiedTotal = INTERVENTIONS.reduce((t, i) => t + i.citations.filter((c) => c.status === 'verified').length, 0);
  const maxSources = useMemo(() => Math.max(...INTERVENTIONS.map((i) => i.citations.length)), []);

  const selected = useMemo(() => {
    return INTERVENTIONS.find((item) => item.id === selectedId) ?? filtered[0] ?? INTERVENTIONS[0] ?? null;
  }, [selectedId, filtered]);

  const bandRows = useMemo(() => {
    if (!selected) return [];
    return Object.entries(FREQUENCY_BANDS).map(([key, band]) => {
      const effect = selected.frequencyEffects.find((entry) => entry.band === key);
      return {
        key,
        name: band.name,
        range: band.range,
        color: band.color,
        before: 50,
        after: effect ? effectToAfter(effect.change, effect.magnitude) : 50,
        change: effect?.change ?? 'none',
        magnitude: effect?.magnitude ?? 'none'
      };
    });
  }, [selected]);

  return (
    <div className="atlas-shell">
      <div className="atlas-controls">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="atlas-search"
          placeholder="Search interventions"
        />
        <div className="atlas-categories">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={`atlas-chip ${category === item.value ? 'is-on' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="atlas-grid">
        <aside className="atlas-list">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`atlas-item ${selected?.id === item.id ? 'is-selected' : ''}`}
              onClick={() => setSelectedId(item.id)}
            >
              <strong>{item.name}</strong>
              <span>
                <em className={`ev-badge ${EVIDENCE[item.evidence.quality].className}`}>{EVIDENCE[item.evidence.quality].label}</em>{' '}
                {item.citations.filter((c) => c.status === 'verified').length}/{item.citations.length} sources verified
              </span>
              <small>{item.category}</small>
            </button>
          ))}
        </aside>

        <section className="atlas-detail">
          {!selected ? (
            <p className="atlas-empty">No intervention matches the current filter.</p>
          ) : (
            <>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>

              <div className="atlas-meta">
                <span className={`ev-badge ${EVIDENCE[selected.evidence.quality].className}`}>
                  Draft grade: {EVIDENCE[selected.evidence.quality].label.toLowerCase()}
                </span>
                <span>
                  {selected.citations.filter((c) => c.status === 'verified').length} of {selected.citations.length} sources verified
                </span>
              </div>
              <p className="atlas-caption">Reported direction of change per band. Bar lengths are illustrative, not measured magnitudes.</p>

              <div className="atlas-bands">
                {bandRows.map((band) => (
                  <div key={band.key} className="atlas-band-row">
                    <div className="atlas-band-label">
                      <strong>{band.name}</strong>
                      <span>{band.range}</span>
                    </div>
                    <div className="atlas-band-bars">
                      <div className="atlas-bar-track">
                        <div className="atlas-bar before" style={{ width: `${band.before}%` }} />
                      </div>
                      <div className="atlas-bar-track">
                        <div className="atlas-bar after" style={{ width: `${band.after}%`, background: band.color }} />
                      </div>
                    </div>
                    <div className="atlas-band-status">
                      {band.change !== 'none' ? `${band.change} (${band.magnitude})` : 'no shift'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="atlas-findings">
                <h4>Reported findings</h4>
                <p className="atlas-caption">From the original draft. Treat a finding as checked only when its source below is marked verified.</p>
                <ul>
                  {selected.keyFindings.slice(0, 5).map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
                <h4>Sources</h4>
                <ul className="atlas-sources">
                  {selected.citations.map((c) => (
                    <li key={c.text}>
                      <em className={`src-badge src-${c.status}`}>{c.status === 'verified' ? '✓ verified' : 'unverified'}</em>{' '}
                      {c.url ? <a href={c.url} target="_blank" rel="noreferrer">{c.text}</a> : c.text}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </section>
      </div>

      <section className="atlas-protocols" aria-label="Source audit">
        <h4>Source audit</h4>
        <p className="atlas-caption">
          Sources per intervention: solid = checked against the publisher or PubMed, outline = not yet checked.
          {' '}{verifiedTotal} of {sourceTotal} verified so far; 1 source that could not be found has been removed.
        </p>
        <div className="ev-overview">
          {[...INTERVENTIONS].sort(byEvidence).map((item) => {
            const ok = item.citations.filter((c) => c.status === 'verified').length;
            return (
              <button key={item.id} type="button" className="ev-row" onClick={() => setSelectedId(item.id)}>
                <span className="ev-row-name">{item.name}</span>
                <span className="ev-row-track src-track">
                  {item.citations.map((c, k) => (
                    <span
                      key={k}
                      className={`src-cell ${c.status === 'verified' ? 'is-ok' : ''}`}
                      style={{ width: `${100 / maxSources}%` }}
                      title={c.text}
                    />
                  ))}
                </span>
                <span className="ev-row-n">{ok}/{item.citations.length}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
