import React from 'react'
import sha256 from 'sha256'
import moment from 'moment'
import jwtDecode from 'jwt-decode'
import _ from 'lodash'
import * as Token from 'server/utils/tokens'
import { getHost } from 'server/utils/hostname'
import db from 'server/services/database'
import { sendMail } from 'server/services/mailer'
import { getEmail } from 'server/emails/default'
import { SERVICE_FEE, BETS_ON_PAGE, BETS_ON_PAGE_FLOAT } from 'config'

/// ///////////////////////////////////////
// GET BETS вспомогательные фнукции (/bets or /bets/:id)
/// ///////////////////////////////////////

// Обработчик ошибок
const FailureHandler = (err) => {
	// console.log(err)
}

// инициализация BET_PARAMS по id запрошенной ставки (/bets/:id)
const getBetParamsByBetId = (b_id) => {
	return db.one(`
    select * 
    from bets b 
    join bets_details d on d.bets_id = b.b_id
    where b_id = $1`
		, [b_id])
		.then(({ type, ext_data, status }) => {
			return {
				type,
				subcategory: ext_data.subcategory,
				status,
				bet_name: null,
				sort: null,
				order: null
			}
		})
		.catch(FailureHandler)
}

// инициализация PAG_PARAMS по id запрошенной ставки (/bets/:id)
const getPagParamsByBetId = (b_id, bets_ids) => {
	const bet_index_number = _.indexOf(bets_ids, parseInt(b_id))

	// если не найдена ставка, то возвращаем null
	if (bet_index_number === -1) return null

	const page = _.ceil((bet_index_number || 1) / BETS_ON_PAGE_FLOAT)
	return page
}

// Инициализация BET_PARAMS
const initBetParams = (isSearchByOneBet, req) => {
	return Promise.resolve(isSearchByOneBet
		? getBetParamsByBetId(req.params.id)
		: {
			type: req.query.type,
			subcategory: req.query.subcategory || null,
			status: req.query.status || null,
			bet_name: req.query.bet_name || null,
			sort: req.query.sort || null,
			order: req.query.order || null
		})
}

// Инициализация PAG_PARAMS
const initPagParams = (isSearchByOneBet, bets, page, b_id) => {
	return Promise.resolve(isSearchByOneBet
		? getPagParamsByBetId(b_id, bets)
		: (page || 1)
	)
}

// SELECT всех ставок по PARAMS_BET без учета пагинации
const selectBetsIdsNoPagination = ({ type, subcategory, status, bet_name }) => {
	return db.one(`  
    select array_agg(r.b_id) bets_ids
    from (  
      select b_id 
      from bets b
      join bets_details d on d.bets_id = b.b_id
      where approved_by_admin = 1 and
      ${status === 0 ? 'date > now()' : 'true'} and 
      ${type ? 'type = $1' : 'true'} and 
      ${subcategory ? "(ext_data->>'subcategory')::int = $2" : 'true'} and 
      ${status ? 'status = $3' : 'true'} and 
      ${bet_name ? 'LOWER(bid_description) ~ LOWER($4)' : 'true'}
    ) r
  `, [type, subcategory, status, bet_name])
}

// Пагинация всех ставок
const paginateBets = (bets, page) => {
	const params = [
		bets.length,
		page
	]

	return db.one(`       
      select $1 total_bets,
             ceil($1/${BETS_ON_PAGE_FLOAT})::int total_pages,
             array_agg(p.n) pages,
             (
              case 
               when $2::int > ceil($1/${BETS_ON_PAGE_FLOAT})::int 
               then 1
               else $2::int
              end 
             ) as active_page
      from generate_series(1, ceil($1/${BETS_ON_PAGE_FLOAT})::int) as p(n)
  `, params)
}

