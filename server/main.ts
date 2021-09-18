import express from 'express'
import { config } from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  config()
}

const app = express()
const PORT = 8000

app.get('/', (req, res) => res.send('Express + TypeScript Server'))

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
