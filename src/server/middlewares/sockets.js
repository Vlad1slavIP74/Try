import _ from 'lodash'

let socketConnection
let currentListUsers = []

const init = (server) => {
	socketConnection = require('socket.io')(server)

	socketConnection.on('connection', function (socket) {
		const socketID = socket.id
		const userId = socket.handshake.query.user_id ? parseInt(socket.handshake.query.user_id) : null

		// if (!_.find(currentListUsers, { user_id: userId })) {
		currentListUsers.push({ user_id: userId, socketID })
		// }

		console.log('Юзер пришел')
		console.log(currentListUsers)

		socket.on('disconnect', function (reason) {
			socket.disconnect()
			// socket.disconnect(true)
			console.log('Юзер ушел')
			// currentListUsers = _.filter(currentListUsers, user => user.user_id !== userId)
			currentListUsers = _.filter(currentListUsers, user => user.socketID !== socketID)
			console.log(currentListUsers)
		})
	})
}

const sendUserNotification = (u_id, msg) => {
	/*
	const foundUser = _.find(currentListUsers, { user_id: parseInt(u_id) })

	if (foundUser) {
		console.log(foundUser)
		IO.to(foundUser.socketID).emit('new notification', { title: msg.title, text: msg.text })
	}
	*/

	const foundUsers = _.filter(currentListUsers, { user_id: parseInt(u_id) })

	if (foundUsers.length) {
		console.log('Получатели')
		console.log(foundUsers)
		foundUsers.map(({ socketID }) => socketConnection.sockets.clients().connected[socketID].emit('new notification', { title: msg.title, text: msg.text, error: msg.error }))
	}
}

module.exports = {
	currentListUsers: [],
	init,
	sendUserNotification
}
