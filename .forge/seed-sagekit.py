"""Build an isolated SageKit corpus from this qualification's reviewed inputs."""

import os
from pathlib import Path
from subprocess import check_output
import sys

from sagekit.application import Principal
from sagekit.config import create_application

application = create_application(Path(sys.argv[1]))
writer = Principal(scopes=frozenset({"write"}))
repository = os.getenv("GITHUB_REPOSITORY", "richgo/richjames.tech")
for file in ("request.md", "product-requirements.md", "architecture/README.md"):
    body = Path(file).read_text(encoding="utf-8")
    # A blob identifies the source content across checkout and merge commits.
    revision = check_output(["git", "hash-object", "--stdin"], input=body.encode()).decode().strip()
    application.add(writer, {
        "kind": "adr",
        "title": f"GitHub activity qualification: {file}",
        "body": body,
        "source": {
            "uri": f"https://api.github.com/repos/{repository}/git/blobs/{revision}",
            "revision": revision,
        },
    })
