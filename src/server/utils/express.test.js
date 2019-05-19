import express from 'express'
import request from 'supertest'
import { asyncMiddleware } from './express'

describe('asyncMiddleware', () => {
  it('should handle errors', async () => {
    const app = express()
    app.get(
      '/',
      asyncMiddleware(async () => {
        throw new Error('Oups')
      }),
    )

    const response = await request(app).get('/')
    expect(response.status).toBe(500)
  })

  it('should give access to req and res', async () => {
    const app = express()
    app.get(
      '/',
      asyncMiddleware(async (req, res) => {
        res.send(req.url)
      }),
    )

    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('/')
  })
})
