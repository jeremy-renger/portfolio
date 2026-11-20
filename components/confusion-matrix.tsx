import summary from '../lib/spotify-summary.json';

const LABEL: Record<string, string> = { edm: 'EDM', latin: 'Latin', pop: 'Pop', 'r&b': 'R&B', rap: 'Rap', rock: 'Rock' };
const pct = (v: number) => `${Math.round(v * 100)}%`;

// Rows: the genre a song is labeled with. Columns: what a random forest,
// trained without that song, predicts from its nine audio features.
export default function ConfusionMatrix() {
  const { labels, rows, accuracy } = summary.confusion;
  // The most common wrong guess, to name in the caption.
  let worst = { from: '', to: '', v: 0 };
  rows.forEach((row, i) =>
    row.forEach((v, j) => {
      if (i !== j && v > worst.v) worst = { from: labels.at(i) ?? '', to: labels.at(j) ?? '', v };
    })
  );
  return (
    <figure className="cm">
      <div className="cm-grid" style={{ gridTemplateColumns: `6.5rem repeat(${labels.length}, minmax(0, 1fr))` }} role="table" aria-label="Genre confusion matrix">
        <span className="cm-corner" role="columnheader">labeled ↓ / predicted →</span>
        {labels.map((l) => (
          <span key={`h-${l}`} className="cm-head" role="columnheader">{LABEL[l] ?? l}</span>
        ))}
        {rows.map((row, i) => (
          <div key={labels.at(i)} className="cm-row" role="row">
            <span className="cm-head cm-rowhead" role="rowheader">{LABEL[labels.at(i) ?? ''] ?? labels.at(i)}</span>
            {row.map((v, j) => (
              <span
                key={j}
                role="cell"
                className={`cm-cell ${i === j ? 'cm-diag' : ''}`}
                style={{ ['--a' as string]: String(Math.min(1, v * 1.6)) }}
                title={`${LABEL[labels.at(i) ?? '']} predicted as ${LABEL[labels.at(j) ?? '']}: ${pct(v)}`}
              >
                {pct(v)}
              </span>
            ))}
          </div>
        ))}
      </div>
      <figcaption className="viz-footnote">
        Random forest, 5-fold cross-validation, {pct(accuracy)} correct overall. Each row sums to 100%. The most common
        mix-up: {pct(worst.v)} of {LABEL[worst.from]} songs are predicted as {LABEL[worst.to]}.
      </figcaption>
    </figure>
  );
}
