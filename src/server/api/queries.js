import React from 'react'
import sha256 from 'sha256'
import moment from 'moment'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import * as Token from 'server/utils/tokens'
import { getHost } from 'server/utils/hostname'
import db from 'server/services/database'
import { sendMail } from 'server/services/mailer'
import { getEmail } from 'server/emails/default'
import FormData from 'form-data'
import {sendUserNotification} from 'server/middlewares/sockets'

import { SERVICE_FEE, BETS_ON_PAGE, BETS_ON_PAGE_FLOAT } from 'config'

/// //////////////////////////////////
// Вспомогательные функции
/// ///////////////////////

const checkVerCodeValid = (vc_id, expires) => {
	return db.one('select vc_id from verification_codes where vc_id = $1 and expires > $2::timestamp and used = 0', [vc_id, expires])
}

const checkUserExist = (u_id) => {
	return db.one('select u_id from users where u_id = $1 and permission_type = 1', [u_id])
}

const checkEmailIsFree = (email) => {
	return db.none('select u_id from users where email = $1 and permission_type = 1', [email])
}

const getUserBalans = (u_id) => {
	return db.one('select balans from users where u_id = $1 and permission_type = 1', [u_id])
		.then(res => res.balans)
		.catch(err => {
			console.log(err)
		})
}

const updateUserBalans = (u_id, balans) => {
	return db.none('update users set balans = $1 where u_id = $2 and permission_type = 1', [balans, u_id])
		.catch(err => {
			console.log(err)
		})
}

const addToUserBalans = (u_id, amount) => {
	return db.none('update users set balans = balans + $1 where u_id = $2 and permission_type = 1', [amount, u_id])
		.catch(err => {
			console.log(err)
		})
}

const addTransaction = (users_id, type, amount, bets_id) => {
	return db.none('insert into transactions (users_id, type, amount, bets_id) values ($1,$2,$3,$4)', [users_id, type, amount, bets_id])
		.catch(err => {
			console.log(err)
		})
}

const getWinnerGain = (b_id) => {
	return db.one('select sum(amount) from transactions where bets_id = $1 and type=0', [b_id])
		.then(res => res.sum)
		.catch(err => {
			console.log(err)
		})
}

const insertIntoBetsDetails = (betsDetailsParams) => {
	return db.none('insert into bets_details (bets_id, date, source, bid_amount, bid_description, ext_data) values ($1,$2,$3,$4,$5,$6)', betsDetailsParams)
		.then(success => { /* console.log(success) */ })
		.catch(err => {
			console.log(err)
		})
}

const deleteBetById = (b_id) => {
	return db.none(`
			update bets
			set status = 2
			where b_id = $1;
		`, [b_id])
		.then(success => { /* console.log(success) */ })
		.catch(err => {
			console.log(err)
		})
}

//
// CRON Задания!!!!
//

const checkBetsLifeTime = (req, res, next) => {
	// если время жизни ставки вышло (событие уже произошло),
	// но никто не присоеденился к этому времени или админ не подтвердил ставку
	db.any(`select b_id, creator_id, bid_amount
					from bets b
					join bets_details d on d.bets_id = b.b_id
					where (status = 0 or joiner_id = null) and date < now()`)
		.then(async (bets) => {
			await bets.map(async ({ b_id, creator_id, bid_amount }) => {
				// возвращаем деньги за ставку
				// let curBalans = await getUserBalans(creator_id)

				// console.log(`Баланс перед возвратом: ${curBalans}, сумма возврата: ${bid_amount}`)
				await addToUserBalans(creator_id, bid_amount)

				// сохраняем транзакцию
				await addTransaction(creator_id, 4, bid_amount, b_id)

				// удаляем ставку
				await deleteBetById(b_id)

				// let nextBalans = await getUserBalans(creator_id)
				// console.log(`Стал баланс: ${nextBalans}`)
				// console.log('---------------------------')
				// console.log('---------------------------')
				// console.log('---------------------------')
				// console.log('---------------------------')
				// console.log('---------------------------')
			})

			res.end()
		})
		.catch(err => {
			console.log(err)
		})
}

