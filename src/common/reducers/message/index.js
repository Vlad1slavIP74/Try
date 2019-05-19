// @flow
import _ from 'lodash'

import {
	MESSAGE_ADD,
	MESSAGE_REMOVE
} from 'common/constants/message'

const initialState = {
	list: []
}

const MESSAGES_LIMIT = 4

const sliceMessageIfLimit = (messages, new_message) => {
	return _.concat(messages.length >= MESSAGES_LIMIT ? _.tail(messages) : messages, new_message)
}

export function message (state = initialState, { type, payload }) {
	switch (type) {
	case MESSAGE_ADD: {
		return { ...state, list: sliceMessageIfLimit(state.list, payload) }
	}

	case MESSAGE_REMOVE: {
		return { ...state, list: _.filter(state.list, item => item.id !== payload) }
	}

	default:
		return state
	}
}
