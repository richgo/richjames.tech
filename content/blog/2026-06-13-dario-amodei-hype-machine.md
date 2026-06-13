---
templateKey: blog-post
title: "The Dario Amodei Hype Machine: Mythos, Fable, and the Smell of an IPO"
date: 2026-06-13T08:00:00.000Z
description: >-
  Anthropic promised the world a mythological AI overlord. What they delivered was a model that beat GPT-5.5 by a single point — then got banned by the US government three days later. Is this product development, or pre-IPO theatre?
featuredpost: true
featuredimage: /img/dario-hype-machine.png
tags:
  - AI
  - Anthropic
  - Claude
  - LLM
  - IPO
  - Benchmarks
  - Opinion
---

There's an old saying in Silicon Valley: *if you can't ship it, at least name it something terrifying*. Anthropic, the safety-focused AI lab run by Dario Amodei, has elevated this principle to an art form.

Let's talk about the last six months of Claude releases, the benchmarks, the government drama, and whether any of this was ever really about the technology.

---

## Act I: Mythos — The Model Nobody Got to Actually Use

It started in March 2026 with a leak. A configuration error exposed thousands of internal Anthropic documents, including draft marketing copy for a new model ominously named **Claude Mythos**. The copy described a system of near-apocalyptic capability — a model so powerful it could discover *thousands* of zero-day vulnerabilities across major operating systems. The internet duly lost its mind.

