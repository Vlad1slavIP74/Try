import { push } from 'react-router-redux'
import { toUrlWithQueryParams } from 'common/modules/url'
import {
	takeLatest,
	call,
	put
} from 'redux-saga/effects'

import {
	GET_BETS_REQUEST,
	GET_BETS_SUCCESS,
	GET_BETS_FAILURE,
	CREATE_BET_REQUEST,
	CREATE_BET_SUCCESS,
	CREATE_BET_FAILURE,
	JOIN_BET_REQUEST,
	JOIN_BET_SUCCESS,
	JOIN_BET_FAILURE,
	CLOSE_BET_REQUEST,
	CLOSE_BET_SUCCESS,
	CLOSE_BET_FAILURE
} from 'common/constants/bets'

import { JOIN_BET_OPEN } from 'common/constants/layout'

import { MESSAGE } from 'common/constants/message'

import { RENEW_TOKEN_REQUEST } from 'common/constants/auth'

import {
	getBets,
	getBetsByOne,
	createBet,
	joinBet,
	closeBet
} from 'common/api'

import { getSecretToken } from 'common/modules/auth'

function * getBetsFlow ({ data }) {
	try {
		const { status, bets, pagination, searchByBet } = yield call(data.b_id ? getBetsByOne : getBets, data)

		if (status === 403) {
			return yield put({
				type: GET_BETS_FAILURE,
				data: [],
				pagination: null
			})
		}

		yield put({
			type: GET_BETS_SUCCESS,
			data: bets,
			pagination
		})

		if (searchByBet) {
		 yield put(push(toUrlWithQueryParams(location.pathname, searchByBet.urlParams)))
		 yield put({
				type: JOIN_BET_OPEN,
				data: searchByBet.betData
			})
		}
	} catch (err) {
		console.log(err)
	}
}

function * createBetFlow ({ data, headers }) {
	const { status, message } = yield call(createBet, data, headers)

	if (status === 403) {
		return yield put({
			type: CREATE_BET_FAILURE,
			message
		})
	}

	yield put({
		type: CREATE_BET_SUCCESS,
		message
	})

	// UPDATE USER ACCOUNT DATA
	yield put({
		type: RENEW_TOKEN_REQUEST,
		data: {
			token: getSecretToken()
		},
		headers: {
			Authorization: `user ${getSecretToken()}`
		}
	})

	// ADD MESSAGE NOTIFICATION
	yield put({
		type: MESSAGE,
		payload: {
			text: message
		}
	})
}

function * joinBetFlow ({ data, headers }) {
	const { status, message } = yield call(joinBet, data, headers)

	if (status === 403) {
		return yield put({
			type: JOIN_BET_FAILURE,
			message
		})
	}

	yield put({
		type: JOIN_BET_SUCCESS,
		message
	})

	// UPDATE USER ACCOUNT DATA
	yield put({
		type: RENEW_TOKEN_REQUEST,
		data: {
			token: getSecretToken()
		},
		headers: {
			Authorization: `user ${getSecretToken()}`
		}
	})

	// ADD MESSAGE NOTIFICATION
	yield put({
		type: MESSAGE,
		payload: {
			text: 'Вы успешно поставили против'
		}
	})
}

function * closeBetFlow ({ data, headers }) {
	const { status, message } = yield call(closeBet, data, headers)

	if (status === 403) {
		return yield put({
			type: CLOSE_BET_FAILURE,
			message
		})
	}

	yield put({
		type: CLOSE_BET_SUCCESS,
		message
	})
}

function * authWatcher () {
	yield takeLatest(GET_BETS_REQUEST, getBetsFlow)
	yield takeLatest(CREATE_BET_REQUEST, createBetFlow)
	yield takeLatest(JOIN_BET_REQUEST, joinBetFlow)
	yield takeLatest(CLOSE_BET_REQUEST, closeBetFlow)
}

export default authWatcher
