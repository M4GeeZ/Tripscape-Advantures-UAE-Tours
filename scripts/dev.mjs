import { spawn } from 'node:child_process'
import http from 'node:http'

const children = new Set()
let shuttingDown = false

function spawnNpm(args) {
  // When this runner is started through `npm run dev`, npm exposes the
  // exact npm CLI script in npm_execpath. Running it through the current
  // Node executable avoids Windows' `spawn EINVAL` problem with npm.cmd.
  const npmExecPath = process.env.npm_execpath

  let command
  let commandArgs
  let useShell = false

  if (npmExecPath) {
    command = process.execPath
    commandArgs = [npmExecPath, ...args]
  } else if (process.platform === 'win32') {
    // Safe fallback for directly running `node scripts/dev.mjs` on Windows.
    command = 'npm'
    commandArgs = args
    useShell = true
  } else {
    command = 'npm'
    commandArgs = args
  }

  const child = spawn(command, commandArgs, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    windowsHide: false,
    shell: useShell,
  })

  children.add(child)
  child.once('exit', () => children.delete(child))
  child.once('error', (error) => {
    console.error('[Tripscape] Could not start npm child process:', error)
    children.delete(child)
    stopChildren(1)
  })

  return child
}

function healthCheck() {
  return new Promise((resolve) => {
    const request = http.get(
      'http://127.0.0.1:5000/api/bookings/health',
      { timeout: 1000 },
      (response) => {
        response.resume()
        resolve(response.statusCode >= 200 && response.statusCode < 500)
      },
    )

    request.on('timeout', () => {
      request.destroy()
      resolve(false)
    })
    request.on('error', () => resolve(false))
  })
}

async function waitForBackend(timeoutMs = 20000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (await healthCheck()) return true
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  return false
}

function stopChildren(exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true

  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM')
  }

  setTimeout(() => process.exit(exitCode), 300).unref()
}

process.on('SIGINT', () => stopChildren(0))
process.on('SIGTERM', () => stopChildren(0))

console.log('[Tripscape] Starting booking API first...')
const server = spawnNpm(['run', 'dev', '--prefix', 'server'])

server.once('exit', (code) => {
  if (!shuttingDown) {
    console.error(
      `[Tripscape] Booking API stopped before the frontend was ready (exit ${code ?? 'unknown'}).`,
    )
    stopChildren(code || 1)
  }
})

const backendReady = await waitForBackend()
if (!backendReady) {
  console.error(
    '[Tripscape] Booking API did not become healthy on http://127.0.0.1:5000 within 20 seconds.',
  )
  stopChildren(1)
} else {
  console.log('[Tripscape] Booking API is healthy. Starting Vite frontend...')
  const client = spawnNpm(['run', 'dev', '--prefix', 'client'])
  client.once('exit', (code) => {
    if (!shuttingDown) stopChildren(code || 0)
  })
}