[Spiceworks](https://www.spiceworks.com/ai/anthropics-claude-mythos-breakthrough-or-hype-machine/) broke down what the hype actually obscured: the "thousands of zero-days" figure came not from Anthropic's peer-reviewed research but from its **marketing page for Project Glasswing**. When analysts dug into the 244-page technical System Card, that scary number was nowhere to be found. The actual methodology? Human contractors manually reviewed *198* vulnerability reports. Anthropic then extrapolated the 90% agreement rate across the model's entire raw output and called it confirmed critical flaws. That's not science. That's a press release wearing a lab coat.

The Firefox exploit that made the headlines? Mythos wasn't attacking a real Firefox installation. It was attacking a SpiderMonkey JavaScript shell **inside a container**, with the process sandbox and standard browser defences entirely stripped away. It's a bit like claiming your new car does 200mph — in neutral, being towed downhill.

Mythos Preview was real. It was capable. The SWE-bench Verified score of 93.9% was legitimately impressive. But it was gated, restricted, and shrouded in Pentagon-adjacent mystique. Most developers never touched it.

---

## Act II: Fable — The "Mythos for the Rest of Us"

On June 9th, 2026, Anthropic launched **Claude Fable 5** — described as "a Mythos-class model we've made safe for general use." The benchmark headlines were genuinely strong: 95.0% on SWE-bench Verified, 80.3% on SWE-bench Pro, state-of-the-art on FrontierCode, and an 11-point lead over the nearest competitor on that SWE-bench Pro score.

Sounds incredible. Until you look at who it was beating and by how much.

**SWE-bench Pro results (June 2026):**

| Model | SWE-Bench Pro |
|---|---|
| Claude Fable 5 | 80.3% |
| Claude Opus 4.8 | 69.2% |
| **GPT-5.5** | **58.6%** |
| Gemini 3.1 Pro | 54.2% |

*(Source: [claude5.ai benchmark analysis](https://claude5.ai/en/news/claude-fable-5-benchmarks-swe-bench-pro-80-percent), Anthropic launch data)*

For the real-world coding agent race — the one developers actually care about — check [Artificial Analysis's Coding Agent Leaderboard](https://artificialanalysis.ai/agents/coding-agents), where the picture gets more nuanced under standardised harnesses.

**But here's the thing.** According to [vals.ai's SWE-bench Verified leaderboard](https://www.vals.ai/benchmarks/swebench), GPT-5.5 sits at **82.6%** on SWE-bench Verified — the same benchmark. Fable 5 scores 95.0%. That's a real gap. But Fable 5 is using a `compute_effort: max` setting. GPT-5.5 is running at `reasoning_effort: xhigh`.

Translation: Anthropic is essentially running its engine at **twice the compute burn** and charging you accordingly. Input: $10/MTok, Output: $50/MTok. Compare that to Opus 4.8 at $5/$25.

---

## The V8 Problem: More Cylinders Isn't Engineering

There's a reason the automotive world moved on from the 6.2-litre naturally aspirated V8 as a performance benchmark. Yes, you can make anything fast if you throw enough displacement at it. But a turbocharged four-pot that extracts the same power while using half the fuel? *That's* engineering. That's elegance.

What Anthropic appears to have done with Fable 5 is the AI equivalent of boring out a V8 and calling it a revolution. The model — widely speculated to be architecturally identical to Opus 4.8 with inference compute roughly doubled — delivers meaningfully better results on long-horizon tasks. But at **double the inference time and double the cost**.

The [morphllm benchmark breakdown](https://www.morphllm.com/claude-benchmarks) is pretty clear: Claude Opus 4.8 scores 88.6% on SWE-bench Verified at $5/$25. Fable 5 gets to 95.0% at $10/$50, using `compute_effort: max`. That 6.4 percentage point improvement costs you 100% more money per token.

A Chevy Camaro ZL1 will beat a hybrid on a drag strip too. That doesn't mean it's a better car.

The truly elegant result would be: *same compute, meaningfully better output*. What Fable delivers is: *better output, proportionally more compute*. That's not a breakthrough. That's a dial turned up.

---

## Act III: The Government Kills the Party (Three Days Later)

This is where the story tips from mildly embarrassing to genuinely extraordinary.

Three days after the triumphant launch of Fable 5 and Mythos 5, Anthropic was forced to publish [this statement](https://www.anthropic.com/news/fable-mythos-access):

> *"The US government, citing national security authorities, has issued an export control directive to suspend all access to Fable 5 and Mythos 5 by any foreign national, whether inside or outside the United States, including foreign national Anthropic employees."*

Let that sink in. **Foreign national Anthropic employees** couldn't use the model they'd just launched. Every API customer outside the United States — gone. All of them, including the UK, Europe, Asia — cut off within 72 hours of launch.

Anthropic's response was admirably defiant. They pointed out, correctly, that the "jailbreak" the government had been shown was essentially asking the model to read a codebase and fix security flaws — the kind of thing developers do every day. They noted that GPT-5.5 [can do the same thing](https://deploymentsafety.openai.com/gpt-5-5/cybersecurity). They argued the safeguards were working.

None of this changed the outcome. The model that was supposed to be available to "as many users as possible, as quickly as we can" was unavailable to most of the world's developers before the launch week was even over.

For a company that had spent months cultivating an air of frontier inevitability, this was a spectacular face-plant. You can't be the future of global AI infrastructure if a government directive can pull the plug on your flagship model because of a "verbal demonstration" of a known vulnerability class.

---

## What Is Fable 5, Really?

Let's be direct about the hypothesis that's circulating in developer circles: **Fable 5 is Opus 4.8 with the compute knob turned to max**.

Anthropic's own launch post is illuminating: "For a small group of cyberdefenders and infrastructure providers, we're also launching Claude Mythos 5. It's the same underlying model as Fable 5, but with the safeguards lifted in some areas."

So Fable and Mythos are the same underlying model. And Mythos Preview — the earlier, "dangerous" version — scored 93.9% on SWE-bench Verified. Fable 5 scores 95.0%. One percentage point of separation.

Meanwhile, Opus 4.8 was quietly shipped on May 28th, two weeks before Fable's launch, at the same price as 4.7. It scores 88.6%.

The pricing structure tells a story:
- Opus 4.8: $5/$25 per MTok
- Fable 5: $10/$50 per MTok
- Fable 5 running at max compute effort on benchmarks

This is the engine theory made real. The improvement exists. It's real. But it's bought, not engineered. You're paying for GPU time, not for a fundamentally smarter architecture.

---

## "Safety-Focused" and US Government-Exclusive

Here's the irony that doesn't get enough airtime.

Anthropic positions itself as the safety-first, humanity-first AI lab. The company that took the responsible road. The adults in the room. Dario Amodei writes op-eds about existential risk. The company's Constitutional AI approach is genuinely interesting work.

And yet their most powerful models — Mythos 5 in particular — are gated behind US government contracts through **Project Glasswing**, unavailable to non-US developers, restricted to "approved cyberdefenders and infrastructure providers."

If your safety philosophy ends at the US border, it's not really a safety philosophy. It's a defence contractor relationship.

The UK, Europe, and the rest of the world built their entire development workflows around Claude because Anthropic sold them on the idea of a safer, more aligned AI partner. Then the US government issued a directive and every foreign developer found out in real time exactly how much sovereignty they have over the tools they depend on: none.

---

## The IPO Question

Let's end where this was probably always going.

Anthropic raised $7.3 billion at a $60 billion valuation in late 2024. Reports in early 2026 suggested IPO discussions were ongoing, with target valuations climbing past $100 billion.

Now look at the last six months through that lens:
- **Mythos Preview**: Launch wrapped in government mystique and apocalyptic security claims. Maximum attention.
- **Fable 5 + Mythos 5**: "State of the art on nearly all benchmarks." Benchmark screenshots everywhere. Massive press.
- **US government restriction**: Anthropic plays the heroic whistleblower, publishing a detailed defence of their work. More press.
- **SWE-bench domination narrative**: The leaderboard sweep of the top six positions — all Claude models — gets screenshotted and posted everywhere.

Is any of this bad? Not necessarily. Products need marketing. Milestones deserve celebration.

But when the model is architecturally suspect, the safety claims don't survive scrutiny, the benchmark lead evaporates when you normalise for compute cost, the flagship gets pulled by executive order before the launch confetti has settled, and the company's founder is giving speeches about AI existential risk while shipping dual-use models to government cyber units...

You have to ask the question: **Is this a product strategy, or is it a roadshow?**

Because if Anthropic is serious about being the safety-first AI lab for the world, it needs to do better than:

1. Hype a model nobody can use
2. Launch a compute-expensive increment as a breakthrough
3. Lose access to half the world within three days
4. Position the fallout as a principled stand

---

*The scoreboard is impressive. The engineering is real. But the story Anthropic is selling — frontier safety, global accessibility, genuine breakthrough architecture — doesn't match the evidence.*

*Maybe that's fine if you're raising money. It's not fine if you're building the infrastructure the world runs on.*

---

**Benchmarks via [Artificial Analysis Coding Agent Leaderboard](https://artificialanalysis.ai/agents/coding-agents) | [vals.ai SWE-bench](https://www.vals.ai/benchmarks/swebench) | [morphllm Claude Benchmarks](https://www.morphllm.com/claude-benchmarks)**
