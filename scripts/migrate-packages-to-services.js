#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const projectRoot = process.cwd()
const possibleSources = ['data/packages.json', 'src/data/packages.json']

const source = possibleSources
  .map((relative) => ({ relative, absolute: path.join(projectRoot, relative) }))
  .find((entry) => fs.existsSync(entry.absolute))

if (!source) {
  console.error('No packages.json file found in data/ or src/data/. Nothing to migrate.')
  process.exit(1)
}

const backupPath = `${source.absolute}.bak`
fs.copyFileSync(source.absolute, backupPath)
console.log(`Backed up ${source.relative} to ${path.relative(projectRoot, backupPath)}`)

const rawContent = fs.readFileSync(source.absolute, 'utf8')
const parsed = JSON.parse(rawContent)
const packageArray = Array.isArray(parsed)
  ? parsed
  : Array.isArray(parsed.packages)
    ? parsed.packages
    : Array.isArray(parsed.data)
      ? parsed.data
      : []

if (!Array.isArray(packageArray) || packageArray.length === 0) {
  console.error('The packages.json file did not contain an array of packages. No services were migrated.')
  process.exit(1)
}

const slugify = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const normalizeBullets = (input) => {
  if (!input) return []

  if (Array.isArray(input)) {
    return input
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
  }

  if (typeof input === 'string') {
    return input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  }

  return []
}

const normalizedServices = packageArray.map((pkg, index) => {
  const title = pkg.title || pkg.name || `Service ${index + 1}`
  const id = pkg.id || pkg.slug || slugify(title) || `service-${index + 1}`

  return {
    id,
    title,
    oneLiner: pkg.oneLiner || pkg.summary || pkg.description || '',
    bullets: normalizeBullets(pkg.bullets || pkg.highlights || pkg.benefits),
    chips: pkg.chips || pkg.tagline || pkg.meta || '',
  }
})

const targetRelative = source.relative.startsWith('src/') ? 'src/data/services.json' : 'data/services.json'
const targetPath = path.join(projectRoot, targetRelative)

fs.mkdirSync(path.dirname(targetPath), { recursive: true })
fs.writeFileSync(targetPath, JSON.stringify(normalizedServices, null, 2))

console.log(`Created ${targetRelative} with ${normalizedServices.length} services.`)
console.log('Original data preserved at', path.relative(projectRoot, backupPath))

