# ForgeKit brownfield qualification

The approved baseline uses the [source-derived CALM model](../architecture/site.calm.json),
the [product requirements](../product-requirements.md) and the [STORY-005 request](../request.md).
The reviewed checker runs type checking, lint, mapper tests, a production build,
strict FINOS CALM validation and Chromium acceptance in a separate candidate tree.

SageKit is ForgeKit's decision layer. The qualification uses a disposable
SageKit corpus seeded with public evidence from the reviewed commit. The
requirements gate pins the corpus, policy and approved input hashes before
the agent runs. The release gate checks the independently replayed APMX
receipt digest and asks SageKit for a typed recommendation through TypeSafe
System One. A human reviews the recommendation and the signed source patch.

The reviewed tag triggers the pinned ForgeKit APMX workflow. Copilot receives
`COPILOT_GITHUB_TOKEN` in the producer job. The SageKit release job maps
`FORGE_JEV_TOKEN` to SageKit's `TYPESAFE_API_KEY` for that step only.
Use the checked-in request with the pinned native software-factory skills.
The preexisting draft is preserved in the PR's first commit. The tagged
qualification input starts from the website without the proposed activity
implementation so the patch can be attributed to the producer.

Review the APMX receipt, delivery, GitHub attestations and SageKit gate
artifacts from the same run. Check the signer, source tag and commit,
receipt digest, patch scope and AC-005 through AC-008 before accepting the
delivery. The PR's independent browser suite also covers AC-001 through AC-004.

The live public site returned HTTP 200 from Netlify during source inventory.
Azure's legacy preview workflows failed before deployment. A verified
delivery still needs an authorized Netlify release and a live observation.

## Hosted qualification on 12 November 2026

| Input tag | Hosted run | Result |
| --- | --- | --- |
| `forgekit-brownfield-proof-5` | [Original run and retry](https://github.com/richgo/richjames.tech/actions/runs/43273964054) | Quota initially blocked Copilot. The retry passed planning and specification and exposed the native exporter’s bracketed-route failure. |
| `forgekit-brownfield-proof-6` | [Initial signed delivery](https://github.com/richgo/richjames.tech/actions/runs/43287110009) | Copilot, independent replay, APMX signatures and the receipt-bound SageKit release decision passed. |
| `forgekit-brownfield-proof-7` | [Signed repair](https://github.com/richgo/richjames.tech/actions/runs/43289300673) | Copilot repaired the current PushEvent label, request timeout and URL validation. The independent replay and both signing stages passed. |

The checked-in implementation takes `src/app/HomeClient.tsx` from the
initial delivery and both activity modules from the repair delivery.
The verifier restores four tracked Next.js route files from the exact
reviewed checkout when APMX 0.8.0 excludes their bracketed paths from its
export inventory. These routes remain part of the production build and
independent browser acceptance.

Production promotion remains subject to human review. The pull request
and its Netlify Deploy Preview carry the candidate for that review.
