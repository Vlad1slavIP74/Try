import {
	OPEN_AUTH_FORM,
	CLOSE_AUTH_FORM,
	LOGIN_REQUEST,
	SIGNUP_REQUEST,
	LOGOUT_REQUEST,
	RESTORE_REQUEST,
	LOGIN_NEW_PASSWORD_REQUEST,
	VERIFY_ACCOUNT_REQUEST,
	RENEW_TOKEN_REQUEST,
	UPDATE_PROFILE_INFO_REQUEST,
	UPDATE_PROFILE_PASSWORD_REQUEST
} from 'common/constants/auth'

export function openAuthForm () {
	return {
		type: OPEN_AUTH_FORM
	}
}

export function closeAuthForm () {
	return {
		type: CLOSE_AUTH_FORM
	}
}

export function loginRequest (data) {
	return {
		type: LOGIN_REQUEST,
		data
	}
}

export function signupRequest (data) {
	return {
		type: SIGNUP_REQUEST,
		data
	}
}

export function logoutRequest () {
	return {
		type: LOGOUT_REQUEST
	}
}

export function restorePasswordByEmailRequest (data) {
	return {
		type: RESTORE_REQUEST,
		data
	}
}

export function restorePasswordConfirmRequest (data) {
	return {
		type: LOGIN_NEW_PASSWORD_REQUEST,
		data
	}
}

export function verifyAccountRequest (data) {
	return {
		type: VERIFY_ACCOUNT_REQUEST,
		data
	}
}

export function renewTokenRequest (data, headers) {
	return {
		type: RENEW_TOKEN_REQUEST,
		data,
		headers
	}
}

export function updateProfileInfoRequest (data, headers) {
	return {
		type: UPDATE_PROFILE_INFO_REQUEST,
		data,
		headers
	}
}

export function updateProfilePasswordRequest (data, headers) {
	return {
		type: UPDATE_PROFILE_PASSWORD_REQUEST,
		data,
		headers
	}
}
