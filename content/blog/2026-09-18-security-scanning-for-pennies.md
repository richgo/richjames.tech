---
templateKey: blog-post
title: "Security Scanning for Pennies: The Missing Middle Between Regex and Reasoning Models"
date: 2026-09-18T19:40:00.000Z
description: >-
  SAST tools are deterministic and cheap to run but blind to intent. Pointing a reasoning model at your whole repo understands intent but costs a fortune and can't be audited. There's a third option: deterministic orchestration around narrow, calibrated, probabilistic judgments — and it's roughly two orders of magnitude cheaper than either.
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

Application security tooling has quietly sorted itself into two camps, and both of them are wrong in opposite directions.

On one side: deterministic scanners — SAST, DAST, SCA — that are fast, reproducible, and dirt cheap to *run*, but understand nothing. On the other: pointing a frontier reasoning model at your codebase and asking it to "review this for security issues" — which understands plenty, but costs real money per file and produces an answer you can't fully audit or reproduce.

I spent the last few weeks building [`typesafe-security-review`](https://github.com/open-sdlc/typesafe-security-review), a scanner built on [TypeSafe](https://typesafe.ai)'s System One models, [CodeGraph](https://github.com/colbymchenry/codegraph), and the OWASP Cheat Sheet Series + CWE definitions. The point of this post isn't to sell you on a specific repo — it's to walk through *why* the architecture landed where it did, because the gap it fills is bigger than one project.

## The Left: Deterministic Tools

Semgrep, Checkmarx, Fortify, SonarQube, Snyk's SCA engine — these are rule engines. Somebody wrote a pattern (a regex, an AST shape, a known-CVE version range), and the tool tells you, with total reproducibility, whether that pattern exists in your code.

This is genuinely valuable. It's fast. It's auditable — you can point at the exact rule that fired. It costs almost nothing per scan once the ruleset exists.

The catch is *building and maintaining the ruleset*. Every new framework, every new idiom, every "actually that sink is safe because it's wrapped three functions up" exception is a rule someone has to write and keep current. The tools have no model of intent — they can't tell the difference between `os.system(user_input)` in a toy script and the same line behind five layers of allowlisting. That's why SAST output is famous for drowning real findings in noise, and why the *tools themselves* — despite running for pennies of compute — carry six- and seven-figure enterprise licensing costs, because the actual product being sold is the accumulated rule-authoring labor, not the CPU cycles.

## The Right: Point an LLM at Everything

The obvious counter-move, once agentic coding tools got good, was to skip rules entirely: paste the diff, or the whole repo, into a frontier reasoning model and ask "what's wrong with this, security-wise?"

This actually works, in the sense that a strong reasoning model *will* catch things a regex never could — a business-logic race condition, an authorization check that's technically present but checks the wrong field, a prompt injection vector that only exists because of how two features compose. That's real semantic understanding, not pattern matching.

But you're paying full reasoning-model rates — extended thinking, large context windows, free-form output — for every file, every PR, every run. It's slow enough that "scan on every commit" becomes a budget conversation. And the output is prose: two runs on the identical diff can disagree, there's no calibrated confidence to threshold on, and "why did it flag this" means re-reading a paragraph of reasoning rather than pointing at a rule ID.

Neither side is dumb. They're just optimized for different failure modes — the left avoids cost and false negatives on rules; the right avoids blindness to intent. Nobody has cheaply optimized for *both*.

## The Middle: Deterministic Orchestration, Probabilistic Judgment

TypeSafe's whole pitch is right there in the name of the model class: **System One**. It's a Kahneman reference — System 1 is fast, intuitive judgment; System 2 is slow, deliberate reasoning. A SAST rule is System 0: no judgment at all, just matching. A reasoning model doing a security review is System 2: genuinely deliberate, genuinely expensive. What's been missing is System 1 for code — fast, calibrated, *narrow* judgment, cheap enough to run constantly.

Here's what that looks like assembled end to end, using `typesafe-security-review` as the concrete example:

**1. CodeGraph decides what's worth looking at — deterministically, for free.** Before any AI call happens, [CodeGraph](https://github.com/colbymchenry/codegraph) indexes the repo locally and enumerates actual functions, methods, classes, and routes. No API key, no network call, no cost. This is the same category of work a SAST tool's file-discovery step does — and it should stay deterministic, because "is this a source file worth scanning" isn't a judgment call, it's a fact.

**2. The taxonomy is deterministic too — it's OWASP and CWE, not the model's opinion.** Every one of the 131 classifiers in the project is grounded in a specific OWASP Cheat Sheet or a specific CWE definition, with categories quoting that source's actual language. The model isn't inventing what "insecure deserialization" means on the fly — it's answering a narrow question against an industry-vetted definition. That's the same rigor a rule-based tool has, just expressed as a natural-language criterion instead of a regex.

**3. Routing prunes the search space before spending a token on the real judgment.** A router asks one cheap question per classifier — "does this cheat sheet even apply to this file?" — in a single parallel call, and only the classifiers that clear a relevance threshold actually run. Scanning a `.java` file doesn't waste a call on the Django or Laravel classifiers. In practice this prunes ~131 candidate classifiers down to somewhere around 15–20 relevant ones per file.

**4. The probabilistic judgment is as narrow as it can possibly be.** Each classifier fires a batch of independent [Noul](https://docs.typesafe.ai/primitives/noul) questions — "does this look like a hardcoded credential," "does this look like unchecked deserialization of untrusted input" — against a single file's text, all in one parallel call, and gets back a calibrated 0–1 probability per category. Not a paragraph. Not a chain of thought. A typed, thresholdable number your code can act on directly.

Every layer that *can* be deterministic, is. The only thing asked of the probabilistic model is the one thing regexes can't do: recognizing intent in natural language and code, against a well-specified question, at System-1 speed.

## Doing the Actual Math

TypeSafe's current model, Jev, is priced at [$0.042 per million input tokens, with output free](https://docs.typesafe.ai/models). That number is what makes "pennies" a literal claim rather than a headline.

A single classifier call packs one file's text plus roughly half a dozen category questions into one request — call it 2,000–4,000 tokens for a typical source file. Run all 131 classifiers unrouted against one file and you're moving somewhere around 350,000–400,000 tokens, which prices out to **roughly 1.5–2 cents** for the whole OWASP+CWE canon against a single file. Turn routing on, and a typical file only needs its ~15–20 relevant classifiers — dropping that to **a few tenths of a cent per file**, at sub-second latency, because Jev evaluates a state and its questions in one parallel pass rather than a serial reasoning trace.

Compare that to per-seat or per-scan pricing on enterprise SAST/DAST platforms, or to per-file costs of routing a reasoning model through extended thinking on every commit — and the gap isn't small, it's an order-of-magnitude-or-two gap, before you even count the analyst hours saved from *not* triaging rule-engine false positives.

## What This Doesn't Solve

This isn't a case for throwing away deterministic scanners — CodeGraph's file discovery and the router's relevance check *are* deterministic scanners, just aimed inward at the pipeline instead of outward at your code. It's also not a case that narrow calibrated judgments replace deep reasoning entirely: a genuinely novel, multi-step business-logic exploit chain is still System 2's job, and the sane move is to route only the low-confidence or high-stakes findings up to a reasoning model for a second look, rather than paying reasoning-model rates on every file, every time.

The point is narrower and, I think, more useful: most of what security scanning actually needs — "does this look like X" against a well-defined taxonomy, at repo scale, on every commit — was never a job that required a slow, expensive, unauditable reasoning trace. It just needed a fast, cheap, typed judgment, wired up by deterministic code. That's the middle nobody was building, and it's why this approach can plausibly undercut both the rule-vendor's license fee and the token bill from pointing GPT at your whole repo — for the same, or better, coverage.

---

*Code, all 131 classifiers, the router, and the full-repo scanner (including cloning and indexing a remote git URL with CodeGraph before scanning it) are at [github.com/open-sdlc/typesafe-security-review](https://github.com/open-sdlc/typesafe-security-review). Pricing and model details are TypeSafe's own published numbers, linked inline — worth checking directly before you build a budget around them, since rate limits and pricing are both explicitly called out as subject to change while the platform scales.*
