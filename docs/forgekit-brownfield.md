# ForgeKit brownfield qualification — richjames.tech

## Observed source architecture

The source inventory is recorded in [architecture/README.md](../architecture/README.md)
and its machine-readable [CALM model](../architecture/site.calm.json).
The reverse-engineered product inventory and stable acceptance criteria
are in [product-requirements.md](../product-requirements.md).
These are reviewed inputs, not agent-generated acceptance oracles.

## Change

STORY-005 adds a visible public GitHub activity panel to the homepage,
using GitHub's public Events API. The integration is intentionally
read-only and requires no token. Unsupported, malformed or unsafe data
is discarded, and the UI has a graceful failure state.

A LinkedIn feed would require authorized API access or manual exports;
the public GitHub API exercises the third-party integration and visible
UI without scraping or storing personal access tokens.

## ForgeKit installation and qualification

- The project has the ForgeKit contract inputs
  `product-requirements.md`, `request.md`, and `.forge/verify-change`.
- `.github/workflows/forgekit.yml` calls the pinned reusable ForgeKit
  APMX workflow. A configured `COPILOT_GITHUB_TOKEN` secret is required.
- `.github/workflows/forgekit-brownfield-qualification.yml` runs the
  independent application acceptance and CALM validation.
- `npm ci` installs the website dependencies. APMX and the factory skills
  are resolved by the pinned hosted factory when it actually runs.

The ForgeKit initialization CLI cannot overwrite authored, reviewed
requirements and verifier inputs. Do not run `forgekit init` over these
files. The files follow its consumer interface and are installed in this
branch; a successful hosted APMX run is still required to demonstrate
end-to-end factory execution.

## Evidence required before declaring the goal complete

1. Validate the CALM JSON with the pinned FINOS CLI and review it against
   source and deployment evidence.
2. Run clean-room `npm ci`, typecheck, lint, tests and production build.
3. Dispatch the hosted ForgeKit workflow and inspect agent-generated
   patch, independent replay, signed attestation and source revision.
4. Review/merge the resulting feature and verify it visibly on the live
   site, including third-party failure behavior.
5. Record the deployed digest, observation and rollback readiness.

Do not claim a signed factory run or a live deployment based solely on
this source branch. The requested **Sage Kit** package is not identified
by a verified repository or package reference and has not been installed.
