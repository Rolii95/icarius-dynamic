#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const projectRoot = process.cwd()
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')

const contentDir = path.join(projectRoot, 'content', 'packages')
const outputFile = path.join(projectRoot, 'data', 'packages.json')

const fallbackBookingUrl = 'https://calendly.com/icarius/intro-call'

const planMap = (() => {
  const env = process.env.NEXT_PUBLIC_BOOKING_PLAN_MAP
  if (!env) return {}

  return env.split(',').reduce((acc, entry) => {
    const [key, value] = entry.split(':')
    if (key && value) {
      acc[key.trim()] = value.trim()
    }
    return acc
  }, {})
})()

function buildBookingUrl(plan) {
  if (!plan) {
    return process.env.NEXT_PUBLIC_BOOKING_URL ||
      process.env.NEXT_PUBLIC_CALENDLY_URL ||
      fallbackBookingUrl
  }

  const baseUrl =
    planMap[plan] ||
    process.env.NEXT_PUBLIC_BOOKING_URL ||
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    fallbackBookingUrl

  try {
    const url = new URL(baseUrl)
    url.searchParams.set('plan', plan)
    return url.toString()
  } catch (error) {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}plan=${encodeURIComponent(plan)}`
  }
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { data: {}, body: content }
  }

  const closingIndex = content.indexOf('\n---', 3)
  if (closingIndex === -1) {
    return { data: {}, body: content }
  }

  const raw = content.slice(3, closingIndex).trim()
  const body = content.slice(closingIndex + 4)

  const lines = raw.split(/\r?\n/)
  const data = {}
  let currentArrayKey = null

  for (const line of lines) {
    if (!line.trim()) continue

    const arrayMatch = line.match(/^\s*-\s+(.*)$/)
    if (arrayMatch) {
      if (!currentArrayKey) {
        continue
      }

      data[currentArrayKey].push(arrayMatch[1].trim())
      continue
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!keyMatch) {
      currentArrayKey = null
      continue
    }

    const [, key, rawValue] = keyMatch
    if (rawValue === '') {
      data[key] = []
      currentArrayKey = key
      continue
    }

    const cleaned = rawValue.trim().replace(/^['"]|['"]$/g, '')
    data[key] = cleaned
    currentArrayKey = null
  }

  return { data, body }
}

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

if (!fs.existsSync(contentDir)) {
  console.warn(
    `No package content directory found at ${path.relative(projectRoot, contentDir)}. Skipping sync.`,
  )
  process.exit(0)
}

const mdxFiles = fs
  .readdirSync(contentDir)
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => path.join(contentDir, file))

if (mdxFiles.length === 0) {
  console.warn('No MDX package files found. Skipping sync.')
  process.exit(0)
}

const packages = mdxFiles.map((filePath) => {
  const rawContent = fs.readFileSync(filePath, 'utf8')
  const { data } = parseFrontmatter(rawContent)
  const fileName = path.basename(filePath, path.extname(filePath))

  const title = data.title || ''
  if (!title) {
    console.warn(`Package ${fileName} is missing a title.`)
  }

  const id = data.id || slugify(title || fileName)
  const subtitle = data.subtitle || ''
  const price = data.price || ''
  const chips = data.chips || ''
  const ctaLabel = data.ctaLabel || 'Book a 30-min call'
  const plan = data.plan || id

  const features = Array.isArray(data.features)
    ? data.features.map((item) => String(item).trim()).filter(Boolean)
    : []

  const order = Number.parseInt(data.order, 10)
  const ctaHref = data.ctaHref || buildBookingUrl(plan)

  return {
    id,
    title,
    subtitle,
    price,
    chips,
    features,
    ctaHref,
    ctaLabel,
    imageSrc: data.imageSrc || undefined,
    order: Number.isNaN(order) ? undefined : order,
  }
})

packages.sort((a, b) => {
  const orderA = typeof a.order === 'number' ? a.order : Number.POSITIVE_INFINITY
  const orderB = typeof b.order === 'number' ? b.order : Number.POSITIVE_INFINITY

  if (orderA !== orderB) {
    return orderA - orderB
  }

  return a.title.localeCompare(b.title)
})

const normalized = packages.map(({ order, ...rest }) => rest)
const output = `${JSON.stringify(normalized, null, 2)}\n`

if (isDryRun) {
  console.log('[sync-packages] Dry run – generated data:\n')
  console.log(output)
  console.log(`\nDry run complete. data/packages.json would be updated with ${normalized.length} packages.`)
  process.exit(0)
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, output)

console.log(`Wrote ${path.relative(projectRoot, outputFile)} with ${normalized.length} packages.`)
