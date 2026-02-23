---
title: "MCP Apps vs A2UI: Better Together"
date: "2026-02-23"
excerpt: "Why the future of AI UIs needs both extensibility (MCP Apps) and native polish (A2UI/GenUI). A deep dive into building AIBank with dual standards."
tags: ["AI", "MCP", "A2UI", "GenUI", "Architecture", "Flutter", "Agent-to-App"]
featured: true
---

# MCP Apps vs A2UI: Better Together

Let me tell you about building [AIBank](https://github.com/richgo/aibank), a demo AI-powered banking app that taught me something important about the current state of AI UI development. It's a story about two competing standards that actually aren't competing at all—and why you need both of them to build something that feels real.

The problem I set out to solve was simple on the surface: **prove that AI UIs can feel native while staying extensible**. Turns out that's harder than it sounds, because the industry has collectively decided to make us choose between polish and openness. But here's the thing—we don't have to choose. We just need to understand what problems each standard solves, and use them both intelligently.

## The Impossible Trinity

If you're building an AI application today, you're forced into an impossible choice. You can pick two of these three things, but not all three:

**Native feel** — The kind of smooth, platform-native UI that makes an app feel like it belongs on your device. Real Flutter widgets on mobile, real SwiftUI on iOS, proper Jetpack Compose on Android. The stuff that makes users forget they're using an AI app and just focus on getting things done.

**Agent intelligence** — LLM-powered reasoning that actually understands what users want and adapts to their intent. Not just keyword matching or rigid command structures, but genuine understanding that gets better as the conversation develops.

**3rd-party extensibility** — The ability for anyone in the ecosystem to plug in new tools, new services, new capabilities. The kind of open plugin architecture that lets your app grow beyond what you initially built.

I spent years in enterprise software watching companies try to have all three and fail. They'd get the native feel and the intelligence but lock themselves into proprietary tool ecosystems. Or they'd go open and extensible but end up with web-view UIs that feel second-class. Or they'd nail the native experience and open it up, but lose the intelligence trying to coordinate everything.

For the longest time, I accepted this as just how things work. You pick your battles. You optimize for your users' top priorities and compromise on the rest.

Then I started looking at MCP Apps-ext and A2UI, and something clicked.

## Two Standards, Two Problems

Let's talk about what each of these standards actually solves, because the marketing material makes it sound like they're competing visions for the future of AI. They're not.

### MCP Apps-ext: Opening the Ecosystem

Anthropic's [MCP Apps extension](https://github.com/modelcontextprotocol/ext-apps) tackles the **extensibility problem**. It's a protocol that lets agents call external MCP servers over HTTP using JSON-RPC. Think of it as the npm of AI capabilities—anyone can publish an MCP server, any agent can consume it.

What this gives you is **plug-and-play 3rd-party integration**. Want a weather service? There's an MCP server for that. Need maps? Stock data? Translation services? Someone's probably already built it, and you can wire it into your agent with a few lines of configuration.

The clever bit is the **hosted UIs**. MCP servers don't just provide data—they can serve interactive web components using the `ui://` scheme. So when your banking app needs to show a map, it doesn't need to implement map rendering. It just calls the map MCP server, which returns a fully functional web app that gets embedded in your UI.

This is brilliant for extensibility. It means the ecosystem can grow horizontally without every app developer needing to become an expert in every domain. But here's what it doesn't give you: **native feel**.

MCP app UIs are web-based. They run in iframes or WebViews. They bring their own styling, their own interaction patterns, their own quirks. Each MCP server is its own little universe, and while that's great for diversity, it's terrible for consistency. Your banking app might have a beautiful native transaction list, but then the user asks about a merchant location and suddenly they're staring at a different design language, different fonts, different everything.

It works. It's functional. But it doesn't feel **cohesive**.

### A2UI/GenUI: Polishing the Core

Google's [A2UI standard](https://github.com/google/A2UI) tackles the **native feel problem**. It defines a contract between agents and UI frameworks: agents emit structured templates in a standardized format, and the UI framework renders them using native platform components.

This is the opposite philosophy from MCP Apps. Instead of letting every tool bring its own UI, A2UI says: "Agents describe what they want to show, platforms decide how to render it." So when your agent needs to display a transaction list, it doesn't emit HTML or React JSX. It emits an A2UI template that says "here's a list of items with these fields," and your Flutter app renders that using proper Material Design widgets. Your iOS app uses SwiftUI. Your web app uses whatever component library you've chosen.

The result is **genuine platform-native UI**. It looks right. It feels right. It performs like a native app because it *is* a native app. Your brand guidelines are maintained. Your design system is consistent across features. There's no iframe jank, no WebView memory overhead, no CSS conflicts.

But here's what A2UI doesn't give you: **extensibility at the boundaries**. If you want to add a new capability, you need to define it in your agent, implement the UI components in your app, deploy both in lockstep. There's no "just plug in this MCP server and it works" moment. You're back in the world of coordinated releases and tight coupling.

![MCP Apps vs A2UI comparison](/img/mcp-vs-a2ui-comparison.png)

*Figure 1: Why both standards are needed—they solve different problems*

## The Insight: Stop Choosing

Here's what I realized while building AIBank: **these standards aren't alternatives**. They're complements.

MCP Apps-ext and A2UI solve different problems in the same architecture. They can—and should—coexist in the same app. Use A2UI for your core product UI, the features you control, the experiences you want to polish. Use MCP Apps for the boundaries, the 3rd-party integrations, the places where you want ecosystem growth.

When a user asks "What's my account balance?" your agent generates an A2UI template. Your app renders it with native Flutter widgets. It's fast, polished, on-brand.

When they ask "Where was this transaction?" your agent calls an external map MCP server. It returns a hosted map UI. Your app embeds it inline. It's functional, interactive, and you didn't have to build it.

Same conversation flow. Same agent. Two different rendering strategies, chosen based on what you're showing.

![AIBank architecture](/img/aibank-architecture.png)

*Figure 2: AIBank architecture—three layers working together*

## Building AIBank: Architecture in Practice

Let me walk you through how this dual-standard approach works in practice. AIBank has three layers, each with a specific job.

### Layer 1: The Flutter App

This is the user-facing layer. It's a Flutter app that hosts the GenUI SDK, which is Google's reference implementation of A2UI rendering. But we extended it with a custom **`mcp:AppFrame`** catalog item.

What's a catalog item? In GenUI, it's basically a UI component type that the agent can reference. Out of the box, you get things like `list`, `card`, `button`, `text-field`—the building blocks of most UIs. We added `mcp:AppFrame` to that catalog, which tells GenUI: "When you see this component in an A2UI template, render an MCP app UI inline."

The implementation varies by platform. On web, it's a sandboxed iframe with a `postMessage` bridge. On mobile native (iOS/Android), it's a WebView with a JavaScript shim that intercepts `window.parent.postMessage` calls. Either way, it creates a bidirectional JSON-RPC channel between the app and the MCP server.

So now when an A2UI template says "embed this MCP app here," GenUI knows how to do it. It loads the hosted UI from the MCP server, sets up the communication channel, and makes it feel like a first-class part of the app.

This is the key integration point. A2UI handles everything you want native and polished. MCP Apps handles everything you want pluggable and dynamic. The `mcp:AppFrame` component bridges them.

### Layer 2: The Agent

The orchestration layer is a FastAPI server that sits between the Flutter app and the various data sources. It receives chat messages from the app, figures out what the user wants, gathers the necessary data, and returns A2UI templates.

This layer does a few different things depending on the request. For core banking queries—account balances, recent transactions, mortgage calculators—it calls an **in-process bank MCP server**. This is essentially a Python module that implements the MCP protocol locally. No HTTP, no network hop. It's fast, it's deterministic, and it returns structured data that the agent can format into A2UI templates.

For location-related queries—"Where was this merchant?" or "Show me branch locations"—it calls an **external map MCP server** over HTTP. This is `@modelcontextprotocol/server-map`, a reference implementation from the MCP Apps repo. The agent sends it a merchant name, gets back coordinates, then requests the hosted map UI using the `ui://cesium-map/mcp-app.html` resource path.

The agent doesn't know or care whether it's calling an internal MCP server or an external one. It's all just MCP JSON-RPC. And it doesn't know or care whether the result will be rendered as A2UI or as an embedded app. It just returns whatever makes sense for the data type.

This separation of concerns is powerful. The agent focuses on **what to show**. The app focuses on **how to render it**. The MCP servers focus on **where the data comes from**. Clean boundaries, loosely coupled components.

### Layer 3: The MCP Servers

At the bottom layer, we have the actual capability providers. The bank MCP server is custom-built for this demo. It has tools for getting account data, retrieving transactions, calculating mortgages, checking credit card balances. Standard banking stuff, but implemented as MCP tools.

The map MCP server is off-the-shelf. We didn't build it. We just pointed our agent at `http://localhost:3001/mcp` and started calling its tools. It provides geocoding (merchant name → coordinates), map rendering (coordinates → interactive Cesium map), and a few other location-related utilities.

That's the ecosystem play. The bank server is ours. The map server is someone else's. But they both speak MCP, so they both plug into our agent seamlessly. As the MCP ecosystem grows, we'll be able to add weather, stock tickers, news feeds, whatever—without changing our app code or redeploying our agent.

## The Development Story: Markdown All the Way Down

Here's where things get really interesting. Building AIBank didn't require a complex agent framework or a custom orchestration DSL. We used **flat markdown files** for everything, following a pattern inspired by [OpenSpec-Agents](https://github.com/richgo/OpenSpec-Agents)—a spec-driven development workflow where agents are just markdown files in `.github/agents/` that hand off to each other through natural conversation.

Let me walk you through how this works, because it fundamentally changes how you think about building AI systems.

### The AGENTS.md Pattern

In traditional software development, you define capabilities in code. Functions, classes, modules—the usual suspects. With OpenSpec, you define capabilities in markdown files that describe what an agent can do, what tools it has access to, and which other agents it should hand off to when its job is done.

AIBank uses a simplified version of this pattern. Each banking tool is defined in a markdown file. Here's what `tools/get_transactions.md` looks like:

```markdown
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

That's it. No code generation. No compilation step. No SDK dependencies. Just a markdown file that describes what the tool does and what parameters it expects. Both `copilot-cli` and `claude-cli` parse this markdown, understand the tool contract, and make it available to the agent runtime.

Routing logic? Also markdown. Here's `routing.md`:

```markdown
## Request Routing

- `/chat` → Main conversational agent (account questions, transaction lookup)
- `/a2a/message` → A2A standard agent (structured message/response)
- Map questions → Delegate to external map MCP server

When user mentions location/address/map → call map server geocode tool.
```

Subagent configuration? You guessed it—markdown. Model selection, context limits, system prompts, all declarative. No framework to learn, no YAML to validate, no JSON schema to debug.

### The OpenSpec Workflow: From Idea to Code

The OpenSpec-Agents repo takes this pattern further by defining an entire development workflow as a series of handoffs between specialized agents. It's like a relay race where each agent does one thing well, then passes the baton to the next agent in the chain.

Here's how it works:

**1. explore** — You start by investigating the codebase, thinking through ideas, checking what exists. This agent has read and search tools. When you're ready to actually build something, it hands off to either `new` (for a structured approach) or `ff` (fast-forward for simple changes).

**2. new** — This agent scaffolds a change directory in `openspec/changes/`. It creates the folder structure, initializes metadata, and sets you up for the full workflow. Then it hands off to `proposal`.

**3. proposal** — Here you write the **WHY**. What's the intent? What problem are you solving? What's in scope and what's not? This is pure thinking, no code yet. When you're satisfied, hand off to `specs`.

**4. specs** — Now you write the **WHAT**. What are the requirements? What are the acceptance criteria? What edge cases do we need to handle? This agent helps you write proper specifications—not vague wishes, but concrete scenarios that can be tested. Hand off to `design`.

**5. design** — Here you write the **HOW**. What are the technical decisions? What patterns are you using? How does this fit into the existing architecture? This is where you make the hard choices about structure and approach. Hand off to `tasks`.

**6. tasks** — Break the work into a **DO** checklist. Concrete implementation steps, ordered by dependency. Each task should be small enough to complete in one sitting. This becomes your implementation roadmap. Hand off to `apply`.

**7. apply** — This is where markdown becomes code. The `apply` agent follows a **BDD-first workflow**: it writes a failing scenario (Behavior-Driven Development), analyzes edge cases, then implements the code using strict TDD (Test-Driven Development). Red → Green → Refactor, but with a behavior scenario wrapping the unit tests.

Here's where the magic happens. The agent reads your specs markdown, understands the requirements, writes a test that captures the expected behavior, then implements the minimal code to make it pass. It's not magic—it's just following the pattern you described in markdown, but doing it systematically.

**8. verify** — Once implementation is complete, this agent checks spec compliance. Did we actually build what we said we'd build? Are all scenarios passing? Any edge cases missed? If issues are found, it hands back to `apply` for fixes. If everything looks good, hand off to `archive`.

**9. archive** — Close out the change. Merge the specs into the canonical library, move the change to the archive folder, clean up. You're done. Hand off to `new` for the next feature.

There's also an **ff** (fast-forward) agent that combines proposal → specs → design → tasks into one pass for simple changes. Use it when you don't need the full ceremony.

### How Markdown Becomes Code

The critical insight is that **the workflow itself is declarative**. Each agent is a markdown file that says:

"I can do X, Y, Z. I have these tools. When I'm done, here are the next steps you might want to take."

When you run `gh copilot --agent apply "Implement get_transactions"`, the CLI:

1. Loads `apply.md` from `.github/agents/`
2. Parses the agent definition (tools, instructions, handoffs)
3. Reads the relevant spec markdown from `openspec/changes/<change-name>/specs/`
4. Uses the LLM to generate code that satisfies the spec
5. Runs tests (BDD scenario → TDD units)
6. Suggests handoffs to `verify` or `archive`

All of this happens because you described what you wanted in markdown. The agent runtime wires up the tools, manages context, and executes the workflow. But the **definitions are portable**. You can take these same `.md` files and run them with `claude-cli`, `gpt-cli`, or any other compliant runtime.

This is powerful because it decouples **what you're building** from **how you're building it**. The specs don't care which LLM you use or which CLI you prefer. They're just descriptions of desired behavior, written in plain language (with some structure), stored as version-controlled markdown files.

### AIBank's Simplified Workflow

AIBank doesn't use the full OpenSpec workflow because it's a demo, not a production system. But it follows the same principle: **markdown as the source of truth**.

The agent configuration is just a directory of markdown files:

```
agent/
├── tools/
│   ├── get_accounts.md
│   ├── get_transactions.md
│   ├── calculate_mortgage.md
│   └── geocode.md (external MCP)
├── routing.md
└── config.md
```

When you run `copilot-cli agent run --spec agent/` or `claude-cli agent run --spec agent/`, the CLI:

1. Scans the `agent/` directory
2. Parses each markdown file
3. Builds an internal representation of tools and routing rules
4. Starts the FastAPI server with those capabilities
5. Hot-reloads when any `.md` file changes

The development loop becomes:

1. Edit `tools/get_transactions.md` to add a parameter
2. Save the file
3. The agent runtime notices the change and reloads
4. Test the updated tool immediately in the Flutter app

No compilation. No deployment. No build artifacts. Just markdown → running system.

And because the specs are portable, you can run the exact same markdown with a different CLI or a different LLM without changing a single line. The tool definitions don't know or care about the runtime. They're just descriptions of what the tool does, written in a format that any compliant parser can understand.

![Flat agent workflow](/img/flat-agent-workflow.png)

*Figure 3: Development workflow—markdown specs to running agent with no build step*

## What This Means for You

If you're building an AI app today, here's my advice: **stop trying to pick a side**. Don't choose between MCP and A2UI. Don't let anyone tell you they're competing visions. They're not.

Think of A2UI as your **internal rendering strategy**. It's how you build the core product experience—your accounts page, your transaction history, your settings screen. It gives you native performance, brand consistency, and tight integration with your platform.

Think of MCP Apps as your **external integration strategy**. It's how you add maps, weather, news, stocks, or any other capability where you want to tap into the ecosystem rather than build everything yourself. It gives you flexibility, speed to market, and access to specialized tools you'd never have time to perfect.

Together, they give you both sides of the impossible trinity. You get native feel (A2UI) and extensibility (MCP Apps). The only thing missing is agent intelligence, and that's what your LLM provides. Use Claude, use GPT, use Gemini—doesn't matter. As long as your agent can emit A2UI templates and call MCP servers, you're in business.

And if you design your agent using flat markdown specs like we did with AIBank, you get one more thing: **portability**. Your entire agent configuration is just a directory of markdown files. You can version it in git, share it on GitHub, review it in a PR. You can run it with any compliant CLI. You can hand it to another developer and they'll understand it immediately, because it's just markdown.

No framework lock-in. No vendor dependencies. No proprietary DSLs. Just descriptions of what you want, in a format anyone can read.

## The Future

The AI UI space is moving fast, and everyone's got an opinion about which standard will win. MCP vs A2UI. Claude vs GPT. Flutter vs React Native. It's exhausting.

But here's what I learned building AIBank: **the winners won't be the ones who pick a side**. They'll be the ones who understand what each tool is good at and combine them intelligently.

Use A2UI for your core product. Use MCP Apps for your ecosystem. Use markdown for your agent specs. Use whatever LLM makes sense for your use case. Stay flexible. Stay portable. Stay focused on what actually matters: **building something that works and feels good**.

Because at the end of the day, users don't care about standards. They care about whether your app helps them get things done. And if using two standards together lets you ship faster and build better, that's not a compromise—it's a win.

---

## Try It Yourself

Want to see this in action? Clone [AIBank](https://github.com/richgo/aibank) and run:

```bash
./dev.sh
```

This starts the agent backend, the map MCP server, the MCP inspector (for exploring tools in your browser), and the Flutter web app. Open `http://localhost:3000` and try these queries:

"Show me my account balance"—watch A2UI render native transaction widgets.

"What transactions did I make last week?"—see structured data formatted beautifully.

"Where was my coffee shop purchase?"—experience an MCP app embedding a live map inline.

All in the same conversational flow. All feeling like one cohesive app. Because that's what happens when you stop choosing and start combining.

---

**Links:**
- [AIBank GitHub](https://github.com/richgo/aibank)
- [MCP Apps-ext spec](https://github.com/modelcontextprotocol/ext-apps)
- [A2UI standard](https://github.com/google/A2UI)
- [GenUI SDK](https://github.com/google/genui)
- [A2UI Composer](https://a2ui-composer.ag-ui.com/)

---

*Built with markdown, curiosity, and a refusal to be told I have to choose.*
