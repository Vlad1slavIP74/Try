import io from 'socket.io-client'
import { BASIC_URL } from 'config'

import { MESSAGE } from 'common/constants/message'

const Socket = {

	initSocket (u_id, dispatch) {
		if (!u_id) return null

		console.log(process.env)
		const socket = io.connect(BASIC_URL, { reconnection: false, query: `user_id=${u_id}` })
		// const socket = io.connect('https://alfakasta.com', { reconnection: false, query: `user_id=${u_id}` })

		socket.on('new notification', payload => {
			dispatch({
				type: MESSAGE,
				payload
			})
		})

		return socket
	},

	closeSocket (connection) {
		connection.disconnect()
	}

}

export default Socket
