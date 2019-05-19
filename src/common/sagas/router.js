import { push } from 'react-router-redux'
import {
	takeLatest,
	call,
	put
} from 'redux-saga/effects'

import {
	REDIRECT
} from 'common/constants/router'

function * redirectFlow ({ to, next }) {
	yield put(push(`${to}?next=${next}`))
}

function * authWatcher () {
	yield takeLatest(REDIRECT, redirectFlow)
}

export default authWatcher
