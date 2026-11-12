import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/lib/github-activity.ts', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const module = { exports: {} }
new Function('module', 'exports', js)(module, module.exports)
const { mapGitHubEvents } = module.exports

test('maps supported public events with safe GitHub URLs', () => {
  const items = mapGitHubEvents([{ id: '1', type: 'PushEvent', repo: { name: 'richgo/forge-kit' }, created_at: '2026-11-12T12:00:00Z' }])
  assert.equal(items.length, 1)
  assert.equal(items[0].url, 'https://github.com/richgo/forge-kit')
})
test('rejects malformed, unsupported and malicious repository names', () => {
  assert.deepEqual(mapGitHubEvents(null), [])
  assert.deepEqual(mapGitHubEvents([{ id: '1', type: 'PushEvent', repo: { name: 'evil/x?redirect=https://evil.test' }, created_at: '2026-11-12T12:00:00Z' }]), [])
  assert.deepEqual(mapGitHubEvents([{ id: '1', type: 'WatchEvent', repo: { name: 'richgo/forge-kit' }, created_at: '2026-11-12T12:00:00Z' }]), [])
})
test('limits activity to four items', () => {
  const items = Array.from({length: 10}, (_, i) => ({ id: String(i), type: 'PushEvent', repo: { name: 'richgo/forge-kit' }, created_at: '2026-11-12T12:00:00Z' }))
  assert.equal(mapGitHubEvents(items).length, 4)
})
