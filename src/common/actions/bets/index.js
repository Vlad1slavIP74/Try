import {
	GET_BETS_REQUEST,
	CREATE_BET_REQUEST,
	JOIN_BET_REQUEST,
	CLOSE_BET_REQUEST
} from 'common/constants/bets'

export function getBetsRequest (data) {
	return {
		type: GET_BETS_REQUEST,
		data
	}
}

export function getBetsByOneRequest (data) {
	return {
		type: GET_BETS_REQUEST,
		data
	}
}

export function createBetRequest (data, headers) {
	return {
		type: CREATE_BET_REQUEST,
		data,
		headers
	}
}

export function joinBetRequest (data, headers) {
	return {
		type: JOIN_BET_REQUEST,
		data,
		headers
	}
}

export function closeBetRequest (data, headers) {
	return {
		type: CLOSE_BET_REQUEST,
		data,
		headers
	}
}
