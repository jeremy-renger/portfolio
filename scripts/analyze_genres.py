"""Genre analysis behind the Spotify Audio Universe write-up.

Reproduces: trustworthiness at k = 5/10/30, genre classifier accuracy
(5-fold CV), and each genre's mean z-score per feature.

Run after build_spotify_embedding.py:
    python scripts/analyze_genres.py spotify_songs.csv public/data/spotify-universe.json
"""

from __future__ import annotations

import json
import sys

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.manifold import trustworthiness
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler

FEATURES = [
    "danceability", "energy", "loudness", "speechiness", "acousticness",
    "instrumentalness", "liveness", "valence", "tempo",
]
SEED = 42


def load(src: str) -> pd.DataFrame:
    # Same de-duplication as build_spotify_embedding.py: one row per title + artist.
    df = pd.read_csv(src).dropna(subset=["track_name", "track_artist"])
    key = df.track_name.str.lower().str.strip() + "␟" + df.track_artist.str.lower().str.strip()
    return df.loc[~key.duplicated()].reset_index(drop=True)


def main(src: str, embedding: str) -> None:
    df = load(src)
    X = StandardScaler().fit_transform(df[FEATURES].to_numpy(dtype=float))
    y = df.playlist_genre.to_numpy()
    print(f"{len(df)} songs")

    d = json.load(open(embedding, encoding="utf-8"))
    u = np.asarray(d["umap"]).reshape(-1, 2)
    t = np.asarray(d["tsne"]).reshape(-1, 2)
    assert len(u) == len(df), "embedding and CSV disagree; rebuild the embedding first"
    idx = np.random.default_rng(SEED).choice(len(X), size=5000, replace=False)
    for k in (5, 10, 30):
        tu = trustworthiness(X[idx], u[idx], n_neighbors=k)
        ts = trustworthiness(X[idx], t[idx], n_neighbors=k)
        print(f"trustworthiness k={k:>2}  UMAP {tu:.3f}  t-SNE {ts:.3f}")

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    baseline = df.playlist_genre.value_counts(normalize=True).max()
    lr = cross_val_score(LogisticRegression(max_iter=2000), X, y, cv=cv).mean()
    rf = cross_val_score(RandomForestClassifier(n_estimators=300, random_state=SEED, n_jobs=-1), X, y, cv=cv).mean()
    print(f"genre accuracy  baseline {baseline:.3f}  logistic {lr:.3f}  random forest {rf:.3f}")

    z = pd.DataFrame(X, columns=FEATURES).assign(genre=y).groupby("genre").mean().round(2)
    print("mean z-score per genre:")
    print(z.to_string())


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
