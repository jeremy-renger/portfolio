import type { Metadata } from 'next';
import PortfolioHeader from '../../../components/portfolio-header';
import ConfusionMatrix from '../../../components/confusion-matrix';
import SpotifyVisualizer from '../../../components/spotify-visualizer';
import summary from '../../../lib/spotify-summary.json';

const n = summary.count.toLocaleString('en-US');
const pct = (v: number) => Math.round(v * 100);
const LABEL: Record<string, string> = { edm: 'EDM', latin: 'Latin', pop: 'Pop', 'r&b': 'R&B', rap: 'Rap', rock: 'Rock' };
const purity = Object.entries(summary.purity.by_genre)
  .map(([g, v]) => ({ genre: LABEL[g] ?? g, same: pct(v.neighbours_same_genre), chance: pct(v.chance) }))
  .sort((a, b) => b.same - a.same);
const overall = pct(summary.purity.overall);
const chanceAll = pct(Object.values(summary.purity.by_genre).reduce((t, v) => t + v.chance * v.chance, 0));

export const metadata: Metadata = {
  title: 'Spotify Audio Universe | Jeremy Renger',
  description:
    'Real Spotify tracks projected with UMAP and t-SNE into an explorable map: morph between projections, search, inspect neighbors.'
};


export default function SpotifyAudioUniversePage() {
  return (
    <div className="page-theme page-theme-visualizer portfolio-shell">
      <PortfolioHeader title="Spotify Audio Universe" kicker="Data visualization case study" />

      <main className="main">
        <section className="hero reveal">
          <p className="hero-subtitle">Flagship project</p>
          <h1 className="hero-title">{n} songs, mapped by how they sound.</h1>
          <p className="hero-copy">
            Each point is a real track placed by nine Spotify audio features. Real UMAP and t-SNE projections run
            offline in Python; the browser renders every point on canvas, morphs between the two maps, and lets
            you search, hover, and inspect neighbors.
          </p>
          <div className="actions">
            <a href="#demo" className="btn btn-primary">Explore the map</a>
            <a href="/papers/Renger_2026_Songs_vs_Genre.pdf" className="btn" target="_blank" rel="noreferrer">
              Read the paper (PDF)
            </a>
            <a
              href="https://github.com/Jeremy-Renger/portfolio/blob/main/scripts/build_spotify_embedding.py"
              className="btn"
              target="_blank"
              rel="noreferrer"
            >
              See the pipeline
            </a>
          </div>
          <div className="trust-bar">
            <div className="trust-item">
              <span className="trust-label">Data</span>
              <span className="trust-value">{n} unique songs · {summary.genres.length} genres · {summary.subgenres.length} subgenres</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Methods</span>
              <span className="trust-value">UMAP (umap-learn) · t-SNE (scikit-learn) · k-NN analysis</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Front end</span>
              <span className="trust-value">Next.js · TypeScript · canvas, grid-indexed hit testing</span>
            </div>
            <div className="trust-item">
              <span className="trust-label">Role</span>
              <span className="trust-value">Data pipeline, interaction design, implementation</span>
            </div>
          </div>
        </section>

        <SpotifyVisualizer />

        <section className="detail-panel reveal reveal-delay-1">
          <h2 className="section-title" style={{ marginTop: 0 }}>What the map shows</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            Playlist genre is a weak label for how a song sounds. Across all songs, {overall}% of a song&apos;s ten
            nearest neighbors in feature space share its genre, against about {chanceAll}% by chance. EDM, rock and rap form real
            regions; pop, latin and R&amp;B blend into each other. Color by energy or acousticness to see the
            structure the features actually carry.
          </p>
          <table className="purity-table">
            <thead>
              <tr>
                <th scope="col">Genre</th>
                <th scope="col">Nearest 10 neighbors, same genre</th>
                <th scope="col">Chance</th>
              </tr>
            </thead>
            <tbody>
              {purity.map((p) => (
                <tr key={p.genre}>
                  <td>{p.genre}</td>
                  <td>
                    <span className="purity-bar" style={{ width: `${p.same * 1.6}%` }} /> {p.same}%
                  </td>
                  <td>{p.chance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="detail-panel reveal reveal-delay-1">
          <h2 className="section-title" style={{ marginTop: 0 }}>Which genres get confused</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            A random forest that hears only the nine audio features gets {Math.round(summary.confusion.accuracy * 100)}% of
            genres right. Its mistakes are not random: they follow the overlaps on the map. Switch the map to
            <strong> genre fit</strong> to see which songs sound more like another genre than their own.
          </p>
          <ConfusionMatrix />
        </section>

        <section className="project-columns reveal reveal-delay-2">
          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Method</h2>
            <ul className="detail-list">
              <li><strong>Input:</strong> danceability, energy, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo; z-scored; one row per title and artist.</li>
              <li><strong>Projection:</strong> UMAP (n_neighbors 30, min_dist 0.15) and t-SNE (perplexity 40), fixed seed, so the maps are reproducible.</li>
              <li><strong>Quality check:</strong> trustworthiness at k=10 is {summary.method.umap.trustworthiness10.toFixed(2)} for UMAP and {summary.method.tsne.trustworthiness10.toFixed(2)} for t-SNE: t-SNE keeps local neighbors better, UMAP keeps more of the global layout.</li>
              <li><strong>Morph:</strong> both maps share one frame, so switching animates each track from its UMAP to its t-SNE position.</li>
            </ul>
          </article>

          <article className="detail-panel">
            <h2 className="section-title" style={{ marginTop: 0 }}>Engineering</h2>
            <ul className="detail-list">
              <li><strong>Payload:</strong> columnar JSON, 2.4 MB raw, about 0.7 MB compressed, loaded after first paint.</li>
              <li><strong>Rendering:</strong> one canvas pass over every point with additive blending, sized to device pixel ratio.</li>
              <li><strong>Hit testing:</strong> a 12 px spatial grid makes hover lookup constant-time instead of scanning every point.</li>
              <li><strong>Accessibility:</strong> pressed states on toggles, a labelled canvas, and no morph animation when reduced motion is set.</li>
            </ul>
          </article>
        </section>

        <p className="viz-footnote reveal">
          Data: TidyTuesday 2020-01-21 Spotify songs, collected from the Spotify Web API with spotifyr. Not affiliated
          with or endorsed by Spotify.
        </p>
      </main>
    </div>
  );
}
