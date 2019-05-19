// @flow
import _ from 'lodash'

import {
	CREATE_BET_OPEN,
	JOIN_BET_OPEN,
	BET_FORM_CLOSE,
	SIDEBAR_OPEN,
	SIDEBAR_CLOSE,
	CHANGE_COLOR_MODE
} from 'common/constants/layout'

export const initialState = {
	darkMode: false,
	sideBarOpen: false,
	betFormOpen: false,
	betFormCreating: false,
	defaultBetData: {}
}

export function layout (state = initialState, { type, data }) {
	switch (type) {
	case CREATE_BET_OPEN:
		return {
			...state,
			betFormOpen: true,
			betFormCreating: true
		}

	case JOIN_BET_OPEN:
		return {
			...state,
			betFormOpen: true,
			betFormCreating: false,
			defaultBetData: data
		}

	case BET_FORM_CLOSE:
		return {
			...state,
			betFormOpen: false,
			defaultBetData: {}
		}

	case SIDEBAR_OPEN:
		return {
			...state,
			sideBarOpen: true
		}

	case SIDEBAR_CLOSE:
		return {
			...state,
			sideBarOpen: false
		}

	case CHANGE_COLOR_MODE:
		return {
			...state,
			darkMode: !state.darkMode
		}

	default:
		return state
	}
}