/// //////////////////////////////////
// Функции роутинга
/// ///////////////////////

const signup = (req, res, next) => {
	const {
		email,
		password,
		name,
		last_name,
		permission_type
	} = req.body

	checkEmailIsFree(email).then(() =>
		db.one('insert into users (email, password, name, last_name, permission_type) values ($1,$2,$3,$4, $5) returning *', [email, sha256(password), name, last_name, permission_type])
			.then(user => {
				const { u_id } = user

				const paramsEmail = {
					to: email,
					subject: 'Регистрация',
					message:
          `<p>Здравствуйте, <b>${name} ${last_name}</b>!
           Вы зарегистрировались на сервисе Альфакаста, подтвердите почту для начала работы.
           Перейдите по этой ссылке:
           </p>
           <a href='${getHost(req)}/verify?id=${Token.createIdToken({u_id})}'>${getHost(req)}/verify?id=${Token.createIdToken({u_id})}</a>`
				}

				sendMail(getEmail(paramsEmail))

				res.send({
					status: 200,
					message: 'Вы успешно зарегестрировались'
				})
			})
			.catch(err => {
				console.log(err)
				next(err)
			})
	)
		.catch(err => {
			res.send({
				status: 403,
				message: 'Этот емейл уже используется'
			})
		})
}

const signin = (req, res, next) => {
	let params = [
		req.body.email,
		sha256(req.body.password),
		req.body.permission_type
	]

	db.one('select * from users where email = $1 and password = $2 and permission_type = $3', params)
		.then(user => {
			let publicToken = Token.createIdToken(user)
			let accessToken = Token.createAccessToken(user)

			res.send({
				status: 200,
				message: 'Вы успешло авторизовались',
				publicToken,
				accessToken
			})
		})
		.catch(err => {
			res.send({
				status: 403,
				message: 'Email или пароль неверны'
			})
		})
}

const verifyAccountByEmail = (req, res, next) => {
	let u_id = -1

	let jwtDecoded = {}

	try {
		jwtDecoded = jwtDecode(req.body.token)
	} catch (err) {
		return res.send({
			status: 403,
			message: 'Проверьте корректность url'
		})
	}

	if (jwtDecoded && !jwtDecoded.u_id) {
		return res.send({
			status: 403,
			message: 'Проверьте корректность url'
		})
	}

	u_id = jwtDecoded.u_id

	checkUserExist(u_id).then(() =>
		db.one('update users set verified = 1 where u_id = $1 and verified != 1 returning *', [u_id])
			.then(user => {
				let publicToken = Token.createIdToken(user)
				let accessToken = Token.createAccessToken(user)

				res.send({
					message: 'Аккаунт успешно подтвержден',
					publicToken,
					accessToken
				})
			})
			.catch(err => {
				res.send({
					status: 403,
					message: 'Аккаунт уже был ранее подтвержден'
				})
			})
	)
		.catch(err => {
			res.send({
				status: 403,
				message: 'Аккаунт не найден'
			})
		})
}

const restorePasswordByEmail = (req, res, next) => {
	let params = [
		req.query.email
	]

	db.one('select * from users where email = $1 and permission_type = 1', params)
		.then(user =>
			db.one(`insert into verification_codes (users_id, value, expires, type)
              values ($1, $2, now()::timestamp + interval '1 hour', 0)
              returning *, ($3::json) as user`, [user.u_id, sha256(`${user.u_id}`), user])
		)
		.then(data => {
			const { user } = data

			const tokenData = {
				email: user.email,
				vc_id: data.vc_id,
				expires: data.expires
			}

			const subject = `Восстановление доступа`,
				message = `<p>
                          Здравствуйте, <b>${user.name} ${user.last_name}</b>!
                          Для того, чтобы сбросить пароль, Перейдите по этой ссылке:
                       </p>
                       <a href='${getHost(req)}/restore/confirm?token=${Token.createIdToken(tokenData)}'>
                        ${getHost(req)}/restore/confirm?token=${Token.createIdToken(tokenData)}
                       </a>
                       <p>Обращаем внимание, что ссылка будет доступна в течении <b>1 часа</b>!</p>`

			sendMail(getEmail({ to: user.email, subject, message }))

			res.status(200)
				.send({ message: null })
		})
		.catch(err => {
			console.log(err)

			res.send({
				status: 403,
				message: 'Почтовый ящик не найден'
			})
		})
}

