import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const profile = 'https://www.credly.com/users/richard-gobbett/badges'
const response = await fetch(`${profile}.json`)
if (!response.ok) throw new Error(`Credly request failed: ${response.status}`)
const { data, metadata } = await response.json()
if (!Array.isArray(data) || data.length !== metadata.total_count) {
  throw new Error('Incomplete Credly response; check pagination before importing')
}

const badges = []
await mkdir('public/img/credly', { recursive: true })
await mkdir('src/data', { recursive: true })
for (const badge of data) {
  const issuer = badge.issuer.entities.find(item => item.primary)?.entity.name
  if (!badge.id || !badge.badge_template.name || !issuer || !badge.issued_at_date || !badge.image_url) {
    throw new Error('Credly badge is missing required fields')
  }
  const imageResponse = await fetch(badge.image_url)
  if (!imageResponse.ok) throw new Error(`Badge image request failed: ${imageResponse.status}`)
  const image = `/img/credly/${badge.id}.png`
  await sharp(Buffer.from(await imageResponse.arrayBuffer()))
    .resize(320, 320, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toFile(`public${image}`)
  badges.push({
    id: badge.id,
    name: badge.badge_template.name,
    issuer,
    issued: badge.issued_at_date,
    expires: badge.expires_at_date,
    image,
    url: `https://www.credly.com/badges/${badge.id}/public_url`,
  })
}
badges.sort((a, b) => b.issued.localeCompare(a.issued) || a.name.localeCompare(b.name))
await writeFile('src/data/credly-badges.json', `${JSON.stringify({ profile, badges }, null, 2)}\n`)
console.log(`Imported ${badges.length} Credly badges and logos`)
