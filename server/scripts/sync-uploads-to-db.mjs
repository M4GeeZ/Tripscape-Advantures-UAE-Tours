// Copies every image in server/uploads into the shared MongoDB upload store,
// so images uploaded on this computer also show on the live site (Vercel / VPS).
// Safe to run more than once: images already in the database are skipped.
//
//   cd server
//   npm run uploads:sync
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'
import '../src/config/env.js'
import { UPLOAD_NAME, saveUpload } from '../src/utils/uploadStore.js'

const uploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads')

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set in server/.env')
  process.exit(1)
}

await mongoose.connect(process.env.MONGO_URI)
const files = (await fs.readdir(uploadsDir).catch(() => [])).filter((name) => UPLOAD_NAME.test(name))
let added = 0
for (const name of files) {
  if (await saveUpload(name, await fs.readFile(path.join(uploadsDir, name)))) {
    added += 1
    console.log('added  ', name)
  } else {
    console.log('exists ', name)
  }
}
console.log(`Done: ${added} added, ${files.length - added} already in the database.`)
await mongoose.disconnect()
