import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Always load server/.env, even when Node/PM2 is started from the repository root.
// Existing deployment environment variables keep priority because override is false.
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