// Выбор всех ставок только на нужной странице
const onlyBetsOnSelectedPage = (bets, page, sort, order) => {
	const params = [
		bets,
		page
	]

	const _sort = (sort, order) => {
		let sortBy = 'order by d.date'

		switch (sort) {
		case 'id':
			sortBy = 'order by b.u_id'
			break

		case 'price':
			sortBy = 'order by d.bid_amount'
			break

		case 'date':
			sortBy = 'order by d.date'
			break

		default:
			break
		}

		return `${sortBy} ${order || 'desc'}`
	}

	const leftIndex = (page - 1) * BETS_ON_PAGE
	const rightIndex = page * BETS_ON_PAGE

	const bets_index = _.range(leftIndex, rightIndex)
	let bets_ids = _.pullAt(bets, bets_index)

	bets_ids = _.dropRightWhile(bets_ids, id => !id)

	return db.any(`
    select * 
    from bets b 
    join bets_details d on d.bets_id = b.b_id
    where b_id = ANY($1)
    ${_sort(sort, order)}
    `, [bets_ids])
}

// Получить данные о ставке по id ставки
const getBetDataById = (b_id) => {
	return db.one(`
    select * 
    from bets b 
    join bets_details d on d.bets_id = b.b_id
    where b_id = $1`
		, [b_id])
}
/// /////////////////////////////////////////////////////

/*******************************************************
 * NAME: Получаем ставки для страницы ставок и шейра
 * URL: /bets or /bets/:id
 */

const getBets = (req, res, next) => {
	// console.log('QUERY handler: /api/bets/index.js')
	// console.log('Запрос начат')

	/// ///////////
	// Подготовка:

	// 1. Общий запрос или нет
	// console.log('1.1 Шейр ставки?:')
	const isSearchByOneBet = !!req.params.id
	// console.log(isSearchByOneBet)

	// 2) Если общий, то работаем с переданными POST фильтрами (параметры BET_PARAMS), если нет,
	//    То делаем запрос на выборку BET_PARAMS этой ставки по id (/bets/:id)
	// console.log('1.2 Инициализация BET_PARAMS:')
	const withBetParams = initBetParams(isSearchByOneBet, req)

	if (!withBetParams) {
		res.send({
			status: 200,
			bets: [],
			pagination: null
		})
	}

	/// ///////////
	// Поиск:

	withBetParams.then(BET_PARAMS => {
		// console.log(BET_PARAMS)
		// console.log('2.1 Выбор всех ставок:')

		// SELECT всех ставок по PARAMS_BET без учета пагинации
		selectBetsIdsNoPagination(BET_PARAMS)
			.then(({ bets_ids }) => {
				// Если ставки не найдены, продолжать поиск нету смысла
				if (!bets_ids) {
					res.send({
						status: 200,
						bets: [],
						pagination: null
					})
					throw new Error('Ставки не найдены')
				}

				// Инициализация PAG_PARAMS на основе bets
				// console.log(bets_ids)
				// console.log('2.2 Инициализация PAG_PARAMS:')

				return Promise.all([
					initPagParams(isSearchByOneBet, bets_ids, req.query.page, req.params.id),
					bets_ids
				])
			})
			.then(r => {
				const page = r[0]
				const bets = r[1]

				// console.log(bets, page)
				// console.log('2.3-2.4 Пагинация + Финальная выборка ставок')
				return Promise.all([
					paginateBets(bets, page),
					onlyBetsOnSelectedPage(bets, page, BET_PARAMS.sort, BET_PARAMS.order),
					isSearchByOneBet ? getBetDataById(req.params.id) : null
				])
			})
			.then(r => {
				// console.log('Конец: отправка на клиент данных')
				const pagination = r[0]
				const bets = r[1]
				const betData = r[2]

				res.send({
					status: 200,
					bets,
					pagination,
					searchByBet: isSearchByOneBet
						? {
            	urlParams: isSearchByOneBet ? BET_PARAMS : null,
            	betData
						}
						: null
				})
			})
			.catch(err => {
				// console.log(err)
			})
	})
}

module.exports = {
	getBets
}
