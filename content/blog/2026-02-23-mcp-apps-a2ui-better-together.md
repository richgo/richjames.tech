---
title: "MCP Apps vs A2UI: Better Together"
date: "2026-02-23"
excerpt: "Why the future of AI UIs needs both extensibility (MCP Apps) and native polish (A2UI/GenUI). A deep dive into building AIBank with dual standards."
tags: ["AI", "MCP", "A2UI", "GenUI", "Architecture", "Flutter", "Agent-to-App"]
featured: true
---

# MCP Apps vs A2UI: Better Together

When I set out to build [AIBank](https://github.com/richgo/aibank), a demo AI-powered banking app, I had a clear goal: **prove that AI UIs can feel native while staying extensible**. The solution? Use both **MCP Apps-ext** (Anthropic's 3rd-party extensibility protocol) and **A2UI/GenUI** (Google's agent-to-UI standard). Not one or the other—**both**.

Here's why you need both standards, how they complement each other, and how we built AIBank using nothing more than markdown config files and flat agent specs.

---

## The Problem: Pick Two

Modern AI app development forces an impossible choice:

1. **Native feel** — Smooth, platform-native UI that feels like a real app
2. **Agent intelligence** — LLM-powered reasoning that adapts to user intent
3. **3rd-party extensibility** — Ability to plug in external tools and services

Pick two. You can't have all three.

Or... can you?

---

## The Standards

### MCP Apps-ext: Extensibility First

[Anthropic's MCP Apps extension](https://github.com/modelcontextprotocol/ext-apps) solves the **3rd-party extensibility problem**. It lets agents call external MCP servers (tools, data sources, UI components) over HTTP using JSON-RPC.

**What it gives you:**
- ✅ **Plug-and-play ecosystem** — Any MCP server works with any MCP client
- ✅ **Hosted UIs** — MCP servers can serve interactive web components (`ui://`)
- ✅ **Zero platform lock-in** — HTTP + JSON-RPC runs anywhere

**What it doesn't give you:**
- ❌ **Native UI feel** — MCP app UIs are web-based (iframes/WebViews)
- ❌ **Consistent design** — Each MCP server brings its own UI
- ❌ **Platform integration** — No access to native platform features

### A2UI/GenUI: Native Polish

[Google's A2UI standard](https://github.com/google/A2UI) solves the **native feel problem**. It defines a contract between agents and UI frameworks: agents emit structured **A2UI templates**, and the UI framework renders them using **native platform components**.

**What it gives you:**
- ✅ **Platform-native UI** — Real Flutter/Swift/Kotlin widgets, not web views
- ✅ **Consistent design** — Your app's design system, not third-party styles
- ✅ **Performance** — Native rendering, no iframe overhead

**What it doesn't give you:**
- ❌ **Extensibility** — Agents must know all UI patterns upfront
- ❌ **3rd-party plugins** — No standard way to integrate external tools
- ❌ **Dynamic capabilities** — Adding new features requires app updates

---

## The Insight: Use Both

Here's the key insight: **MCP Apps-ext and A2UI solve different problems**. They're not competitors—they're **complements**.

- **A2UI** handles your **core product UI** (banking transactions, account summaries, mortgage calculators)
- **MCP Apps** handles **extensible plugins** (maps, weather, stock tickers, 3rd-party integrations)

When you need to render a transaction list? **A2UI** → native Flutter widgets.  
When a user asks "Where was this transaction?" **MCP Apps** → embedded map from an external MCP server.

![MCP Apps vs A2UI comparison](/img/mcp-vs-a2ui-comparison.png)

*Figure 1: Why both standards are needed—they solve different problems*

---

## AIBank Architecture

AIBank demonstrates this dual-standard approach:

### The Stack

```
┌─────────────────────────────────────┐
│  Flutter App (GenUI Host)           │  ← A2UI rendering
│  ├─ Native widgets (accounts, tx)   │
│  └─ mcp:AppFrame (embedded MCP UIs) │  ← MCP Apps hosting
└─────────────────────────────────────┘
              ↓ HTTP
┌─────────────────────────────────────┐
│  FastAPI Agent (Orchestrator)       │
│  ├─ A2UI template generation        │
│  ├─ In-process bank MCP server      │  ← Internal tools
│  └─ HTTP calls to map MCP server    │  ← External tools
└─────────────────────────────────────┘
              ↓ MCP JSON-RPC
┌─────────────────────────────────────┐
│  @modelcontextprotocol/server-map   │  ← 3rd-party MCP server
│  ├─ Geocoding API                   │
│  └─ ui://cesium-map/mcp-app.html    │  ← Hosted map UI
└─────────────────────────────────────┘
```

![AIBank architecture](/img/aibank-architecture.png)

*Figure 2: AIBank architecture—three layers working together*

### Custom GenUI Extension

To make this work, we extended GenUI with a custom **`mcp:AppFrame`** catalog item:

- **Web**: Sandboxed iframe + `postMessage` relay
- **Native**: WebView + JavaScript shim for `window.parent.postMessage`
- **MCP bridge**: Handles `ui/initialize`, `tools/list`, `tools/call` over JSON-RPC

This lets A2UI templates embed MCP app UIs **inline**, making them feel like first-class app components.

---

## The Magic: Flat Agent Files

Here's where it gets interesting. Building AIBank required **zero custom agent frameworks**. Instead, we used:

1. **OpenSpec as flat agent files** — Each endpoint (A2A, chat, tools) defined as a markdown spec
2. **Dual CLI support** — Same specs run by both `copilot-cli` and `claude-cli`
3. **Subagent config as markdown** — Tool definitions, routing logic, all in markdown

### What This Means

**Before**: Complex agent frameworks with custom DSLs, rigid tool definitions, vendor lock-in.

**After**: Drop a markdown file in a directory. Done.

```markdown
# tools/get_transactions.md

## Tool: get_transactions

Returns recent transactions for a user's bank account.

**Parameters:**
- `account_id` (string, required) - Account identifier
- `limit` (integer, optional) - Max transactions to return (default: 10)

**Returns:** List of transaction objects with:
- `id`, `date`, `merchant`, `amount`, `category`

**Example:**
\`\`\`json
{
  "account_id": "acc_123",
  "limit": 5
}
\`\`\`
```

That's it. Both `copilot-cli` and `claude-cli` parse this markdown, understand the tool contract, and wire it up. No code generation, no compilation, no SDK dependencies.

**Subagent routing?** Another markdown file:

```markdown
# routing.md

## Request Routing

- `/chat` → Main conversational agent (account questions, transaction lookup)
- `/a2a/message` → A2A standard agent (structured message/response)
- Map questions → Delegate to external map MCP server

When user mentions location/address/map → call map server geocode tool.
```

The agent runtime reads this, builds a decision tree, routes requests accordingly. All declarative. All markdown.

![Flat agent workflow](/img/flat-agent-workflow.png)

*Figure 3: Development workflow—markdown specs to running agent with no build step*

---

## The Development Process

Building AIBank looked like this:

### 1. Define Tools (Markdown)

Create flat markdown files for each banking tool:
- `tools/get_accounts.md`
- `tools/get_transactions.md`
- `tools/calculate_mortgage.md`

### 2. Configure Routing (Markdown)

Define how requests map to tools:
- Chat about accounts → `get_accounts`
- "Where was this transaction?" → Map MCP server
- Mortgage questions → `calculate_mortgage` + A2UI template

### 3. Run with Any CLI

```bash
# Option 1: copilot-cli
copilot-cli agent run --spec agent/

# Option 2: claude-cli  
claude-cli agent run --spec agent/

# Both work. Same specs.
```

### 4. Iterate

Change a markdown file. Save. Agent hot-reloads. Test again. No build step, no compilation, no framework magic.

---

## Key Takeaways

1. **MCP Apps-ext ≠ A2UI**  
   They solve different problems. Use both.

2. **A2UI for core product**  
   Your primary UI should be native, consistent, polished.

3. **MCP Apps for extensibility**  
   3rd-party plugins, dynamic capabilities, ecosystem growth.

4. **Markdown > Frameworks**  
   Flat agent specs are portable, readable, tooling-agnostic.

5. **Dual CLI support is free**  
   If your specs are declarative enough, any compliant CLI works.

---

## Try It Yourself

Clone [AIBank](https://github.com/richgo/aibank) and run:

```bash
./dev.sh
```

This starts:
- Agent backend (FastAPI + MCP servers)
- Map MCP server (@modelcontextprotocol/server-map)
- MCP inspector (explore tools in browser)
- Flutter web app (GenUI host with mcp:AppFrame)

Open `http://localhost:3000` and ask:
- "Show me my account balance"
- "What transactions did I make last week?"
- "Where was my coffee shop purchase?"

Watch as A2UI renders native transaction lists **and** MCP Apps embeds an interactive map—all in the same conversational flow.

---

## What's Next?

The future of AI UIs isn't **MCP vs A2UI**—it's **MCP + A2UI**.

- **Product teams** get native polish and brand consistency (A2UI)
- **Developers** get an open plugin ecosystem (MCP Apps)
- **Users** get the best of both worlds

And with flat markdown specs, **you don't need a PhD in agent frameworks to build it**.

Start simple. Add a markdown file. Ship.

---

**Links:**
- [AIBank GitHub](https://github.com/richgo/aibank)
- [MCP Apps-ext spec](https://github.com/modelcontextprotocol/ext-apps)
- [A2UI standard](https://github.com/google/A2UI)
- [GenUI SDK](https://github.com/google/genui)
- [A2UI Composer](https://a2ui-composer.ag-ui.com/)

---

*Built with nothing but markdown, curiosity, and a refusal to pick just two.*
