import fs from 'fs/promises'
import path from 'path'
import type { File } from 'payload'

const MIMETYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

/**
 * Read a local file and return the shape expected by payload.create({ collection: 'media', file })
 */
export async function readLocalFile(filePath: string): Promise<File> {
  const data = await fs.readFile(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mimetype = MIMETYPES[ext] ?? 'image/jpeg'
  const name = path.basename(filePath)

  return {
    name,
    data: Buffer.from(data),
    mimetype,
    size: data.byteLength,
  }
}
