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

## OpenSpec 2.0 brownfield reference

The [OpenSpec change](../openspec/changes/qualify-github-activity/proposal.md)
maps the four criteria for STORY-005 to named scenarios through
[the reviewed binding](../.forge/openspec.json). The product requirements and
request retain the existing epic, feature and story IDs. The
[LikeC4 projection](../architecture/site.c4) and the CALM model reference the
same website, browser and public GitHub API.

On 13 November 2026, OpenSpec 2.0.0 validated the change in strict mode and
the ForgeKit preflight emitted the binding and artifact SHA-256 digests.
On the current brownfield baseline `d05341d7a6dfd72d5e74bb095da399d49240fa77`,
the production build generated 106 pages, the three mapper tests and nine
Chromium tests passed, and strict CALM validation reported zero errors or
warnings. Type checking and lint succeeded, with one existing unused
argument warning in `lambda/hello.js`. LikeC4 1.60.0 validated the generated view.

The historical [repair](https://github.com/richgo/richjames.tech/actions/runs/43289300673)
and [initial delivery](https://github.com/richgo/richjames.tech/actions/runs/43287110009)
were independently re-verified against their pinned signer workflow, source
commits and tags. Both the SLSA verification summary and the APMX in-toto
receipt bundle matched the delivered files. The signed SageKit release
artifacts matched each receipt. The [website acceptance run](https://github.com/richgo/richjames.tech/actions/runs/43310965905)
also carried verified browser, CALM and source attestations.

The repair delivered two files under the independently replayed receipt
`b8fc676b7b5b1af17561a003233081375930f3dccb91e9cb4a12c6eb61886f82`.
Reconstruct a source patch by copying the two attested delivery files over
the reviewed source at `efbae4a35f9acc3a6260910fbac3af647318c883` and
exporting `git diff`. Use the unchanged reviewed source with the patch as
input to the protected checker.

```bash
./.forge/verify-change /path/to/changes.diff \
  activity.fallback activity.links activity.render site.qualification
```

The checker applied the patch to a disposable copy and repeated the
production build, strict CALM validation, three mapper tests and nine browser
tests. This reference repeats the earlier signed run and adds local OpenSpec
qualification. The hosted runs used the earlier ForgeKit revision and skipped
their publication step.
