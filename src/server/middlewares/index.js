/**
 * @file add global middlewares for app
 * @flow
 */
import express from 'express'
import path from 'path'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import Raven from 'raven'
import languageMiddleware from './language'

export default (app: express$Application): express$Application => {
	Raven.config(process.env.SENTRY_DSN).install()
	// The request handler must be the first middleware on the app
	app.use(Raven.requestHandler())
	// remove x-powered-by
	// app.disable('x-powered-by')
	// Add express stuff
	app.use(helmet())
	app.use(compression())
	app.use(morgan('dev'))
	app.use(cookieParser())
	app.use(
		express.static(process.env.CLIENT_STATIC_PATH, {
			index: false
		})
	)
	app.use(
	  express.static(path.join(__dirname, '../../../static'), {
	    immutable: true,
	    maxage: 31536000000
	  })
	)
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended: true}))
	// app.use(languageMiddleware)
	// The error handler must be before any other error middleware
	app.use(Raven.errorHandler())

	// START crontab tasks
	require('./crontab')

	return app
}