const restoreUpdatePassword = (req, res, next) => {
	let params = [
		sha256(req.body.password),
		req.body.email,
		req.body.tokenId
	]

	checkVerCodeValid(req.body.tokenId, req.body.tokenExpires).then(() =>
		db.one(`
      update verification_codes set used = 1 where vc_id = $3;
      update users set password=$1 where email = $2 returning *`, params)
			.then(user => {
				let publicToken = Token.createIdToken(user)
				let accessToken = Token.createAccessToken(user)

				res.status(200)
					.send({
						publicToken,
						accessToken,
						message: 'Вы успешло авторизовались'
					})
			})
			.catch(err => {
				console.log(err)
				res.status(200)
					.send({ message: null })
			})
	)
		.catch(err => {
			res.send({
				status: 403,
				message: 'Пароль не обновлен! Причина: Время жизни токена вышло или был уже использован'
			})
		})
}

const renewToken = (req, res, next) => {
	const token = jwtDecode(req.body.token)

	let params = [
		token.u_id
	]

	db.one('select * from users where u_id = $1', params)
		.then(user => {
			let publicToken = Token.createIdToken(user)
			let accessToken = Token.createAccessToken(user)

			res.send({
				status: 200,
				message: 'Токен успешно обновлен',
				publicToken,
				accessToken
			})
		})
		.catch(err => {
			res.send({
				status: 403,
				message: 'Токен поврежден'
			})
		})
}

const getProfilePassword = (req, res, next) => {
	const token = jwtDecode(req.query.token)

	let params = [
		token.u_id
	]

	db.one('select password from users where u_id = $1', params)
		.then(user => {
			res.send({
				status: 200,
				password: user.password
			})
		})
		.catch(err => {
			res.send({
				status: 403,
				message: 'Пользователь не найден'
			})
		})
}

const updateProfileData = (req, res, next) => {
	let params = [
		req.body.u_id,
		req.body.name,
		req.body.last_name,
		req.body.born,
		req.body.email,
		req.body.phone,
		req.body.country
	]

	db.one(`update users set name = $2,
					last_name = $3,
					born = $4,
					email = $5,
					phone = $6,
					country = $7
					where u_id = $1
					returning *`, params)
		.then(user => {
			let publicToken = Token.createIdToken(user)
			let accessToken = Token.createAccessToken(user)

			res.send({
				status: 200,
				message: 'Информация о профиле успешно обновлена',
				publicToken,
				accessToken
			})
		})
		.catch(err => {
			console.log(err)
			res.send({
				status: 403,
				message: 'Ошибка! Информация о профиле не была обновлена'
			})
		})
}

const updateProfilePassword = (req, res, next) => {
	let params = [
		req.body.u_id,
		sha256(req.body.password)
	]

	db.one(`update users set password = $2
					where u_id = $1
					returning *`, params)
		.then(user => {
			let publicToken = Token.createIdToken(user)
			let accessToken = Token.createAccessToken(user)

			res.send({
				status: 200,
				message: 'Пароль успешно изменен!',
				publicToken,
				accessToken
			})
		})
		.catch(err => {
			res.send({
				status: 403,
				message: 'Ошибка! Указан неверный текущий пароль'
			})
		})
}

const getUserBetsHistory = (req, res, next) => {
	let params = [
		req.query.u_id
	]

	const dateFilter = (last = '1day') => {
		switch (last) {
		case '1day':
			return 'extract (day from created) - extract ( day from now()::timestamp) = 0'
		case '7days':
			return 'extract (day from created) - extract ( day from now()::timestamp) <= 7'
		case 'anytime':
			return 'true'

		default:
			return 'true'
		}
	}

	db.any(`select *
					from bets b
					join bets_details d on d.bets_id = b.b_id
					where (b.creator_id = $1 or b.joiner_id = $1) and ${dateFilter(req.query.last)}`, params)
		.then(bets => {
			res.send({
				status: 200,
				bets
			})
		})
		.catch(err => {
			res.send({
				status: 403,
				message: 'Ошибка сервера'
			})
		})
}

