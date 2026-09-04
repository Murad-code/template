/**
 * Captures screenshots and computed design tokens from a deployed site instance.
 * Usage: pnpm exec tsx scripts/capture-ui-audit.ts [baseUrl]
 */
import { chromium, type Page } from '@playwright/test'
import fs from 'fs/promises'
import path from 'path'

const BASE_URL = process.argv[2]?.replace(/\/$/, '') || 'https://muradsprojects.co.uk'
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/ui-audit')

const CSS_VARS = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--border',
  '--primary',
  '--primary-foreground',
  '--muted',
  '--muted-foreground',
  '--landing-background',
  '--landing-card-background',
  '--landing-card-border',
  '--landing-heading',
  '--landing-body',
  '--radius',
]

type ThemeMode = 'light' | 'dark'

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

async function setTheme(page: Page, theme: ThemeMode) {
  await page.evaluate((mode) => {
    document.documentElement.setAttribute('data-theme', mode)
    window.localStorage.setItem('payload-theme', mode)
  }, theme)
  await page.waitForTimeout(300)
}

async function extractTokens(page: Page) {
  return page.evaluate((vars) => {
    const styles = getComputedStyle(document.documentElement)
    const bodyStyles = getComputedStyle(document.body)
    const h1 = document.querySelector('h1')
    const h1Styles = h1 ? getComputedStyle(h1) : null

    const tokens: Record<string, string> = {}
    for (const name of vars) {
      tokens[name] = styles.getPropertyValue(name).trim()
    }

    return {
      cssVariables: tokens,
      body: {
        backgroundColor: bodyStyles.backgroundColor,
        color: bodyStyles.color,
        fontFamily: bodyStyles.fontFamily,
        fontSize: bodyStyles.fontSize,
        lineHeight: bodyStyles.lineHeight,
      },
      h1: h1Styles
        ? {
            color: h1Styles.color,
            fontSize: h1Styles.fontSize,
            fontWeight: h1Styles.fontWeight,
            lineHeight: h1Styles.lineHeight,
            letterSpacing: h1Styles.letterSpacing,
          }
        : null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      title: document.title,
      url: window.location.href,
    }
  }, CSS_VARS)
}

async function capturePage(
  page: Page,
  route: string,
  slug: string,
  viewport: { width: number; height: number; label: string },
  theme: ThemeMode,
) {
  const url = `${BASE_URL}${route}`
  await page.setViewportSize({ width: viewport.width, height: viewport.height })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
  await setTheme(page, theme)

  const dir = path.join(OUTPUT_DIR, 'screenshots', viewport.label, theme)
  await ensureDir(dir)

  const fileBase = slug.replace(/^\//, '').replace(/\//g, '-') || 'home'
  const screenshotPath = path.join(dir, `${fileBase}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: true })

  const tokens = await extractTokens(page)

  return {
    route,
    slug,
    viewport: viewport.label,
    theme,
    screenshot: path.relative(process.cwd(), screenshotPath),
    tokens,
  }
}

async function discoverRoutes(page: Page): Promise<string[]> {
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 })

  const links = await page.evaluate(() => {
    const hrefs = new Set<string>()
    for (const anchor of Array.from(document.querySelectorAll('a[href]'))) {
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue
      }
      if (href.startsWith('http') && !href.includes(window.location.host)) continue
      const path = href.startsWith('http') ? new URL(href).pathname : href
      if (path.startsWith('/admin') || path.startsWith('/api')) continue
      hrefs.add(path.split('?')[0] || '/')
    }
    return Array.from(hrefs).sort()
  })

  const priority = ['/', '/shop', '/about', '/about-us', '/blog', '/posts', '/contact', '/book', '/bookings']
  const ordered = [
    ...priority.filter((route) => links.includes(route)),
    ...links.filter((route) => !priority.includes(route)),
  ]

  return [...new Set(ordered)].slice(0, 12)
}

async function run() {
  await ensureDir(OUTPUT_DIR)
  await ensureDir(path.join(OUTPUT_DIR, 'screenshots'))

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  const routes = await discoverRoutes(page)
  const viewports = [
    { width: 1440, height: 900, label: 'desktop' },
    { width: 390, height: 844, label: 'mobile' },
  ] as const

  const captures: Awaited<ReturnType<typeof capturePage>>[] = []

  for (const route of routes) {
    for (const viewport of viewports) {
      for (const theme of ['light', 'dark'] as const) {
        try {
          const result = await capturePage(page, route, route, viewport, theme)
          captures.push(result)
          console.log(`Captured ${theme} ${viewport.label}: ${route}`)
        } catch (error) {
          console.warn(`Failed ${route} (${viewport.label}, ${theme}):`, error)
        }
      }
    }
  }

  // Hero-only crop for homepage review
  try {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    await setTheme(page, 'light')
    const heroPath = path.join(OUTPUT_DIR, 'screenshots', 'desktop', 'light', 'home-hero-crop.png')
    const hero = page.locator('main section').first()
    if (await hero.isVisible()) {
      await hero.screenshot({ path: heroPath })
      console.log('Captured homepage hero crop')
    }
  } catch (error) {
    console.warn('Skipped homepage hero crop:', error)
  }

  const audit = {
    capturedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    routes,
    captures,
  }

  await fs.writeFile(path.join(OUTPUT_DIR, 'audit-data.json'), JSON.stringify(audit, null, 2))

  await browser.close()
  console.log(`\nAudit complete. Output: ${OUTPUT_DIR}`)
}

void run()
