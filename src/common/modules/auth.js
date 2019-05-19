import Cookies from 'universal-cookie'
import {TOKEN_SECRET_NAME} from 'common/constants/auth'

const cookies = new Cookies()

export function getSecretToken () {
	return cookies.get(TOKEN_SECRET_NAME)
}
