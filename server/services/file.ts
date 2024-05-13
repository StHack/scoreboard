import { getFile } from 'db/FIleDb.js'
import { IRouter } from 'express'

export function registerFileEndpoint(app: IRouter) {
  app.get<string, { id: string }>('/api/content/:id', async (req, res) => {
    const file = await getFile(req.params.id)
    if (!file) {
      res.sendStatus(404)
      return
    }

    res.set('Content-Type', file.contentType)
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, immutable')

    res.send(file.content.buffer)
  })
}
