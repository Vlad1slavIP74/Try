import _ from 'lodash'
import jwt from 'jsonwebtoken'
import {token} from '../../config'

// EXPORT
export const createIdToken = user => {
	user = _.omit(user, 'password') // Пароль не показывать
	return jwt.sign(user, token.secret, { expiresIn: 99999999999 })
}

export const createAccessToken = (user) => {
	return jwt.sign(user, token.secret)
}
