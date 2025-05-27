import { copyFile, mkdir, readdir } from 'fs/promises'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BACKUPS_DIR = resolve(__dirname, '../../../backups')
const PUBLIC_DIR = resolve(__dirname, '../../public/backups')

async function copyJsonFiles(srcDir: string, destDir: string) {
  const entries = await readdir(srcDir, { withFileTypes: true })
  await mkdir(destDir, { recursive: true })

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name)
    const destPath = join(destDir, entry.name)

    if (entry.isDirectory()) {
      await copyJsonFiles(srcPath, destPath)
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      await copyFile(srcPath, destPath)
    }
  }
}

try {
  await copyJsonFiles(BACKUPS_DIR, PUBLIC_DIR)
  console.log('All JSON files copied successfully.')
} catch (error) {
  console.error('Error copying JSON files:', error)
  process.exit(1)
}
