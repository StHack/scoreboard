import { FileContent } from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<FileContent>({
  name: { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  content: { type: Buffer, required: true },
})

const FileModel = model<FileContent>('File', schema)

export async function createFile(file: FileContent): Promise<FileContent> {
  const existing = await FileModel.findOne({ name: file.name })
  if (existing) {
    return existing.toObject(
      removeMongoPropertiesWithOptions({ removeId: true }),
    )
  }

  const doc = new FileModel(file)
  await doc.save()

  return doc.toObject(removeMongoPropertiesWithOptions({ removeId: true }))
}

export async function getFile(name: string): Promise<FileContent | undefined> {
  const doc = await FileModel.findOne({ name })
  return doc?.toObject(removeMongoPropertiesWithOptions({ removeId: true }))
}
