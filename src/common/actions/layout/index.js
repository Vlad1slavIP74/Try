import {
	CREATE_BET_OPEN,
	JOIN_BET_OPEN,
	BET_FORM_CLOSE,
	SIDEBAR_OPEN,
	SIDEBAR_CLOSE,
	CHANGE_COLOR_MODE
} from 'common/constants/layout'

export function openCreateBetForm () {
	return {
		type: CREATE_BET_OPEN
	}
}

export function openJoinBetForm (data) {
	return {
		type: JOIN_BET_OPEN,
		data
	}
}

export function closeBetForm () {
	return {
		type: BET_FORM_CLOSE
	}
}

export function openSideBar () {
	return {
		type: SIDEBAR_OPEN
	}
}

export function closeSideBar () {
	return {
		type: SIDEBAR_CLOSE
	}
}

export function switchColorMode () {
	return {
		type: CHANGE_COLOR_MODE
	}
}
