import _ from 'lodash'
import queryString from 'querystring'
import {bets} from 'config'

const escapeQuestionMark = (str) => str.replace('?', '')

const correctBetsParamsIfWrong = (searchStr) => {
	searchStr = escapeQuestionMark(searchStr)

	const searchParsed = queryString.parse(searchStr)

	// Если тип неверный, то по умолчанию спорт
	searchParsed.type = _.indexOf([0, 1, 2, 3, 4], parseInt(searchParsed.type)) === -1 ? 0 : parseInt(searchParsed.type)

	// Если статус неверный, то по умолчанию открытые ставки
	searchParsed.status = _.indexOf([0, 1], parseInt(searchParsed.status)) === -1 ? 0 : parseInt(searchParsed.status)

	// Если подкатегория не указана или не верна, то по поиск без учета подкатегорий
	searchParsed.subcategory = !_.find(_.find(bets.categories, { value: searchParsed.type }).subcategories, { value: parseInt(searchParsed.subcategory) }) ? null : parseInt(searchParsed.subcategory)

	return searchParsed
}

const handleQueryParams = (history, keys) => values => {
	let params = {}

	if (_.isArray(keys)) {
		keys.map((key, index) => _.assign(params, { [key]: values[index] }))
	}

	const prevSearchObj = queryString.parse(escapeQuestionMark(location.search))
	const prevSearchStr = location.search

	let nextSearchStr = queryString.stringify(_.assign(prevSearchObj, params))

	// Если ничего не изменилось, то состояние не изменяем
	if (prevSearchStr === nextSearchStr) return

	history.push({ pathname: '/bets', search: nextSearchStr })
}

const toUrlWithQueryParams = (pathname, paramsDefault) => {
	let paramsObj = _.pickBy(paramsDefault, (item) => _.isNumber(item) || _.isString(item))

	const strQuery = queryString.stringify(paramsObj)

	return `${pathname}?${strQuery}`
}

module.exports = {
	correctBetsParamsIfWrong,
	handleQueryParams,
	toUrlWithQueryParams
}
