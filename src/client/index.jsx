// @flow
// Styles
// If you want full SUI CSS:
// import 'semantic-ui-css/semantic.css'
// If you want only some components from SUI:

import 'styling/semantic.less'

// babel polyfill (ie 10-11) + fetch polyfill
import 'babel-polyfill'
import 'isomorphic-fetch'
// Application
import React from 'react'
import {hydrate} from 'react-dom'
import {AsyncComponentProvider} from 'react-async-component'
import asyncBootstrapper from 'react-async-bootstrapper'
import {configureApp, configureRootComponent} from 'common/app'
import {AppContainer} from 'react-hot-loader'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'

moment.locale('ru')
momentLocalizer()

if (process.env.NODE_ENV === 'production') {
	require('common/pwa')
}

const initialState = window.__INITIAL_STATE__ || {}
const i18n = window.__I18N__ || {}
const asyncState = window.__ASYNC_STATE__ || {}

const {store, routes, history} = configureApp(initialState)
const RootComponent = configureRootComponent({
	store,
	routes,
	history,
	i18n
})

const app = (
	<AppContainer warnings={false}>
		<AsyncComponentProvider rehydrateState={asyncState}>
			{RootComponent}
		</AsyncComponentProvider>
	</AppContainer>
)

asyncBootstrapper(app, false, { asyncBootstrapPhase: true }).then(() => {
	// console.log('__INITIAL_STATE__:', initialState)
	hydrate(app, document.getElementById('app'))
})

if (module.hot) {
	module.hot.accept()
}
