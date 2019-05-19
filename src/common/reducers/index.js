// @flow
import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import {layout} from './layout'
import {message} from './message'
import {bets} from './bets'
import {auth} from './auth'

// Root reducer
export default combineReducers({
	layout,
	message,
	bets,
	auth,
	routing: routerReducer
})
