"""Build an isolated SageKit corpus from this qualification's reviewed inputs."""

import os
from pathlib import Path
import sys

from sagekit.application import Principal
from sagekit.config import create_application

application = create_application(Path(sys.argv[1]))
writer = Principal(scopes=frozenset({"write"}))
repository = os.environ["GITHUB_REPOSITORY"]
revision = os.environ["GITHUB_SHA"]
for file in ("request.md", "product-requirements.md", "architecture/README.md"):
    application.add(writer, {
        "kind": "adr",
        "title": f"GitHub activity qualification: {file}",
        "body": Path(file).read_text(encoding="utf-8"),
        "source": {
            "uri": f"https://github.com/{repository}/blob/{revision}/{file}",
            "revision": revision,
        },
    })
