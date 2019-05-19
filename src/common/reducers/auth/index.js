import jwtDecode from 'jwt-decode'
import { LOCATION_CHANGE } from 'react-router-redux'
import {
	OPEN_AUTH_FORM,
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
	UPDATE_PROFILE_PASSWORD_SUCCESS
} from 'common/constants/auth'

const initialState = {
	loading: false,
	loaded: false,
	message: null,
	error: false,
	user: {},
	openModal: false
}

export function auth (state = initialState, action) {
	const { response, message, token } = action

	switch (action.type) {
	// LOCATION CHANGE DO NOTHING
	case LOCATION_CHANGE:
		return {
			...state,
			loading: false,
			loaded: false,
			message: null,
			error: false
		}

	// OPEN / CLOSE auth form
	case OPEN_AUTH_FORM:
		return {
			...state,
			openModal: true
		}
	case CLOSE_AUTH_FORM:
		return {
			...state,
			openModal: false
		}

	// SIGNUP
	case SIGNUP_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case SIGNUP_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			message
		}
	case SIGNUP_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

		// LOGIN
	case LOGIN_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case LOGIN_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			message,
			user: jwtDecode(token)
		}
	case LOGIN_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

		// LOGOUT
	case LOGOUT_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case LOGOUT_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			user: {},
			message
		}
	case LOGOUT_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

		// RESET PASSWORD
	case RESTORE_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case RESTORE_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			message
		}
	case RESTORE_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

		// LOGIN WITH NEW PASSWORD
	case LOGIN_NEW_PASSWORD_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case LOGIN_NEW_PASSWORD_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			user: jwtDecode(token),
			message
		}
	case LOGIN_NEW_PASSWORD_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

		// VERIFY ACCOUNT
	case VERIFY_ACCOUNT_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case VERIFY_ACCOUNT_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			message,
			user: jwtDecode(token)
		}
	case VERIFY_ACCOUNT_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

	// RENEW TOKEN ACCOUNT
	case RENEW_TOKEN_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case RENEW_TOKEN_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			message,
			user: jwtDecode(token)
		}
	case RENEW_TOKEN_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

	// UPDATE PROFILE INFO
	case UPDATE_PROFILE_INFO_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case UPDATE_PROFILE_INFO_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			message,
			user: jwtDecode(token)
		}
	case UPDATE_PROFILE_INFO_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

	// UPDATE PROFILE INFO
	case UPDATE_PROFILE_PASSWORD_REQUEST:
		return {
			...state,
			loading: true,
			loaded: false
		}
	case UPDATE_PROFILE_PASSWORD_SUCCESS:
		return {
			...state,
			loading: false,
			loaded: true,
			error: false,
			message,
			user: jwtDecode(token)
		}
	case UPDATE_PROFILE_PASSWORD_FAILURE:
		return {
			...state,
			loading: false,
			loaded: false,
			error: true,
			message
		}

	default:
		return state
	}
}
