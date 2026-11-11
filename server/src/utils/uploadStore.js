import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'

/*
  Admin uploads are written to server/uploads AND to MongoDB (GridFS bucket "uploads").
  The database is shared by every server (local dev, VPS), so an image uploaded on one
  server can still be served by another one that does not have the file on disk.
*/
const BUCKET = 'uploads'
export const UPLOAD_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp|gif)$/i

const CONTENT_TYPES = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }

const dbReady = () => mongoose.connection.readyState === 1
const bucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: BUCKET })

export function contentTypeFor(filename) {
  return CONTENT_TYPES[String(filename).split('.').pop().toLowerCase()] || 'application/octet-stream'
}

export async function uploadExists(filename) {
  if (!dbReady()) return false
  return Boolean(await mongoose.connection.db.collection(`${BUCKET}.files`).findOne({ filename }, { projection: { _id: 1 } }))
}

// Stores a file in the database copy. Skips names that are already stored.
export async function saveUpload(filename, buffer) {
  if (!dbReady() || await uploadExists(filename)) return false
  await new Promise((resolve, reject) => {
    const stream = bucket().openUploadStream(filename, { contentType: contentTypeFor(filename) })
    stream.on('error', reject)
    stream.on('finish', resolve)
    stream.end(buffer)
  })
  return true
}

/*
  Public image URLs: /api/media/<id> (no file extension).
  The live nginx serves every *.jpg / *.png / *.webp URL from the website's static folder,
  so /api/uploads/<id>.jpg never reaches this server there. A URL without an extension
  always does. Stored values keep their original form; they are converted when sent out.
*/
const UPLOADS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')
const MEDIA_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
const STORED_UPLOAD = /^(?:\/api)?\/uploads\/([a-f0-9-]{36})\.(?:jpg|png|webp|gif)$/i
const EXTENSIONS = ['jpg', 'png', 'webp', 'gif']

export function publicMediaUrl(value) {
  const source = String(value || '').trim()
  const match = source.match(STORED_UPLOAD)
  return match ? `/api/media/${match[1]}` : source
}

// Same conversion for <img src="..."> / links inside blog HTML.
export function publicMediaHtml(html) {
  return String(html || '').replace(/(["'(])(?:\/api)?\/uploads\/([a-f0-9-]{36})\.(?:jpg|png|webp|gif)/gi, '$1/api/media/$2')
}

// GET /api/media/:id -> the upload from this server's disk, or the shared database copy.
export async function serveMedia(req, res, next) {
  const id = String(req.params.id || '')
  if (!MEDIA_ID.test(id)) return next()
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')

  for (const ext of EXTENSIONS) {
    const file = path.join(UPLOADS_DIR, `${id}.${ext}`)
    if (fs.existsSync(file)) {
      res.setHeader('Content-Type', contentTypeFor(file))
      return res.sendFile(file)
    }
  }

  if (!dbReady()) return res.status(404).json({ message: 'Image not found.' })
  const stored = await mongoose.connection.db.collection(`${BUCKET}.files`)
    .findOne({ filename: { $in: EXTENSIONS.map((ext) => `${id}.${ext}`) } }, { projection: { filename: 1 } })
    .catch(() => null)
  if (!stored) return res.status(404).json({ message: 'Image not found.' })
  res.setHeader('Content-Type', contentTypeFor(stored.filename))
  bucket().openDownloadStreamByName(stored.filename)
    .on('error', () => (res.headersSent ? res.end() : res.status(404).json({ message: 'Image not found.' })))
    .pipe(res)
}

// Express handler: serves /api/uploads/<name> from the database when the file is not on disk.
export async function serveUploadFromDb(req, res, next) {
  const name = String(req.params.name || '')
  if (!UPLOAD_NAME.test(name) || !(await uploadExists(name).catch(() => false))) return next()
  res.setHeader('Content-Type', contentTypeFor(name))
  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
  bucket().openDownloadStreamByName(name)
    .on('error', () => (res.headersSent ? res.end() : next()))
    .pipe(res)
}