const makeDeposit = (req, res, next) => {
	/* console.log(`
		_________________________________
		_________________________________
		_________________________________
		_________________________________
		_________________________________
		_________________________________
	`) */

	/*
	let params = [
		req.body.u_id,
		req.body.payed
	]
	*/

	/*
	const payed = parseInt(req.body.payed)

	db.one(`select u_id, balans from users where u_id = $1`, params)
		.then(user => {
			updateUserBalans(req.body.u_id, parseInt(user.balans) + payed) // Прибавляем к текущему балансу
			addTransaction(req.body.u_id, 2, payed, null) // сохраняем транзакцию

			res.send({
				status: 200,
				message: 'Оплата успешно завершена'
			})
		})
		.catch(err => {
			res.send({
				status: 403,
				message: 'Оплата не была завершена'
			})
		})
	*/

	let params = [
		req.body.ik_pm_no, // u_id
		req.body.ik_am // amount
	]

	const payed = parseInt(params[1])

	// console.log('// DEPOSIT //')
	// console.log(params)

	db.one(`select u_id, balans from users where u_id = $1`, params)
		.then(user => {
			// console.log(user)

			updateUserBalans(params[0], parseInt(user.balans) + payed) // Прибавляем к текущему балансу
			addTransaction(params[0], 2, payed, null) // сохраняем транзакцию

			sendUserNotification(params[0], { title: 'Пополнение счета', text: `${moment(new Date()).format('HH:mm:ss')} Ваш счет успешно пополнен` })

			res.send({
				status: 200,
				message: 'Оплата успешно завершена'
			})
		})
		.catch(err => {
			sendUserNotification(params[0], { title: 'Пополнение счета', text: `${moment(new Date()).format('HH:mm:ss')} Ошибка пополнения счета`, error: true })

			res.send({
				status: 403,
				message: 'Оплата не была завершена'
			})
		})
}

const makeCashout = (req, res, next) => {
	let params = [
		req.body.u_id,
		req.body.payed
	]

	const payed = parseInt(req.body.payed)

	db.one(`select u_id, balans from users where u_id = $1`, params)
		.then(user => {
			console.log(req.body.u_id)
			updateUserBalans(req.body.u_id, parseInt(user.balans) - payed) // списываем средства
			addTransaction(req.body.u_id, 3, payed, null) // сохраняем транзакцию

			res.send({
				status: 200,
				message: 'Вы успешно вывели деньги'
			})
		})
		.catch(err => {
			res.send({
				status: 403,
				message: 'Ошибка во время вывода денег'
			})
		})

	res.status(200).send({ OKEY: true })
}

const getBetsNotConfirmed = async (req, res, next) => {
	db.any(`select *
				  from bets b
				  join bets_details d on d.bets_id = b.b_id
		      where (status = 0 or status = 1) and approved_by_admin = 1 and date >= now()`)
		.then(bets =>
			res.send({
				status: 200,
				bets
			})
		)
		.catch(err => {
			console.log(err)
			next(err)
		})
}

const getBetsNotSelectedWinner = async (req, res, next) => {
	db.any(`select *
				  from bets b
				  join bets_details d on d.bets_id = b.b_id
		      where status = 1 and approved_by_admin = 1 and date < now()`)
		.then(bets =>
			res.send({
				status: 200,
				bets
			})
		)
		.catch(err => {
			console.log(err)
			next(err)
		})
}

