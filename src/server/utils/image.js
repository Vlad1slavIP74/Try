import url from 'url'
import https from 'https'
import sizeOf from 'image-size'

const cache = {}

export async function getSize(imageUrl) {
  return new Promise((resolve, reject) => {
    if (cache[imageUrl]) {
      resolve(cache[imageUrl])
      return
    }

    const options = url.parse(imageUrl)

    https.get(options, response => {
      const chunks = []
      response
        .on('data', chunk => {
          chunks.push(chunk)
        })
        .on('end', () => {
          const buffer = Buffer.concat(chunks)
          const dimensions = sizeOf(buffer)
          cache[imageUrl] = dimensions
          resolve(dimensions)
        })
        .on('error', reject)
    })
  })
}
