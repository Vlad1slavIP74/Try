import { readFileSync } from 'fs'
import { join } from 'path'

export function getAssets({ publicPath }) {
  const json = readFileSync(
    join(publicPath, 'dist/webpack-assets.json'),
    'utf-8',
  )
  return JSON.parse(json)
}
