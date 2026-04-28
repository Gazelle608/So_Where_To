import fs from 'fs'
import path from 'path'

const src = path.resolve('Frontend', 'dist')
const dest = path.resolve('dist')

if (!fs.existsSync(src)) {
  console.error('Frontend/dist not found. Make sure the build completed successfully.')
  process.exit(1)
}

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true })
}

fs.renameSync(src, dest)
console.log('Moved Frontend/dist to root dist')
