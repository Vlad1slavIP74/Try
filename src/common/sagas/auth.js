import Cookies from 'universal-cookie'
import queryString from 'querystringify'
import { push } from 'react-router-redux'
import { delay } from 'redux-saga'
import {
	takeLatest,
	call,
	put
} from 'redux-saga/effects'

import {
	CLOSE_AUTH_FORM,
	SIGNUP_REQUEST,
	SIGNUP_SUCCESS,
	SIGNUP_FAILURE,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT_REQUEST,
	LOGOUT_SUCCESS,
	LOGOUT_FAILURE,
	RESTORE_REQUEST,
	RESTORE_SUCCESS,
	RESTORE_FAILURE,
	LOGIN_NEW_PASSWORD_REQUEST,
	LOGIN_NEW_PASSWORD_SUCCESS,
	LOGIN_NEW_PASSWORD_FAILURE,
	VERIFY_ACCOUNT_REQUEST,
	VERIFY_ACCOUNT_SUCCESS,
	VERIFY_ACCOUNT_FAILURE,
	RENEW_TOKEN_REQUEST,
	RENEW_TOKEN_SUCCESS,
	RENEW_TOKEN_FAILURE,
	UPDATE_PROFILE_INFO_REQUEST,
	UPDATE_PROFILE_INFO_SUCCESS,
	UPDATE_PROFILE_INFO_FAILURE,
	UPDATE_PROFILE_PASSWORD_REQUEST,
	UPDATE_PROFILE_PASSWORD_FAILURE,
	UPDATE_PROFILE_PASSWORD_SUCCESS,
	TOKEN_NAME,
	TOKEN_SECRET_NAME
} from 'common/constants/auth'

import {
	signup,
	signin,
	resetPassword,
	loginNewPassword,
	verify,
	renewToken,
	changeProfileData,
	changeProfilePassword
} from 'common/api'

import { MESSAGE } from 'common/constants/message'

const cookies = new Cookies()

function * signupFlow ({ data }) {
	const { status, message, publicToken, accessToken } = yield call(signup, data)

	if (status === 403) {
		return yield put({
			type: SIGNUP_FAILURE,
			message
		})
	}

	yield call(updateToken, publicToken, accessToken)
	yield put({
		type: SIGNUP_SUCCESS,
		message
	})

	yield call(delay, 5000)
	yield put({ type: CLOSE_AUTH_FORM })
}

function updateToken (publicToken, secretToken) {
	if (publicToken) {
		cookies.set(TOKEN_SECRET_NAME, secretToken, { path: '/' })
		cookies.set(TOKEN_NAME, publicToken, { path: '/' })
	} else {
		cookies.remove(TOKEN_SECRET_NAME, secretToken)
		cookies.remove(TOKEN_NAME, publicToken)
	}
}

function * loginFlow ({ data }) {
	const { next } = queryString.parse(location.search)
	const { status, message, publicToken, accessToken } = yield call(signin, data)

	if (status === 403) {
		return yield put({
			type: LOGIN_FAILURE,
			message
		})
	}

	yield call(updateToken, publicToken, accessToken)
	yield put({
		type: LOGIN_SUCCESS,
		message,
		token: publicToken
	})

	// ADD MESSAGE NOTIFICATION
	yield put({
		type: MESSAGE,
		payload: {
			text: `Вы успешно залогинились`
		}
	})

	yield call(delay, 1000)
	yield put({ type: CLOSE_AUTH_FORM })

	yield put(push(next || '/'))
}

function * logoutFlow () {
	try {
		const response = yield call(updateToken, null, null)
		yield put({
			type: LOGOUT_SUCCESS
		})

		// ADD MESSAGE NOTIFICATION
		yield put({
			type: MESSAGE,
			payload: {
				text: `Вы успешно вышли из аккаунта`
			}
		})
	} catch (error) {
		yield put({
			type: LOGOUT_FAILURE,
			error
		})
	}
}

function * restoreFlow ({ data }) {
	const { status, message, publicToken, accessToken } = yield call(resetPassword, data)

	if (status === 403) {
		return yield put({
			type: RESTORE_FAILURE,
			message
		})
	}

	yield call(updateToken, publicToken, accessToken)
	yield put({
		type: RESTORE_SUCCESS,
		message
	})
}

function * loginNewPasswordFlow ({ data }) {
	const { status, message, publicToken, accessToken } = yield call(loginNewPassword, data)

	if (status === 403) {
		return yield put({
			type: LOGIN_NEW_PASSWORD_FAILURE,
			message
		})
	}

	yield call(updateToken, publicToken, accessToken)
	yield put({
		type: LOGIN_NEW_PASSWORD_SUCCESS,
		message,
		token: publicToken
	})
	yield put({ type: CLOSE_AUTH_FORM })
}

function * verifyAccountFlow ({ data }) {
	const { status, message, publicToken, accessToken } = yield call(verify, data)

	if (status === 403) {
		return yield put({
			type: VERIFY_ACCOUNT_FAILURE,
			message
		})
	}

	yield call(updateToken, publicToken, accessToken)
	yield put({
		type: VERIFY_ACCOUNT_SUCCESS,
		message,
		token: publicToken
	})
}

function * renewTokenFlow ({ data, headers }) {
	const { status, message, publicToken, accessToken } = yield call(renewToken, data, headers)

	if (status === 403) {
		return yield put({
			type: RENEW_TOKEN_FAILURE,
			message
		})
	}

	yield call(updateToken, publicToken, accessToken)
	yield put({
		type: RENEW_TOKEN_SUCCESS,
		message,
		token: publicToken
	})
}

function * updateProfileInfoFlow ({ data, headers }) {
	const { status, message, publicToken, accessToken } = yield call(changeProfileData, data, headers)

	if (status === 403) {
		return yield put({
			type: UPDATE_PROFILE_INFO_FAILURE,
			message
		})
	}

	yield call(updateToken, publicToken, accessToken)
	yield put({
		type: UPDATE_PROFILE_INFO_SUCCESS,
		message,
		token: publicToken
	})

	// ADD MESSAGE NOTIFICATION
	yield put({
		type: MESSAGE,
		payload: {
			text: message
		}
	})
}

function * updateProfilePasswordFlow ({ data, headers }) {
	const { status, message, publicToken, accessToken } = yield call(changeProfilePassword, data, headers)

	// ADD MESSAGE NOTIFICATION
	yield put({
		type: MESSAGE,
		payload: {
			text: message
		}
	})

	if (status === 403) {
		return yield put({
			type: UPDATE_PROFILE_PASSWORD_FAILURE,
			message
		})
	}

	yield call(updateToken, publicToken, accessToken)
	yield put({
		type: UPDATE_PROFILE_PASSWORD_SUCCESS,
		message,
		token: publicToken
	})
}

function * authWatcher () {
	yield takeLatest(SIGNUP_REQUEST, signupFlow)
	yield takeLatest(LOGIN_REQUEST, loginFlow)
	yield takeLatest(LOGOUT_REQUEST, logoutFlow)
	yield takeLatest(RESTORE_REQUEST, restoreFlow)
	yield takeLatest(LOGIN_NEW_PASSWORD_REQUEST, loginNewPasswordFlow)
	yield takeLatest(VERIFY_ACCOUNT_REQUEST, verifyAccountFlow)
	yield takeLatest(RENEW_TOKEN_REQUEST, renewTokenFlow)
	yield takeLatest(UPDATE_PROFILE_INFO_REQUEST, updateProfileInfoFlow)
	yield takeLatest(UPDATE_PROFILE_PASSWORD_REQUEST, updateProfilePasswordFlow)
}

export default authWatcher
