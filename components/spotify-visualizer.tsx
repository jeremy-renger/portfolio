'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Columnar payload written by scripts/build_spotify_embedding.py.
type Payload = {
  source: { name: string; url: string };
  method: {
    features: string[];
    umap: { library: string; n_neighbors: number; min_dist: number; trustworthiness10: number };
    tsne: { library: string; perplexity: number; trustworthiness10: number };
  };
  count: number;
  genres: string[];
  subgenres: string[];
  name: string[];
  artist: string[];
  genre: number[];
  subgenre: number[];
  popularity: number[];
  energy: number[];
  valence: number[];
  danceability: number[];
  acousticness: number[];
  tempo: number[];
  agreement: number[];
  umap: number[];
  tsne: number[];
};

type Projection = 'umap' | 'tsne';
type ColorMode = 'genre' | 'fit' | 'energy' | 'valence' | 'acousticness' | 'popularity';

const GENRE_COLORS = ['#4cc9f0', '#ffb703', '#ff5d8f', '#a78bfa', '#57cc99', '#ff7a45'];
// Perceptually ordered ramp (dark violet -> teal -> yellow), readable on the dark canvas.
const RAMP: [number, number, number][] = [
  [68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]
];
const MORPH_MS = 900;
const CELL = 12; // px, hit-test grid

