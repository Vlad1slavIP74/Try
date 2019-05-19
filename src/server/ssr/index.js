/**
 * @flow
 * @desc
 */
import React from 'react'
import Helmet from 'react-helmet'
import {renderToString} from 'react-dom/server'
import {matchPath} from 'react-router'
import {ServerStyleSheet, StyleSheetManager} from 'styled-components'
import Cookies from 'universal-cookie'
import {AsyncComponentProvider, createAsyncContext} from 'react-async-component'
import {configureRootComponent, configureApp} from 'common/app'
import asyncBootstrapper from 'react-async-bootstrapper'
import HTMLComponent from './HTMLComponent'
import getI18nData from 'server/i18n'
import {getRouterRoutes} from 'routing'
import getAssets from './stats'
import jwtDecode from 'jwt-decode'

import { TOKEN_NAME } from 'common/constants/auth'

export default async (req: express$Request, res: express$Response) => {
	const cookies = new Cookies(req.headers.cookie)

	const userToken = cookies.get(TOKEN_NAME)
	const assets = await getAssets()
	// const {language} = req.user
	const initialState: Object = {}
	// const i18n = getI18nData(language)
	const i18n = getI18nData('ru')
	const sheet = new ServerStyleSheet()
	const location: string = req.url
	const context = {}
	const {store, history} = configureApp(initialState)
	const RootComponent: React$Node = configureRootComponent({
		store,
		history,
		i18n,
		SSR: {location, context}
	})
	const asyncContext = createAsyncContext()

	const app = (
		<AsyncComponentProvider asyncContext={asyncContext}>
			<StyleSheetManager sheet={sheet.instance}>{RootComponent}</StyleSheetManager>
		</AsyncComponentProvider>
	)

	const routes = getRouterRoutes()
	// if true - > throw 404, if match found -> 200
	const noRequestURLMatch = !routes.filter(r => !!r.path).find(r => matchPath(req.url, r))

	asyncBootstrapper(app).then(() => {
		const renderedApp = renderToString(app)
		const helmet = Helmet.renderStatic()
		const css: string = sheet.getStyleTags()
		let preloadedState: Object = store.getState()

		preloadedState.auth.user = userToken ? jwtDecode(cookies.get(TOKEN_NAME)) : {}

		const responseStatusCode = noRequestURLMatch ? 404 : 200
		const asyncState = asyncContext.getState()
		const props = {
			css,
			assets,
			asyncState,
			initialState: preloadedState,
			app: renderedApp,
			i18n,
			helmet
		}

		res.status(responseStatusCode).send(HTMLComponent(props))
	})
}
