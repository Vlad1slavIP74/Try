// @flow
import axios from 'axios'
import { TOKEN_NAME } from '../constants/auth'
import { API_URL } from 'config'

// The API url that will be requested to authenticate

// const API_URL = 'http://localhost:3000/api/v1/'
// const API_URL = '/api/v1/'

const defaultHeaders = {
	Accept: 'application/json, text/plain, */*',
	'Content-Type': 'application/json'
}

const customHeaders = (headers) => {
	return Object.assign({}, defaultHeaders, headers)
}
// Simple helper function for creating a request using stuff
const createRequest = (url, method, headers, data) => {
	let params = null

	if (method === 'get') {
		params = data
	}

	const config = {
		baseURL: API_URL,
		url,
		method,
		headers,
		data,
		params
	}

	return axios(config)
	// Pipe the stuff
		.then(res => res.data)
		.catch((error) => {
			throw error
		})
}

/** ****** Account ********/

// Signup API request
export function signin (data) {
	return createRequest('/signin', 'post', defaultHeaders, data)
}

// Login API request
export function signup (data) {
	return createRequest('/signup', 'post', defaultHeaders, data)
}

// Signup API request
export function verify (data) {
	return createRequest('/verify', 'post', defaultHeaders, data)
}

// Restore account API request
export function resetPassword (data) {
	return createRequest('/restore', 'get', defaultHeaders, data)
}

// Login with new password account API request
export function loginNewPassword (data) {
	return createRequest('/restore/password', 'post', defaultHeaders, data)
}

// Change profile data API request
export function changeProfileData (data, headers) {
	return createRequest('/account/profile/update', 'post', customHeaders(headers), data)
}

// GET profile password API request
export function getProfilePassword (data, headers) {
	return createRequest('/account/profile/password', 'get', customHeaders(headers), data)
}

// Change profile password API request
export function changeProfilePassword (data, headers) {
	return createRequest('/account/profile/password/update', 'post', customHeaders(headers), data)
}

// GET actual data user API request
export function renewToken (data, headers) {
	return createRequest('/account/renew-token', 'post', customHeaders(headers), data)
}

// POST user deposit API request
export function makeDeposit (data, headers) {
	return createRequest('/account/deposit', 'post', customHeaders(headers), data)
}

// POST user cashout API request
export function cashout (data, headers) {
	return createRequest('/account/cashout', 'post', customHeaders(headers), data)
}

// GET bets user history API request
export function getUserBetsHistory (data, headers) {
	return createRequest('/account/history/bets', 'get', customHeaders(headers), data)
}

// INTERKASSA: cashout request
export function InterKassaCashout (data, headers) {
	console.log('api/index 108')
	console.log(data)
	console.log(customHeaders(headers))

	return createRequest('/interkassa/cashout', 'post', customHeaders(headers), data)
}

/** ****** BETS ********/

// GetBets API request
export function getBets (data) {
	return createRequest('/bets', 'get', defaultHeaders, data)
}
// getBetsByOne API request
export function getBetsByOne ({ b_id }) {
	return createRequest(`/bets/${b_id}`, 'get', defaultHeaders, null)
}

// CreateBet API request
export function createBet (data, headers) {
	return createRequest('/bets/create', 'post', customHeaders(headers), data)
}

// JoinBet API request
export function joinBet (data, headers) {
	return createRequest('/bets/join', 'post', customHeaders(headers), data)
}

// ADMIN FUNCTIONS
/******************/

// Update bet status API request
export function getBetsNotSelectedWinner (data, headers) {
	return createRequest('/bets/status/not-selected-winner', 'get', customHeaders(headers))
}

// Update bet status API request
export function getBetsNotConfirmed (data, headers) {
	return createRequest('/bets/status/not-confirmed', 'get', customHeaders(headers))
}

// Update bet status API request
export function adminConfirmBet (data, headers) {
	return createRequest('/bets/admin/confirm', 'post', customHeaders(headers), data)
}

// Close bet API request
export function adminCloseBet (data, headers) {
	return createRequest('/bets/admin/close', 'post', customHeaders(headers), data)
}

// Change bet API request
export function adminChangeBet (data, headers) {
	return createRequest('/bets/admin/change', 'post', customHeaders(headers), data)
}
