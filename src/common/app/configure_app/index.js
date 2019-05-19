// @flow
// Redux stuff
import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose} from 'redux'
import {routerMiddleware} from 'react-router-redux'
import promiseMiddleware from 'redux-promise-middleware'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

// Application
import rootReducer from 'reducers'
import {history} from 'routing'
import IndexSagas from 'common/sagas'

const sagaMiddleware = createSagaMiddleware()
//
/**
 * Configure application store
 * @param  {Object} initialState - preloadedState
 * @return {Object} - configured store
 */
const configureStore = (initialState: Object) => {
	// ONLY FOR DEVELOPMENT IF NEED TO LOG REDUX
	// const middlewares = [sagaMiddleware, logger, thunk, routerMiddleware(history), promiseMiddleware()]
	const middlewares = [sagaMiddleware, thunk, routerMiddleware(history), promiseMiddleware()]
	const enhancers = middlewares.map(a => applyMiddleware(a))

	const getComposeFunc = () => {
		if (process.env.NODE_ENV === 'development') {
			const {composeWithDevTools} = require('redux-devtools-extension')
			return composeWithDevTools
		}
		return compose
	}

	const composeFunc = getComposeFunc()
	const composedEnhancers = composeFunc.apply(null, enhancers)

	return createStore(rootReducer, initialState, composedEnhancers)
}

/**
 * Return configured history, routes and store
 * @param  {Object} initialState
 * @return {Object} Object containting configured store, routes, history
 */
export default (initialState: Object) => {
	const store = configureStore(initialState)
	sagaMiddleware.run(IndexSagas)

	return {
		store,
		history
	}
}
