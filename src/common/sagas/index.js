import { all } from 'redux-saga/effects'
import RouterSaga from './router'
import LayoutSaga from './layout'
import AuthSaga from './auth'
import BetsSaga from './bets'
import MessageSaga from './message'

export default function * IndexSaga () {
	yield all([
		LayoutSaga(),
		AuthSaga(),
		BetsSaga(),
		MessageSaga(),
		RouterSaga()
	])
}
