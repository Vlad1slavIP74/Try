// @flow
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

export const initialState = {
	all: {
		loading: false,
		error: false,
		data: [],
		pagination: null
	},
	create: {
		loading: false,
		error: false
	},
	join: {
		loading: false,
		error: false
	}

}

export function bets (state = initialState, { type, data, pagination }) {
	switch (type) {
	// GET ALL BETS
	case GET_BETS_REQUEST:
		return {
			...state,
			all: {
				...state.all,
				loading: true,
				error: false
			}
		}

	case GET_BETS_SUCCESS:
		return {
			...state,
			all: {
				...state.all,
				loading: false,
				error: false,
				data,
				pagination
			}
		}

	case GET_BETS_FAILURE:
		return {
			...state,
			all: {
				...state.all,
				loading: false,
				error: true,
				data: [],
				pagination: null
			}
		}

	// CREATING BET
	case CREATE_BET_REQUEST:
		return {
			...state,
			create: {
				loading: true,
				error: false
			}
		}

	case CREATE_BET_SUCCESS:
		return {
			...state,
			create: {
				loading: false,
				error: false
			}
		}

	case CREATE_BET_FAILURE:
		return {
			...state,
			create: {
				loading: false,
				error: true
			}
		}

	// JOINING TO BET
	case JOIN_BET_REQUEST:
		return {
			...state,
			join: {
				loading: true,
				error: false
			}
		}

	case JOIN_BET_SUCCESS:
		return {
			...state,
			join: {
				loading: false,
				error: false
			}
		}

	case JOIN_BET_FAILURE:
		return {
			...state,
			join: {
				loading: false,
				error: true
			}
		}

  	default:
  		return state
	}
}
