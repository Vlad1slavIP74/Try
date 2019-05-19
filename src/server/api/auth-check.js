import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import {token} from 'config'
import db from 'server/services/database'

/**
 *  The Auth Checker middleware function.
 *
 *  CORRECT EXAMPLES: 'Authorization': 'user TOKEN_STRING'
 */
module.exports = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).end()
	}

	// get the last part from a authorization header string like "user token-value"
	const _token = req.headers.authorization.split(' ')[1]

	// decode the token using a secret key-phrase

	return jwt.verify(_token, token.secret, (err, decoded) => {
		// the 401 code is for unauthorized status

		console.log(decoded)
		if (err) { return res.status(401).end() }

		const userId = decoded.u_id

		// check if a user exists return 200, else 401
		return db.one('select u_id from users where u_id = $1 ', [userId])
			.then(() => {
				return next()
			})
			.catch(err => {
				console.log(err)
				return res.status(401).end()
			})
	})
}
