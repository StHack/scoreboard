import { copyFile, mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BACKUPS_DIR = resolve(__dirname, '../../../backups')
const PUBLIC_DIR = resolve(__dirname, '../../public/backups')
const PUBLIC_FILES_DIR = resolve(__dirname, '../../public/api/content')

async function copyJsonFiles(srcDir: string, destDir: string) {
  const entries = await readdir(srcDir, { withFileTypes: true })
  await mkdir(destDir, { recursive: true })

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name)
    const destPath = join(destDir, entry.name)

    if (entry.isDirectory()) {
      await copyJsonFiles(srcPath, destPath)
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      if (entry.name === 'files.json') {
        await extractFilesFromJson(srcPath)
      } else {
        await copyFile(srcPath, destPath)
      }
    }
  }
}

async function extractFilesFromJson(srcPath: string) {
  await mkdir(PUBLIC_FILES_DIR, { recursive: true })
  const data = await readFile(srcPath)
  const parsed = JSON.parse(data.toString('utf-8')) as JsonFile[]

  for (const row of parsed) {
    const buf = Buffer.from(row.content.$binary.base64, 'base64')
    await writeFile(join(PUBLIC_FILES_DIR, row.name), buf)
  }
}

try {
  await copyJsonFiles(BACKUPS_DIR, PUBLIC_DIR)
  console.log('All JSON files copied successfully.')
} catch (error) {
  console.error('Error copying JSON files:', error)
  process.exit(1)
}

type JsonFile = {
  name: string
  contentType: string
  content: {
    $binary: {
      base64: string
    }
  }
}
