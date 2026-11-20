"""Build public/data/spotify-universe.json: real UMAP and t-SNE projections of
real Spotify audio features.

Data: TidyTuesday 2020-01-21 "spotify_songs.csv" (collected from the Spotify
Web API with the spotifyr package). https://github.com/rfordatascience/tidytuesday/tree/master/data/2020/2020-01-21

Run:
    pip install umap-learn scikit-learn pandas
    curl -LO https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-01-21/spotify_songs.csv
    python scripts/build_spotify_embedding.py spotify_songs.csv public/data/spotify-universe.json
"""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import numpy as np
import pandas as pd
import umap
from sklearn.manifold import TSNE, trustworthiness
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

FEATURES = [
    "danceability", "energy", "loudness", "speechiness", "acousticness",
    "instrumentalness", "liveness", "valence", "tempo",
]
SEED = 42


def normalise(xy: np.ndarray) -> np.ndarray:
    """Centre and scale to [-1, 1] on the longer axis, so both maps share a frame."""
    xy = xy - xy.mean(axis=0)
    return xy / np.abs(xy).max()


def main(src: str, out: str) -> None:
    df = pd.read_csv(src)
    # A track appears once per playlist, and the same song often has several
    # IDs (single, album, compilation). Keep one row per title + artist, with
    # the genre of the first playlist it appears in.
    df = df.dropna(subset=["track_name", "track_artist"])
    key = df.track_name.str.lower().str.strip() + "\u241f" + df.track_artist.str.lower().str.strip()
    df = df.loc[~key.duplicated()].reset_index(drop=True)
    X = StandardScaler().fit_transform(df[FEATURES].to_numpy(dtype=float))
    print(f"{len(df)} unique tracks, {df.playlist_genre.nunique()} genres, {df.playlist_subgenre.nunique()} subgenres")

    t = time.time()
    u = umap.UMAP(n_neighbors=30, min_dist=0.15, metric="euclidean", random_state=SEED).fit_transform(X)
    print(f"UMAP {time.time() - t:.0f}s")
    t = time.time()
    s = TSNE(n_components=2, perplexity=40, init="pca", learning_rate="auto", random_state=SEED).fit_transform(X)
    print(f"t-SNE {time.time() - t:.0f}s")

    # How well each map keeps local neighborhoods (1.0 = perfect), on a sample for speed.
    rng = np.random.default_rng(SEED)
    idx = rng.choice(len(X), size=min(5000, len(X)), replace=False)
    tw_u = trustworthiness(X[idx], u[idx], n_neighbors=10)
    tw_s = trustworthiness(X[idx], s[idx], n_neighbors=10)
    print(f"trustworthiness@10  UMAP {tw_u:.3f}  t-SNE {tw_s:.3f}")

    # Genre purity: share of each track's 10 nearest neighbors (in the full
    # 9-feature space, not the 2D map) that carry the same playlist genre.
    g = df.playlist_genre.to_numpy(dtype=object)
    _, nbr = NearestNeighbors(n_neighbors=11).fit(X).kneighbors(X)
    same = (g[nbr[:, 1:]] == g[:, None]).mean(axis=1)
    share = df.playlist_genre.value_counts(normalize=True)
    purity = {
        k: {"neighbours_same_genre": round(float(v), 3), "chance": round(float(share[k]), 3)}
        for k, v in pd.Series(same).groupby(g).mean().items()
    }
    print(f"genre purity@10 overall {same.mean():.3f}", purity)

    # Which genres get mistaken for which: random-forest predictions from
    # 5-fold cross-validation, so every song is predicted by a model that
    # never saw it. Rows = true genre, columns = predicted, each row sums to 1.
    labels = sorted(df.playlist_genre.unique())
    pred = cross_val_predict(
        RandomForestClassifier(n_estimators=300, random_state=SEED, n_jobs=-1), X, g,
        cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED),
    )
    cm = confusion_matrix(g, pred, labels=labels, normalize="true")
    accuracy = float((pred == g).mean())
    print(f"random forest accuracy (5-fold) {accuracy:.3f}")

    genres = sorted(df.playlist_genre.unique())
    subgenres = sorted(df.playlist_subgenre.unique())
    u, s = normalise(u), normalise(s)
    r = lambda a, n=3: [round(float(v), n) for v in a]  # noqa: E731

    payload = {
        "source": {
            "name": "TidyTuesday 2020-01-21: Spotify songs (via the Spotify Web API / spotifyr)",
            "url": "https://github.com/rfordatascience/tidytuesday/tree/master/data/2020/2020-01-21",
        },
        "method": {
            "features": FEATURES,
            "scaling": "z-score per feature",
            "umap": {"library": f"umap-learn {umap.__version__}", "n_neighbors": 30, "min_dist": 0.15, "seed": SEED,
                     "trustworthiness10": round(float(tw_u), 3)},
            "tsne": {"library": "scikit-learn", "perplexity": 40, "init": "pca", "seed": SEED,
                     "trustworthiness10": round(float(tw_s), 3)},
        },
        "purity": {"overall": round(float(same.mean()), 3), "by_genre": purity},
        "confusion": {"labels": labels, "accuracy": round(accuracy, 3),
                      "rows": [[round(float(v), 3) for v in row] for row in cm]},
        "count": len(df),
        "genres": genres,
        "subgenres": subgenres,
        # Columnar arrays keep the file small; index i is one track everywhere.
        "name": df.track_name.str.slice(0, 80).tolist(),
        "artist": df.track_artist.str.slice(0, 60).tolist(),
        "genre": [genres.index(g) for g in df.playlist_genre],
        "subgenre": [subgenres.index(g) for g in df.playlist_subgenre],
        "popularity": df.track_popularity.astype(int).tolist(),
        "energy": r(df.energy, 2),
        "valence": r(df.valence, 2),
        "danceability": r(df.danceability, 2),
        "acousticness": r(df.acousticness, 2),
        "tempo": r(df.tempo, 0),
        # Share of the song's 10 nearest neighbors with the same genre (0-1).
        "agreement": r(same, 1),
        "umap": r(u.ravel()),
        "tsne": r(s.ravel()),
    }
    with open(out, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
    print(f"wrote {out}")
    write_summary(payload)


def write_summary(payload: dict) -> None:
    """Small file the pages import, so the page copy always matches the data."""
    summary = {k: payload[k] for k in ("source", "method", "purity", "confusion", "count", "genres", "subgenres")}
    path = Path(__file__).resolve().parent.parent / "lib" / "spotify-summary.json"
    path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {path}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