function rampColor(t: number) {
  const x = Math.min(0.9999, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = RAMP[i];
  const b = RAMP[i + 1];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function SpotifyVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState('');
  const [projection, setProjection] = useState<Projection>('umap');
  const [colorMode, setColorMode] = useState<ColorMode>('genre');
  const [hiddenGenres, setHiddenGenres] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState('');
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [size, setSize] = useState({ w: 960, h: 600, dpr: 1 });

  // Animated position: 0 = UMAP, 1 = t-SNE.
  const mixRef = useRef(0);
  const [mix, setMix] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch('/data/spotify-universe.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: Payload) => alive && setData(json))
      .catch((e) => alive && setError(`Could not load the dataset (${e.message}).`));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      setSize({ w, h: Math.round(Math.min(720, Math.max(360, w * 0.62))), dpr: Math.min(2, window.devicePixelRatio || 1) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Morph between projections.
  useEffect(() => {
    const target = projection === 'umap' ? 0 : 1;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      mixRef.current = target;
      setMix(target);
      return;
    }
    const from = mixRef.current;
    if (from === target) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / MORPH_MS);
      mixRef.current = from + (target - from) * ease(t);
      setMix(mixRef.current);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [projection]);

  const matches = useMemo(() => {
    if (!data) return null;
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;
    const out = new Set<number>();
    for (let i = 0; i < data.count; i += 1) {
      if (data.name[i].toLowerCase().includes(q) || data.artist[i].toLowerCase().includes(q)) out.add(i);
    }
    return out;
  }, [data, query]);

  const colorOf = useCallback(
    (i: number) => {
      if (!data) return '#fff';
      switch (colorMode) {
        case 'genre':
          return GENRE_COLORS[data.genre[i] % GENRE_COLORS.length];
        case 'popularity':
          return rampColor(data.popularity[i] / 100);
        case 'fit':
          return rampColor(data.agreement[i]);
        default:
          return rampColor(data[colorMode][i]);
      }
    },
    [data, colorMode]
  );

  // Screen positions for the current frame + a grid for fast hover lookup.
  const frame = useMemo(() => {
    if (!data) return null;
    const pad = 24;
    const { w, h } = size;
    const xs = new Float32Array(data.count);
    const ys = new Float32Array(data.count);
    // Interpolate, then fit the current shape to the canvas with one uniform
    // scale (no stretching, so distances stay honest).
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let i = 0; i < data.count; i += 1) {
      const ux = data.umap[2 * i];
      const uy = data.umap[2 * i + 1];
      xs[i] = ux + (data.tsne[2 * i] - ux) * mix;
      ys[i] = uy + (data.tsne[2 * i + 1] - uy) * mix;
      if (xs[i] < x0) x0 = xs[i];
      if (xs[i] > x1) x1 = xs[i];
      if (ys[i] < y0) y0 = ys[i];
      if (ys[i] > y1) y1 = ys[i];
    }
    const s = Math.min((w - 2 * pad) / (x1 - x0 || 1), (h - 2 * pad) / (y1 - y0 || 1));
    const ox = (w - (x1 - x0) * s) / 2;
    const oy = (h - (y1 - y0) * s) / 2;
    const grid = new Map<number, number[]>();
    const cols = Math.ceil(w / CELL) + 1;
    for (let i = 0; i < data.count; i += 1) {
      xs[i] = ox + (xs[i] - x0) * s;
      ys[i] = oy + (ys[i] - y0) * s;
      if (hiddenGenres.has(data.genre[i])) continue;
      const key = Math.floor(ys[i] / CELL) * cols + Math.floor(xs[i] / CELL);
      const bucket = grid.get(key);
      if (bucket) bucket.push(i);
      else grid.set(key, [i]);
    }
    return { xs, ys, grid, cols };
  }, [data, size, mix, hiddenGenres]);

  // Draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || !frame) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h, dpr } = size;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, w, h);
    const dim = matches !== null;
    const r = Math.max(1.6, Math.min(2.6, w / 520));
    for (let i = 0; i < data.count; i += 1) {
      if (hiddenGenres.has(data.genre[i]) || (dim && matches.has(i))) continue;
      ctx.globalAlpha = dim ? 0.16 : 0.72;
      ctx.fillStyle = colorOf(i);
      ctx.fillRect(frame.xs[i] - r / 2, frame.ys[i] - r / 2, r, r);
    }
    // Search hits are drawn last, larger, so nothing covers them.
    if (dim) {
      ctx.globalAlpha = 1;
      matches.forEach((i) => {
        if (hiddenGenres.has(data.genre[i])) return;
        ctx.fillStyle = colorOf(i);
        ctx.beginPath();
        ctx.arc(frame.xs[i], frame.ys[i], r + 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
    ctx.globalAlpha = 1;
    const mark = (i: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(frame.xs[i], frame.ys[i], 7, 0, Math.PI * 2);
      ctx.stroke();
    };
    if (colorMode === 'genre' && !dim) {
      // Label each genre where it is most concentrated: the grid cell with the
      // most songs of that genre, weighted by how much of the cell they make up.
      ctx.font = '600 13px var(--font-work), system-ui, sans-serif';
      ctx.textAlign = 'center';
      const CELLS = 24;
      const cw = w / CELLS;
      const chh = h / CELLS;
      const counts = new Map<number, number[]>();
      for (let i = 0; i < data.count; i += 1) {
        if (hiddenGenres.has(data.genre[i])) continue;
        const key = Math.floor(frame.ys[i] / chh) * CELLS + Math.floor(frame.xs[i] / cw);
        let c = counts.get(key);
        if (!c) {
          c = data.genres.map(() => 0);
          counts.set(key, c);
        }
        c[data.genre[i]] += 1;
      }
      data.genres.forEach((name, gi) => {
        if (hiddenGenres.has(gi)) return;
        let best = -1;
        let bestScore = 0;
        counts.forEach((c, key) => {
          const total = c.reduce((t, v) => t + v, 0);
          const n = c.at(gi) ?? 0;
          if (total < 12) return;
          const score = (n * n) / total;
          if (score > bestScore) {
            bestScore = score;
            best = key;
          }
        });
        if (best < 0) return;
        const mx = ((best % CELLS) + 0.5) * cw;
        const my = (Math.floor(best / CELLS) + 0.5) * chh;
        const label = name.toUpperCase();
        const lw = ctx.measureText(label).width + 14;
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#050b14';
        ctx.fillRect(mx - lw / 2, my - 11, lw, 20);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = GENRE_COLORS[gi % GENRE_COLORS.length];
        ctx.lineWidth = 1;
        ctx.strokeRect(mx - lw / 2, my - 11, lw, 20);
        ctx.fillStyle = GENRE_COLORS[gi % GENRE_COLORS.length];
        ctx.fillText(label, mx, my + 4);
      });
      ctx.textAlign = 'start';
    }
    if (pinned !== null) mark(pinned, '#ffffff');
    if (hover && hover.i !== pinned) mark(hover.i, 'rgba(255,255,255,0.7)');
  }, [data, frame, size, colorOf, hiddenGenres, matches, pinned, hover]);

  const nearestAt = (x: number, y: number) => {
    if (!frame) return -1;
    let best = -1;
    let bestD = 14 * 14;
    const gx = Math.floor(x / CELL);
    const gy = Math.floor(y / CELL);
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const bucket = frame.grid.get((gy + dy) * frame.cols + gx + dx);
        if (!bucket) continue;
        for (const i of bucket) {
          const d = (frame.xs[i] - x) ** 2 + (frame.ys[i] - y) ** 2;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
      }
    }
    return best;
  };

  const pointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const i = nearestAt(x, y);
    setHover(i >= 0 ? { i, x, y } : null);
  };

  // Tracks closest to the pinned one on the current map.
  const neighbors = useMemo(() => {
    if (!data || !frame || pinned === null) return [];
    const px = frame.xs[pinned];
    const py = frame.ys[pinned];
    const out: { i: number; d: number }[] = [];
    for (let i = 0; i < data.count; i += 1) {
      if (i === pinned || hiddenGenres.has(data.genre[i])) continue;
      out.push({ i, d: (frame.xs[i] - px) ** 2 + (frame.ys[i] - py) ** 2 });
    }
    return out.sort((a, b) => a.d - b.d).slice(0, 6).map((n) => n.i);
  }, [data, frame, pinned, hiddenGenres]);

  const genreCounts = useMemo(() => {
    if (!data) return [];
    const c = data.genres.map(() => 0);
    data.genre.forEach((g) => (c[g] += 1));
    return c;
  }, [data]);

  const toggleGenre = (g: number) =>
    setHiddenGenres((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `spotify-audio-universe-${projection}-${colorMode}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const visible = data ? data.genre.filter((g) => !hiddenGenres.has(g)).length : 0;
  const card = (i: number) =>
    data ? (
      <>
        <p className="viz-track-name"><strong>{data.name[i]}</strong> · {data.artist[i]}</p>
        <p className="viz-track-meta">
          {data.genres[data.genre[i]]} / {data.subgenres[data.subgenre[i]]} · popularity {data.popularity[i]} · {data.tempo[i]} BPM
        </p>
        <p className="viz-track-meta">
          genre fit {Math.round(data.agreement[i] * 100)}% · energy {data.energy[i].toFixed(2)} · valence {data.valence[i].toFixed(2)} · danceability {data.danceability[i].toFixed(2)} · acousticness {data.acousticness[i].toFixed(2)}
        </p>
      </>
    ) : null;

  return (
    <section className="viz-shell detail-panel reveal" id="demo">
      <div className="viz-top">
        <div>
          <h2 className="section-title" style={{ marginTop: 0 }}>Explore the map</h2>
          <p className="hero-copy" style={{ maxWidth: 'none' }}>
            {data ? data.count.toLocaleString('en-US') : '26,159'} real songs, each placed by nine Spotify audio features. Nearby
            points sound alike. Switch projections to watch every track move between the two maps; hover to inspect,
            click to pin and see its neighbors, search for an artist.
          </p>
        </div>
        <div className="viz-buttons">
          <button type="button" className="btn" onClick={download} disabled={!data}>Download PNG</button>
        </div>
      </div>

      {error ? <p className="viz-loading" role="alert">{error}</p> : null}
      {!data && !error ? <p className="viz-loading">Loading 26k songs (≈0.7 MB)…</p> : null}

      <div className="viz-controls">
        <div className="viz-control-group" role="group" aria-label="Projection">
          <span className="viz-control-label">Projection</span>
          {(['umap', 'tsne'] as const).map((p) => (
            <button key={p} type="button" aria-pressed={projection === p} className={`btn ${projection === p ? 'btn-primary' : ''}`} onClick={() => setProjection(p)}>
              {p === 'umap' ? 'UMAP' : 't-SNE'}
            </button>
          ))}
        </div>
        <div className="viz-control-group" role="group" aria-label="Color by">
          <span className="viz-control-label">Color</span>
          {(['genre', 'fit', 'energy', 'valence', 'acousticness', 'popularity'] as const).map((m) => (
            <button key={m} type="button" aria-pressed={colorMode === m} className={`btn ${colorMode === m ? 'btn-primary' : ''}`} onClick={() => setColorMode(m)}>
              {m === 'fit' ? 'genre fit' : m}
            </button>
          ))}
        </div>
        <label className="viz-search">
          <span className="viz-control-label">Search</span>
          <input type="search" placeholder="artist or track" value={query} onChange={(e) => setQuery(e.target.value)} />
          {matches ? <span className="viz-search-count">{matches.size.toLocaleString()} found</span> : null}
        </label>
      </div>

      {data ? (
        <div className="viz-chip-wrap" role="group" aria-label="Genres">
          {data.genres.map((g, gi) => (
            <button
              type="button"
              key={g}
              aria-pressed={!hiddenGenres.has(gi)}
              className={`viz-chip ${hiddenGenres.has(gi) ? '' : 'is-on'}`}
              onClick={() => toggleGenre(gi)}
            >
              {colorMode === 'genre' ? <span className="viz-swatch" style={{ background: GENRE_COLORS[gi] }} /> : null}
              {g} <span className="viz-chip-count">{genreCounts[gi].toLocaleString()}</span>
            </button>
          ))}
          <span className="viz-visible">{visible.toLocaleString()} shown</span>
        </div>
      ) : null}

      {colorMode !== 'genre' ? (
        <div className="viz-ramp" aria-hidden="true">
          <span>{colorMode === 'fit' ? 'sounds like other genres' : `low ${colorMode}`}</span>
          <span className="viz-ramp-bar" style={{ background: `linear-gradient(90deg, ${RAMP.map((c) => `rgb(${c.join(',')})`).join(',')})` }} />
          <span>{colorMode === 'fit' ? 'sounds like its own genre' : 'high'}</span>
        </div>
      ) : null}

      <div className="viz-canvas-wrap" ref={wrapRef} style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          className="viz-canvas"
          style={{ width: size.w, height: size.h, cursor: hover ? 'pointer' : 'crosshair' }}
          onPointerMove={pointer}
          onPointerLeave={() => setHover(null)}
          onClick={() => setPinned(hover ? hover.i : null)}
          role="img"
          aria-label={`Scatter map of ${data?.count ?? 0} Spotify tracks projected with ${projection === 'umap' ? 'UMAP' : 't-SNE'}`}
        />
        {hover && data ? (
          <div className="viz-tooltip" style={{ left: Math.min(hover.x + 14, size.w - 260), top: Math.max(hover.y - 12, 0) }}>
            {card(hover.i)}
          </div>
        ) : null}
      </div>

      {pinned !== null && data ? (
        <section className="viz-track-card">
          <h3>Pinned track</h3>
          {card(pinned)}
          <p className="viz-track-meta" style={{ marginTop: 12 }}><strong>Closest on this map:</strong></p>
          <ul className="viz-neighbors">
            {neighbors.map((n) => (
              <li key={n}>
                <button type="button" className="viz-neighbor" onClick={() => setPinned(n)}>
                  {data.name[n]} · {data.artist[n]} <span>({data.genres[data.genre[n]]})</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data ? (
        <p className="viz-footnote">
          UMAP ({data.method.umap.library}, n_neighbors {data.method.umap.n_neighbors}, min_dist {data.method.umap.min_dist}) and t-SNE
          ({data.method.tsne.library}, perplexity {data.method.tsne.perplexity}) computed offline on z-scored features. Neighborhood
          trustworthiness at k=10: UMAP {data.method.umap.trustworthiness10}, t-SNE {data.method.tsne.trustworthiness10}. Data:{' '}
          <a href={data.source.url} target="_blank" rel="noreferrer">{data.source.name}</a>.
        </p>
      ) : null}
    </section>
  );
}
