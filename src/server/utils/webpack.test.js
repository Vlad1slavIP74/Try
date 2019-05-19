import { readFileSync } from 'fs'
import { getAssets } from './webpack'

jest.mock('fs')

describe('getAssets', () => {
  it('should read webpack assets in production', async () => {
    readFileSync.mockImplementation(() => '{ "main": { "js": "/main.js" } }')
    const assets = await getAssets({
      environment: 'production',
      publicPath: '/public',
    })
    expect(readFileSync).toBeCalledWith(
      '/public/dist/webpack-assets.json',
      'utf-8',
    )
    expect(assets).toEqual({ main: { js: '/main.js' } })
  })
})
