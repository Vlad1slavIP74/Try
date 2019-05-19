import _ from 'lodash'

const trancateIfLong = (str = '', char_length) => str.length > char_length ? `${str.slice(0, char_length - 3)}...` : str

const isLonger = (str = '', char_length) => str.length > char_length

const spaceEvery3Symbols = (number = 0) => replaceDotToComma3Symbols(String(number).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '))

const replaceDotToComma3Symbols = (number = 0) => String(number).replace('.', ',')

const commaEvery3Symbols = (number = 0) => String(number).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1,')

module.exports = {
	trancateIfLong,
	isLonger,
	spaceEvery3Symbols,
	commaEvery3Symbols
}
