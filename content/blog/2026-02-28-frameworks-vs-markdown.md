---
templateKey: blog-post
title: "Frameworks vs Markdown: Why I Stopped Installing Agent Frameworks and Started Writing .md Files"
date: 2026-02-28T16:00:00.000Z
description: >-
  There's a gold rush in AI-assisted development frameworks. I tried several, then built aibank using nothing but flat Markdown files and GitHub Copilot agents. Here's what I learned.
featuredpost: true
featuredimage: /img/frameworks-vs-markdown.png
tags:
  - AI
  - Copilot
  - Markdown
  - AgentDevelopment
  - SoftwareDevelopment
  - OpenSpec
---

There's a gold rush happening in AI-assisted development. Every week brings a new framework promising to tame the chaos of coding with LLMs — structured workflows, specialized agents, phase gates, CLI tools, npm packages. I tried several of them. Then I built [aibank](https://github.com/richgo/aibank) using nothing but flat Markdown files and GitHub Copilot agents.

Here's what I learned.

## The Framework Landscape

If you've been paying attention, you've probably seen a few of these:

**[OpenSpec](https://github.com/Fission-AI/OpenSpec)** — Fission AI's spec-driven development framework. Install via npm, run `openspec init`, and you get slash commands like `/opsx:propose` and `/opsx:apply` that walk you through a proposal → specs → design → tasks → implementation workflow. It's well-thought-out, actively maintained, and works across 20+ AI assistants.

**[Spec Kit](https://github.com/github/spec-kit)** — GitHub's own take on spec-driven development. Python-based, installed via `uv`, with its own CLI (`specify`) and commands like `/speckit.constitution` and `/speckit.specify`. Thorough, but heavier on ceremony.

**[BMad Method](https://github.com/bmad-code-org/BMAD-METHOD)** — "Breakthrough Method for Agile AI-Driven Development." 12+ specialized agent personas (PM, Architect, Developer, UX, Scrum Master), 34+ workflows, a module ecosystem, and even a "Party Mode" for multi-agent collaboration. It's the maximalist option.

**[Kiro](https://kiro.dev)** — AWS's entry, tightly coupled to their IDE and limited to specific models.

These are all legitimate projects solving a real problem: AI coding assistants produce better results when requirements are structured upfront rather than living in chat history. On that, everyone agrees.

Where I diverge is on *how much infrastructure you need* to get there.

## What the Frameworks Actually Do

Strip away the CLIs, npm packages, slash commands, and module ecosystems, and every one of these frameworks is doing roughly the same thing:

1. **Define a workflow** — a sequence of steps from idea to implementation
2. **Create specialized prompts** — each step has a persona or role with specific instructions
3. **Produce artifacts** — Markdown files (proposals, specs, designs, task lists)
4. **Hand off between stages** — one agent's output becomes the next agent's input

That's it. The core mechanism in every case is: *give the LLM a well-structured Markdown prompt and let it produce a well-structured Markdown artifact.*

The frameworks wrap this in varying amounts of tooling. OpenSpec gives you an npm package and slash commands. BMad gives you 12 agent personas and a module system. Spec Kit gives you a Python CLI. But underneath, it's all `.md` files instructing an AI what to do.

## OpenSpec-Agents: Flattening the Framework

This realisation led me to build [OpenSpec-Agents](https://github.com/richgo/OpenSpec-Agents) — a set of GitHub Copilot custom agents that implement the OpenSpec workflow without any of the framework machinery.

No npm install. No CLI. No external dependencies. Just `.md` files in `.github/agents/`.

Each agent is a single Markdown file that defines:
- **Purpose** — what this step does
- **Tools** — what it can use (read, edit, search, execute)
- **Handoffs** — where to go next

The full workflow looks like this:

```
explore → new → proposal → specs → design → tasks → apply → verify → archive
```

Or the fast path:

```
new → ff → apply → archive
```

There's also `apply-tdd-only` for straight TDD without a BDD layer. Each agent presents handoff buttons at the end of its work, so you click through the flow without memorizing commands.

The key insight: **Copilot's custom agents are just Markdown files.** The `.github/agents/` directory *is* the framework. There's nothing to install, nothing to update, nothing to configure. You copy the directory into your repo and you're done.

## Building aibank: The Proof

[aibank](https://github.com/richgo/aibank) is a demo AI-powered banking app — a FastAPI backend serving banking data via REST, with a Flutter frontend rendering AI-generated UI using Google's A2UI standard and GenUI SDK. It integrates both an internal banking MCP server and an external map MCP server for merchant geocoding.

It's not a trivial project. It involves:
- Python agent orchestration (FastAPI + MCP)
- Flutter cross-platform UI with GenUI host rendering
- A2UI contract compliance
- MCP server integration (internal bank tools + external map server)
- Custom `mcp:AppFrame` catalog items for embedding MCP app UIs
- Platform-specific hosts (sandboxed iframes for web, WebView + JS shims for native)

I built this using the OpenSpec-Agents workflow. The entire development process was guided by Markdown files — no framework CLIs running in the background, no slash command parsers, no module registries. Just structured prompts handing off to each other.

The `openspec/` directory in the repo tells the whole story:

```
openspec/
├── specs/          # Living spec library
├── changes/
│   ├── feature-x/  # Active changes
│   │   ├── proposal.md
│   │   ├── specs/
│   │   ├── design.md
│   │   └── tasks.md
│   └── archive/    # Completed work
```

Every decision is documented. Every change has a paper trail. And the tooling that produced it all? Plain text.

## Why Markdown Wins

**Zero dependencies.** No package to install means nothing to break, nothing to version-conflict, nothing to keep updated. The agents work today and they'll work in a year because Markdown doesn't have breaking changes.

**Total transparency.** Every agent is a file you can read in 30 seconds. There's no abstraction layer hiding what prompts are actually being sent. When something doesn't work, you edit the `.md` file directly. No digging through source code of a framework you didn't write.

**Instant customization.** Want to change how the design phase works? Edit `design.md`. Want to add a security review step? Create `security-review.md` and add it to the handoff chain. The "API" is just prose.

**Portability.** The agents work in VS Code Copilot Chat, JetBrains Copilot Chat, and even GitHub's Copilot coding agent (handoffs are ignored but agents still function). If you switch tools tomorrow, the Markdown files come with you.

**No lock-in.** OpenSpec the npm package requires `openspec update` after upgrades, needs Node 20+, and ties you to their CLI. BMad Method requires Node 20+, has a module ecosystem, and pushes you toward their conventions. Markdown files require... a text editor.

## When Frameworks Make Sense

I'm not saying frameworks are useless. They're not. If you're:

- **Onboarding a large team** that needs guardrails and can't be trusted to edit agent prompts directly
- **Working in an enterprise** that requires consistent, auditable processes across many projects
- **New to spec-driven development** and want the guided experience of slash commands telling you what to do next

...then a framework like OpenSpec or BMad Method provides real value. The structure is the point.

But if you understand the workflow and you're comfortable with Markdown, the framework is overhead you don't need. The agents are the product. Everything else is packaging.

## The Takeaway

The best AI development frameworks are converging on the same insight: **structured Markdown artifacts make AI coding predictable.** They differ only in how much tooling they wrap around that insight.

OpenSpec-Agents strips it back to first principles. The workflow from OpenSpec, flattened into pure `.md` files, running as native Copilot agents. No install, no dependencies, no ceremony. Just structured prompts, clean handoffs, and Markdown all the way down.

The result? A non-trivial app (aibank) built with full spec discipline and zero framework dependencies.

Sometimes the best tool is no tool at all — just well-written instructions in a format that every editor, every AI, and every human already understands.

---

*[OpenSpec-Agents on GitHub](https://github.com/richgo/OpenSpec-Agents) · [aibank on GitHub](https://github.com/richgo/aibank)*
