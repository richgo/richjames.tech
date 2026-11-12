"""Check the configured TypeSafe provider without making a release decision."""

import json
from pathlib import Path
import sys

from sagekit.application import Principal
from sagekit.config import create_application

corpus, pin_file, output = map(Path, sys.argv[1:])
pin = json.loads(pin_file.read_text(encoding="utf-8"))["pin"]
application = create_application(corpus)
result = application.decide(Principal(scopes=frozenset({"decide"})), {
    "kind": "choice",
    "instructions": "Determine whether the GitHub activity requirements specify a fallback when the public feed fails. This is a provider probe.",
    "state": "The referenced requirements are the reviewed source for this probe.",
    "criteria": {
        "fallback-required": "The requirements explicitly specify a fallback.",
        "fallback-unspecified": "The requirements do not specify a fallback.",
    },
}, pin["revision"])
output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
if result["status"] != "answered" or result.get("provider") != "jev":
    raise SystemExit("TypeSafe did not return a valid typed SageKit answer")
if result["value"] != "fallback-required":
    raise SystemExit("The typed answer did not match the reviewed fallback requirement")
