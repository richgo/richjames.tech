import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/lib/github-activity.ts', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const compiled = { exports: {} }
new Function('module', 'exports', js)(compiled, compiled.exports)
const { mapGitHubEvents } = compiled.exports
const event = (id, name, url) => ({
  id: String(id), type: 'PushEvent', repo: { name, url }, created_at: '2026-11-12T12:00:00Z',
})

test('maps a public event with a GitHub repository link', () => {
  const items = mapGitHubEvents([event(1, 'richgo/forge-kit', 'https://api.github.com/repos/richgo/forge-kit')])
  assert.equal(items.length, 1)
  assert.equal(items[0].url, 'https://github.com/richgo/forge-kit')
})

test('AC-007 rejects unsafe repository names and untrusted repository URLs', () => {
  assert.deepEqual(mapGitHubEvents(null), [])
  assert.deepEqual(mapGitHubEvents([
    event(1, 'evil/x?redirect=https://evil.test'),
    event(2, 'richgo/..'),
    event(3, 'richgo/forge-kit', 'https://evil.test/richgo/forge-kit'),
    event(4, 'richgo/forge-kit', 'https://api.github.com/repos/richgo/other'),
  ]), [])
})

test('limits activity to four supported entries', () => {
  const items = Array.from({ length: 10 }, (_, i) => event(i, 'richgo/forge-kit'))
  assert.equal(mapGitHubEvents(items).length, 4)
})
