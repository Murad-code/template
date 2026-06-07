import fs from 'fs/promises'
import path from 'path'

const SEED_DIR = 'seed'
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

export interface ProductFolder {
  title: string
  dirPath: string
  imagePaths: string[]
}

export interface DiscoveredSeed {
  productFolders: ProductFolder[]
  heroImagePath: string | null
}

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return IMAGE_EXTENSIONS.has(ext)
}

/**
 * Discover seed directory: product subfolders (name = product title, images = gallery)
 * and optional root-level hero image (e.g. "Homepage image.webp").
 */
export async function discoverSeedDir(): Promise<DiscoveredSeed> {
  const cwd = process.cwd()
  const seedPath = path.join(cwd, SEED_DIR)

  try {
    await fs.access(seedPath)
  } catch {
    throw new Error(
      `Seed directory "${SEED_DIR}" not found at ${seedPath}. Add product image folders to run seed.`,
    )
  }

  const entries = await fs.readdir(seedPath, { withFileTypes: true })
  const productFolders: ProductFolder[] = []
  let heroImagePath: string | null = null

  for (const entry of entries) {
    const fullPath = path.join(seedPath, entry.name)

    if (entry.isDirectory()) {
      const files = await fs.readdir(fullPath, { withFileTypes: true })
      const imagePaths = files
        .filter((f) => f.isFile() && isImageFile(f.name))
        .map((f) => path.join(fullPath, f.name))
        .sort()

      if (imagePaths.length > 0) {
        productFolders.push({
          title: entry.name,
          dirPath: fullPath,
          imagePaths,
        })
      }
    } else if (entry.isFile() && isImageFile(entry.name)) {
      // Root-level image: treat as hero if name suggests it
      const lower = entry.name.toLowerCase()
      if (lower.includes('homepage') || lower.includes('hero')) {
        heroImagePath = fullPath
      } else if (!heroImagePath) {
        heroImagePath = fullPath
      }
    }
  }

  return { productFolders, heroImagePath }
}
