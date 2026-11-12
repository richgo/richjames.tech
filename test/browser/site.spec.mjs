import { expect, test } from '@playwright/test'

const endpoint = 'https://api.github.com/users/richgo/events/public*'
const profile = 'https://github.com/richgo'
const event = (id, name) => ({
  id: String(id), type: 'PushEvent',
  repo: { name, url: 'https://api.github.com/repos/' + name },
  created_at: '2026-11-12T12:00:00Z',
})

test('AC-001 homepage and canonical links', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  for (const path of ['/about', '/blog', '/contact']) {
    await expect(page.locator(`a[href="${path}"]`).first()).toBeAttached()
  }
  const href = await page.locator('main a[href^="/blog/"]').first().getAttribute('href')
  expect((await page.goto(href)).ok()).toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('AC-002 and AC-003 archive and topic routes', async ({ page }) => {
  await page.goto('/blog')
  const article = await page.locator('main a[href^="/blog/"]').first().getAttribute('href')
  expect((await page.goto(article)).ok()).toBe(true)
  await page.goto('/tags')
  const topic = await page.locator('main a[href^="/tags/"]').first().getAttribute('href')
  expect((await page.goto(topic)).ok()).toBe(true)
  const posts = page.locator('.topic-post')
  await expect(posts.first().getByRole('article')).toBeVisible()
  for (const post of await posts.all()) {
    await expect(post.locator('a[aria-current="page"]')).toHaveAttribute('href', topic)
  }
})

test('AC-004 profile credentials and contact links', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: 'Career timeline' })).toBeVisible()
  await expect(page.locator('.timeline-item').first()).toBeAttached()
  await expect(page.locator('main a[href*="credly.com"]').first()).toBeVisible()
  await page.goto('/contact')
  await expect(page.locator('main a[href="mailto:contact@richjames.tech"]')).toBeVisible()
})

test('AC-005 renders the first four supported events from the browser request', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({
    json: [event(0, 'richgo/..'), ...Array.from({ length: 5 }, (_, i) => event(i + 1, 'richgo/project-' + i))],
  }))
  await page.goto('/')
  const panel = page.getByRole('region', { name: 'GitHub activity' })
  await expect(panel).toBeVisible()
  await expect(panel.getByRole('listitem')).toHaveCount(4)
  for (let i = 0; i < 4; i++) {
    const entry = panel.getByRole('listitem').nth(i)
    await expect(entry).toContainText('richgo/project-' + i)
    await expect(entry.getByRole('link')).toHaveAttribute('href', 'https://github.com/richgo/project-' + i)
  }
})

for (const [name, reply] of [
  ['rate limit', route => route.fulfill({ status: 429 })],
  ['network error', route => route.abort()],
  ['empty feed', route => route.fulfill({ json: [] })],
  ['malformed feed', route => route.fulfill({ json: { events: 'invalid' } })],
]) {
  test('AC-006 handles ' + name, async ({ page }) => {
    await page.route(endpoint, reply)
    await page.goto('/')
    const panel = page.getByRole('region', { name: 'GitHub activity' })
    await expect(panel.getByRole('status')).toContainText(/unavailable|no recent|could not|couldn.t/i)
    await expect(panel.locator(`a[href="${profile}"]`)).toBeVisible()
    await expect(panel.getByRole('listitem')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
}
