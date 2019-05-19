
const emailExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/

export function validate (rule, value, secondValue) {
	switch (rule) {
	case 'not_null' :
		return (value !== null) && (value !== undefined) && value !== ''

	case 'int' :
		return value === parseInt(value)

	case 'email' :
		return emailExp.test(value)

	case 'password' :
		return Boolean(value && value.length > 4)

	case 'equal' :
		return value === secondValue

	default:
		return true
	}
}
