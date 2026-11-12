"""Write or verify the repository FAISS index for a seeded qualification corpus."""

import argparse
from dataclasses import asdict
from hashlib import sha256
import json
from pathlib import Path

import faiss
import numpy as np

from sagekit.application import Principal
from sagekit.config import create_application


INDEX_DIRECTORY = Path(__file__).resolve().parent / "sagekit-index"


def corpus_vectors(corpus):
    app = create_application(corpus)
    principal = Principal()
    snapshot = app.snapshot(principal)

    records = sorted(app.list(principal, revision=snapshot["revision"]),
                     key=lambda record: record["id"])
    ids = [record["id"] for record in records]
    rows = app.search.vectors.load(set(ids))
    if not ids or set(rows) != set(ids):
        raise ValueError("the pinned corpus must have a stored vector for every record")

    profile = app.search.embedder.profile
    metadata = {
        **snapshot,
        "profile": {**asdict(profile), "fields": list(profile.fields)},
        "metric": "inner_product",
        "record_ids": ids,
        "sources": {record["id"]: record["source"] for record in records},
    }
    return metadata, np.asarray([rows[key] for key in ids], dtype=np.float32)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("write", "verify"))
    parser.add_argument("corpus", type=Path)
    args = parser.parse_args()

    metadata, vectors = corpus_vectors(args.corpus)
    count, dimensions = vectors.shape
    index_path = INDEX_DIRECTORY / "index.faiss"
    metadata_path = INDEX_DIRECTORY / "index.json"
    expected = faiss.IndexFlatIP(dimensions)
    expected.add(vectors)
    expected_bytes = faiss.serialize_index(expected).tobytes()
    metadata["index_sha256"] = sha256(expected_bytes).hexdigest()

    if args.action == "write":
        INDEX_DIRECTORY.mkdir(parents=True, exist_ok=True)
        index_path.write_bytes(expected_bytes)
        metadata_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {count} vectors x {dimensions} dimensions to {index_path}")
        return

    # Check against the locally built index before letting FAISS parse PR data.
    if (json.loads(metadata_path.read_text(encoding="utf-8")) != metadata
            or index_path.read_bytes() != expected_bytes):
        raise ValueError("the committed FAISS index is stale or corrupt, regenerate both index files")
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