const createBet = async (req, res, next) => {
	let betParams = [
		req.body.creator_id,
		req.body.type
	]

	// Получаем текущий баланс пользователя
	let creatorBalans = await getUserBalans(req.body.creator_id)

	// создаем ставку
	db.one('insert into bets (creator_id, type, created) values ($1,$2, now()::timestamp) returning *', betParams)
		.then(user => {
			const { b_id } = user

			let betsDetailsParams = [
				b_id,
				req.body.date,
				req.body.source,
				req.body.bid_amount,
				req.body.bid_description,
				req.body.ext_data
			]

			Promise.all([
				insertIntoBetsDetails(betsDetailsParams), // создаем запись в bets_details
				updateUserBalans(req.body.creator_id, creatorBalans - req.body.bid_amount), // списываем средства
				addTransaction(req.body.creator_id, 0, req.body.bid_amount, b_id) // сохраняем транзакцию
			]).catch(err => {
				console.log(err)
				return next()
			})
		})
		.then(() => {
			res.send({
				status: 200,
				message: `Ваша ставка "${req.body.bid_description}" активна. Сумма выигрыша ${req.body.bid_amount * 2 * (1 - SERVICE_FEE)} грн`
			})
		})
		.catch(err => {
			console.log(err)
			next(err)
		})
}

const joinBet = async (req, res, next) => {
	let betParams = [
		req.body.joiner_id,
		req.body.b_id
	]

	// Получаем текущий баланс пользователя
	let joinerBalans = await getUserBalans(req.body.joiner_id)

	// статус 1 - прием ставок закрыт,
	// joiner_id - id присоединившегося пользователя

	db.none('update bets set joiner_id = $1, status = 1 where b_id=$2', betParams)
		.then(() => {
			// списываем средства
			updateUserBalans(req.body.joiner_id, joinerBalans - req.body.bid_amount)

			// сохраняем транзакцию
			addTransaction(req.body.joiner_id, 0, req.body.bid_amount, req.body.b_id)

			res.send({
				status: 200,
				message: 'Вы успешно поставили против'
			})
		})
		.catch(err => {
			console.log(err)
			next(err)
		})
}

const adminChangeBet = async (req, res, next) => {
	const betParams = [
		req.body.type,
		req.body.date,
		req.body.source,
		req.body.ext_data,
		req.body.bid_description,
		req.body.bets_id
	]

	// Обновляем ставку
	db.none(`update bets set type = $1 where b_id = $6;
			 update bets_details set date = $2, source = $3, ext_data = $4, bid_description = $5 where bets_id = $6`, betParams)
		.then(() =>
			res.send({
				status: 200,
				message: 'Ставка успешно отредактирована'
			})
		)
		.catch(err => {
			console.log(err)
			next(err)
		})
}

const adminConfirmBet = async (req, res, next) => {
	const betParams = [
		req.body.b_id,
		req.body.status
	]

	// Обновляем статус ставки

	db.none('update bets set approved_by_admin = $2 where b_id = $1', betParams)
		.then(() =>
			res.send({
				status: 200,
				message: 'Ставка успешно закрыта'
			})
		)
		.catch(err => {
			console.log(err)
			next(err)
		})
}

const adminCloseBet = async (req, res, next) => {
	const betParams = [
		req.body.winner_id,
		req.body.b_id
	]

	// Получаем текущий баланс пользователя
	let winnerBalans = await getUserBalans(req.body.winner_id)
	let winnerGain = await getWinnerGain(req.body.b_id)

	// сначала закрываем ставку (статус = 2 и указываем победителя winner_id)
	// дальше победителю начисляем деньги
	// для этого сначала получаем текущий баланс + (сумма всех ставок) * 0,95
	// 5% - комиссия сервиса

	db.none('update bets set winner_id =$1, status =2 where b_id = $2', betParams)
		.then(() => {
			let withCommissionGain = winnerGain * (1 - SERVICE_FEE)
			let newBalans = winnerBalans + withCommissionGain

			// начисляем выигрыш
			updateUserBalans(req.body.winner_id, newBalans)

			// сохраняем транзакцию
			addTransaction(req.body.winner_id, 1, withCommissionGain, req.body.b_id)

			res.send({
				status: 200,
				message: 'Ставка успешно закрыта'
			})
		})
		.catch(err => {
			console.log(err)
			next(err)
		})
}

