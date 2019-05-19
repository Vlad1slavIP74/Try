import { takeEvery, put, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { MESSAGE, MESSAGE_ADD, MESSAGE_REMOVE } from 'common/constants/message'

const next = (() => {
	let n = 0
	return () => n++
})()

function * handleMessage ({ payload }) {
	const id = next()

	yield put({ type: MESSAGE_ADD, payload: { id, text: payload.text, title: payload.title, error: payload.error } })
	yield call(delay, 20000)
	yield put({ type: MESSAGE_REMOVE, payload: id })
}

function * authWatcher () {
	yield takeEvery(MESSAGE, handleMessage)
}

export default authWatcher
