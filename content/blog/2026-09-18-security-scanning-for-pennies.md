---
templateKey: blog-post
title: "Security Scanning for Pennies with Jev: The Missing Middle Between Regex and Reasoning Models"
date: 2026-09-18T19:40:00.000Z
description: >-
  SAST tools are cheap to run, but context is where things get awkward. Reasoning models can help, at a price. There's a third option: deterministic orchestration around narrow, probabilistic judgements — with a token bill measured in pennies rather than a conversation with finance.
featuredpost: true
featuredimage: /img/security-scanning-for-pennies.jpg
featuredimagealt: "Nice knowing you SAST: a dinosaur faces a small robot introducing TypeSafe security scanning."
tags:
  - AI
  - Security
  - AppSec
  - DevSecOps
  - TypeSafe
  - OWASP
  - LLM
  - SoftwareDevelopment
---

Application security tooling seems to have settled into two camps. Both are useful. Neither is quite what I wanted.

On one side: conventional scanners — SAST, DAST, SCA — that can be fast, reproducible, and dirt cheap to *run*, but vary in how much context they capture. On the other: pointing a frontier reasoning model at your codebase and asking it to "review this for security issues" — which can reason about intent, but costs real money per file and produces an answer that's harder to audit or reproduce.

I spent the last few hours building [`typesafe-security-review`](https://github.com/open-sdlc/typesafe-security-review), a scanner built on [TypeSafe](https://typesafe.ai)'s System One models, [CodeGraph](https://github.com/colbymchenry/codegraph), and the OWASP Cheat Sheet Series + CWE definitions. Here's why the architecture landed where it did.

## The Left: Deterministic Tools

Semgrep, Checkmarx, Fortify, SonarQube, Snyk's SCA engine — different tools doing different jobs, but rules and known patterns do much of the heavy lifting. That might mean an AST shape, a data-flow rule, or a known-CVE version range. It's rather more sophisticated than grep with a logo, to be fair.

This is genuinely valuable. It's fast. It's auditable — you can point at the exact rule that fired. It costs almost nothing per scan once the ruleset exists.

The catch is *building and maintaining the ruleset*. Every new framework, every new idiom, every "actually that sink is safe because it's wrapped three functions up" exception needs to be accounted for. Better tools can follow data flow and recognise sanitisers, but application-specific context still takes work. That's part of why SAST output can drown real findings in noise, and why enterprise licences can cost rather more than the compute. You're paying for rule-authoring labour, maintenance and support, not just CPU cycles.

## The Right: Point an LLM at Everything

The obvious counter-move, once agentic coding tools got good, was to skip rules entirely: paste the diff, or the whole repo, into a frontier reasoning model and ask "what's wrong with this, security-wise?"

This actually works, in the sense that a strong reasoning model *can* catch things a regex never could — a business-logic race condition, an authorisation check that's technically present but checks the wrong field, a prompt injection vector that only exists because of how two features interact. That's useful reasoning about context, not just pattern matching.

But you're paying full reasoning-model rates — extended thinking, large context windows, free-form output — for every file, every PR, every run. It's slow enough that "scan on every commit" becomes a budget conversation. And the output is prose: two runs on the identical diff can disagree, there's no calibrated confidence to threshold on, and "why did it flag this" means re-reading a paragraph of reasoning rather than pointing at a rule ID. You can tame this process with skills and subagents, as I tried to demonstrate with security review that maps to OWASP cheatsheats in the [Skills Bank Security plugin](https://github.com/open-sdlc/skills-bank/tree/main/plugins/skills-bank-security). Whilst this approach works, it often costs north of $10 per full repository scan.

Neither side is daft. They're just optimised for different trade-offs: repeatable checks on one side, broader reasoning on the other. I wanted something in between, preferably without another procurement meeting.

## The Middle: Deterministic Orchestration, Probabilistic Judgement

TypeSafe's model class is called **System One**. It's a Kahneman reference — System 1 is fast, intuitive judgement; System 2 is slow, deliberate reasoning. Loosely speaking, a SAST rule is System 0: follow the rule, no deliberation required. A reasoning model doing a security review is System 2: deliberate, and priced accordingly. What I wanted was System 1 for code — fast, calibrated, *narrow* judgement, cheap enough to run constantly.

Here's what that looks like assembled end to end, using `typesafe-security-review` as the concrete example:

![Vertical scanning flow: repository to deterministic local CodeGraph indexing and file selection, probabilistic TypeSafe relevance routing, code-owned classifier selection, probabilistic OWASP and CWE Noul checks via Jev, independent 0-1 category probabilities, then code-owned thresholds and reporting.](/img/security-scanning-pipeline.png)

The diagram shows the default routed path, repeated for each selected file. CodeGraph stays local; the router and selected classifiers receive the file's text, not the graph itself. Gold boxes mark probabilistic model calls and their output, while blue-grey boxes mark inputs and deterministic code. Routing is a model judgement too: code applies a relevance threshold to choose which classifiers run, then a separate reporting threshold to their category probabilities.

Each [Noul](https://docs.typesafe.ai/primitives/noul) value is an independent probability that the answer to its yes/no question is **yes**. It is not a severity score or an overall confidence rating, and the category probabilities do not need to sum to one. Human or deeper reasoning-model review would be an **optional next layer**, not an implemented step in this pipeline.

**1. CodeGraph finds the code — deterministically, with no model bill.** Before any AI call happens, [CodeGraph](https://github.com/colbymchenry/codegraph) indexes the repo locally and enumerates actual functions, methods, classes, and routes. Local compute, no model tokens. This is the same category of work a SAST tool's file-discovery step does — and it should stay deterministic. We don't need a neural network to decide whether we've found a Java file.

**2. The taxonomy is deterministic too — it's OWASP and CWE, not the model's opinion.** Every one of the 131 classifiers in the project is grounded in a specific OWASP Cheat Sheet or a specific CWE definition, with categories quoting that source's actual language. The model isn't inventing what "insecure deserialisation" means on the fly — it's answering a narrow question against an industry-vetted definition. The criterion is explicit, as it is with a rule-based tool; the judgement against it is still probabilistic.

**3. Routing prunes the search space before spending tokens on detailed checks.** A router asks one cheap question per classifier — "does this cheat sheet even apply to this file?" — in a single parallel call, and only the classifiers that clear a relevance threshold actually run. The aim is not to waste calls on Django or Laravel classifiers when scanning a `.java` file. In practice this prunes ~131 candidate classifiers down to somewhere around 15–20 relevant ones per file.

**4. The probabilistic judgement stays narrow.** Each classifier fires a batch of independent [Noul](https://docs.typesafe.ai/primitives/noul) questions — "does this look like a hardcoded credential?", "does this look like unchecked deserialisation of untrusted input?" — against a single file's text, all in one parallel call, and gets back a calibrated 0–1 probability per category. Not a paragraph. Not a chain of thought. A typed number your code can apply a threshold to, without first having to mark an essay.

Every layer that *can* be deterministic, is. The model handles the narrow judgements about relevance and potential vulnerabilities. The code handles what happens next.

## Doing the Actual Maths

TypeSafe's current model, Jev, is priced at [$0.042 per million input tokens, with output free](https://docs.typesafe.ai/models). That number is what makes "pennies" a literal claim rather than a headline.

A single classifier call packs one file's text plus roughly half a dozen category questions into one request — call it 2,000–4,000 tokens for a typical source file. At around 3,000 tokens each, running all 131 classifiers unrouted uses roughly 393,000 tokens: **about 1.65 US cents** for the project's OWASP+CWE classifier set against a single file. Turn routing on, and 15–20 classifiers at that size come to **roughly 0.19–0.25 US cents per file**, plus the router call. That's token arithmetic, not an end-to-end benchmark; file sizes, routing and concurrency all matter.

That's a small enough token bill to make frequent scanning interesting. It isn't a like-for-like comparison with an enterprise licence, though, and cheaper inference doesn't automatically mean fewer false positives. Coverage and triage time still need measuring. The spreadsheet is encouraging; it isn't a security assessment.

## What This Doesn't Solve

This isn't a case for throwing away deterministic scanners. CodeGraph's file discovery is deterministic; the router's relevance check is a model judgement, and it can be wrong. Nor do narrow, calibrated judgements replace deep reasoning: a genuinely novel, multi-step business-logic exploit chain still deserves a reasoning model and a human having a proper look. Escalating uncertain or high-stakes findings is a sensible next layer, but it won't catch something the first pass missed entirely.

The point is narrower and, I think, more useful: a useful first pass at security scanning — "does this look like X" against a well-defined taxonomy, at repo scale, on every commit — needn't pay for deep reasoning on every file. A fast, cheap, typed judgement, wired up by deterministic code, is worth trying. Keep the proven checks, spend the reasoning budget where it helps, and measure what gets missed. Less grand unifying theory, more sensible plumbing.

---

*Code, all 131 classifiers, the router, and the full-repo scanner (including cloning and indexing a remote git URL with CodeGraph before scanning it) are at [github.com/open-sdlc/typesafe-security-review](https://github.com/open-sdlc/typesafe-security-review). Pricing and model details are TypeSafe's own published numbers, linked inline — worth checking directly before you build a budget around them, since rate limits and pricing are both explicitly called out as subject to change while the platform scales.*
