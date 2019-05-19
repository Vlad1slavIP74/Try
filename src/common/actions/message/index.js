import {
	MESSAGE_REMOVE
} from 'common/constants/message'

export function closeMessage (id) {
	return {
		type: MESSAGE_REMOVE,
		payload: id
	}
}
