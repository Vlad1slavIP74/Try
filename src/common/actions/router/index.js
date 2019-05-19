import {
	REDIRECT
} from 'common/constants/router'

export function redirectRequest ({ to, next }) {
	return {
		type: REDIRECT,
		to,
		next
	}
}
