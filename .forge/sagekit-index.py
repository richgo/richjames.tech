"""Export and verify the pinned qualification corpus as a native FAISS index."""

import argparse
from dataclasses import asdict
from hashlib import file_digest
import json
from pathlib import Path

import faiss
import numpy as np

from sagekit.application import Principal
from sagekit.config import create_application


def pinned_vectors(corpus, pin_path):
    pin = json.loads(pin_path.read_text(encoding="utf-8"))["pin"]
    app = create_application(corpus)
    principal = Principal()
    snapshot = app.snapshot(principal)
    if any(snapshot[key] != pin[key] for key in ("revision", "embedding_profile")):
        raise ValueError("corpus revision or embedding profile differs from the SageKit pin")

    records = app.list(principal, revision=snapshot["revision"])
    ids = sorted(record["id"] for record in records)
    rows = app.search.vectors.load(set(ids))
    if not ids or set(rows) != set(ids):
        raise ValueError("the pinned corpus must have a stored vector for every record")

    profile = app.search.embedder.profile
    metadata = {
        **snapshot,
        "profile": {**asdict(profile), "fields": list(profile.fields)},
        "metric": "inner_product",
        "record_ids": ids,
    }
    return metadata, np.asarray([rows[key] for key in ids], dtype=np.float32)


def sha256(path):
    with path.open("rb") as stream:
        return file_digest(stream, "sha256").hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("write", "verify"))
    parser.add_argument("corpus", type=Path)
    parser.add_argument("pin", type=Path)
    parser.add_argument("artifact", type=Path)
    args = parser.parse_args()

    expected, vectors = pinned_vectors(args.corpus, args.pin)
    count, dimensions = vectors.shape
    index_path = args.artifact / "index.faiss"
    metadata_path = args.artifact / "index.json"

    if args.action == "write":
        args.artifact.mkdir(parents=True, exist_ok=True)
        index = faiss.IndexFlatIP(dimensions)
        index.add(vectors)
        faiss.write_index(index, str(index_path))
        metadata_path.write_text(
            json.dumps({**expected, "index_sha256": sha256(index_path)}, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {count} vectors x {dimensions} dimensions to {index_path}")
        return

    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    if metadata != {**expected, "index_sha256": sha256(index_path)}:
        raise ValueError("FAISS metadata or index checksum differs from the pinned corpus")
    index = faiss.read_index(str(index_path))
    if (not isinstance(index, faiss.IndexFlatIP) or index.d != dimensions
            or index.ntotal != count or index.metric_type != faiss.METRIC_INNER_PRODUCT):
        raise ValueError("FAISS index type, dimensions, row count or metric is incorrect")
    if not np.array_equal(index.reconstruct_n(0, count), vectors):
        raise ValueError("FAISS rows differ from the stored vectors in record ID order")
    scores, positions = index.search(vectors, 1)
    if not np.all((0 <= positions) & (positions < count)) or not np.allclose(
        scores, 1.0, rtol=0, atol=1e-5
    ):
        raise ValueError("FAISS search failed to retrieve the stored vectors")
    print(f"Verified FAISS readback and search for {count} vectors x {dimensions} dimensions")


if __name__ == "__main__":
    main()