const interCassaCashout = async (req, res, next) => {
	// console.log('===============\n======================\n===============')
	// console.log(req)
	const btoa = require('btoa')
	const login = '5b62016f3d1eaf01238b4571'
	const pass = 'Zxw1lvPZX1eW8Z4zAM23SDZTrI8HkG11'
	const b64 = btoa(login + ':' + pass)
	fetch('https://api.interkassa.com/v1/account', {
		method: 'GET',
		headers: {
			'Authorization': 'Basic ' + b64
			// 'Ik-Api-Account-Id': '5b6201a03d1eaf4a278b4569'

		}
	}).then(response => {
		console.log(response)
		if (response.status === 200) {
			const { u_id, amount, card, payType } = req.body
			console.log(u_id, amount, card, payType)

			var data = new FormData()
			data.append('amount', amount)
			data.append('details[card]', card)
			data.append('paywayId', payType === 'visa' ? '59dbc5823b1eaf791c8b456b' : '59dbc5d83b1eafab1c8b4567')
			data.append('purseId', '300656475524')
			data.append('paymentNo', `${u_id}-${JSON.stringify(new Date())}`)
			// data.append('paymentNo', u_id)
			data.append('action', 'process')
			data.append('calcKey', 'psPayeeAmount')
			console.log('Arads')

			const btoa = require('btoa')
			const login = '5b62016f3d1eaf01238b4571'
			const pass = 'Zxw1lvPZX1eW8Z4zAM23SDZTrI8HkG11'

			const b64 = btoa(login + ':' + pass)

			fetch('https://api.interkassa.com/v1/withdraw', {
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + b64,
					'Ik-Api-Account-Id': '5b6201a03d1eaf4a278b4569'
				},
				body: data
			})
				.then(res => res.json())
				.then(response => {
				 // response.status = 'ok'
				// response.data.payeePrice = 100.000

					if (response.statusText === 'ok') {
						const payed = parseInt(response.data.withdraw.psValue)

						let params = [
							u_id,
							payed
						]

						return db.one(`select u_id, balans from users where u_id = $1`, params)
							.then(user => {
								console.log(user)
								updateUserBalans(req.body.u_id, parseInt(user.balans) - payed) // списываем средства
								addTransaction(req.body.u_id, 3, payed, null) // сохраняем транзакцию

								sendUserNotification(params[0], { title: 'Вывод средств', text: `${moment(new Date()).format('HH:mm:ss')} Средства будут переведены на карту в течении 2 дней`, error: false })

								res.send({
									status: 200,
									message: 'Вы успешно вывели деньги'
								})
							})
							.catch(err => {
								res.send({
									status: 403,
									message: 'Ошибка во время вывода денег'
								})
							})
					}
					if (response.status === 'error') {
						console.log(response)
						let errorIntercassaReason = ''

						if (response.code === 1023) errorIntercassaReason = ', номер карты недействительный'
						if (response.code === 1413) errorIntercassaReason = ', "Сумма к получению"  должна быть от 4 UAH до 14990 UAH'
						if (response.code === 1106) errorIntercassaReason = ', Не достаточно средств'

						sendUserNotification(req.body.u_id, { title: 'Вывод средств', text: `${moment(new Date()).format('HH:mm:ss')} Средства не были выведены${errorIntercassaReason}`, error: true })

						return res.status(500).send({ status: 'error', msg: 'Ошибка проведения операции' })
					}

					res.status(500).send({ status: 'error', msg: 'Ошибка сервера' })
				})
				.catch(err => console.log(err))
		} else {
			res.status(500).send({ status: 'error', msg: 'Ошибка авторизации' })
		}
	})
}

const interCassaCashoutSuccess = async (req, res, next) => {
	res.status(200).send({ OKEY: true })
}

module.exports = {
	checkBetsLifeTime,
	signup,
	signin,
	verifyAccountByEmail,
	restorePasswordByEmail,
	restoreUpdatePassword,
	renewToken,
	getProfilePassword,
	updateProfileData,
	updateProfilePassword,
	getUserBetsHistory,
	makeDeposit,
	makeCashout,
	getBetsNotConfirmed,
	getBetsNotSelectedWinner,
	createBet,
	joinBet,
	adminChangeBet,
	adminConfirmBet,
	adminCloseBet,
	interCassaCashout,
	interCassaCashoutSuccess
}
