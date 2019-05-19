/**
 * @flow
 * @file
 */
import 'babel-polyfill'
import express from 'express'
import cors from 'cors'
import fetch from 'isomorphic-fetch'
import addMiddlewares from './middlewares'
import API from './api'
import SSR from './ssr'
import authCheckMiddleware from './api/auth-check'
import toobusy from 'toobusy-js'

global.fetch = fetch

const app = express()

// 503 status if too much loaded
app.use(function (req, res, next) {
	// console.log(req.method)
	// console.log(req.headers)

	// проверяем состояние занятости - вызов toobusy() очень быстр,
	// так как состояние кэшируется на фиксированный интервал времени
	if (toobusy()) {
  	res.send(503, 'Простите, пожалуйста, сайт перегружен')
  	res.end()
	} else {
  	next()
	}
})

// Add global middlewares
addMiddlewares(app)

// Allow cors
app.use(cors())

// REST API
app.use('/api/v1', API.public)
app.use('/api/v1', authCheckMiddleware, API.private)

// Add SSR
app.use(SSR)

export default app
