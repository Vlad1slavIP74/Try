// PRIVATE API

import q from './queries'
import bets from './bets'
import vlad from './vlad'
var express = require('express')
var publicAPI = express.Router() // PUBLIC API
var privateAPI = express.Router()

// public
publicAPI.get('/bets/check-expiration', q.checkBetsLifeTime)

publicAPI.post('/signin', q.signin)
publicAPI.post('/signup', q.signup)
publicAPI.get('/restore', q.restorePasswordByEmail)
publicAPI.post('/restore/password', q.restoreUpdatePassword)
publicAPI.post('/verify', q.verifyAccountByEmail)

publicAPI.get('/bets', bets.getBets)
publicAPI.get('/bets/:id', bets.getBets)

publicAPI.post('/account/deposit', q.makeDeposit)
publicAPI.post('/account/cashout', q.makeCashout)

publicAPI.post('/interkassa/cashout', q.interCassaCashout)
// publicAPI.post('/intercassa/cashout/callback', q.interCassaCashoutSuccess)
// publicAPI.post('/interkassa/cashout', vlad.interCassaCashout)

// private
privateAPI.get('/account/profile/password', q.getProfilePassword)
privateAPI.post('/account/profile/update', q.updateProfileData)
privateAPI.post('/account/profile/password/update', q.updateProfilePassword)
privateAPI.get('/account/history/bets', q.getUserBetsHistory)

privateAPI.get('/bets/status/not-confirmed', q.getBetsNotConfirmed)
privateAPI.get('/bets/status/not-selected-winner', q.getBetsNotSelectedWinner)
privateAPI.post('/account/renew-token', q.renewToken)
privateAPI.post('/bets/create', q.createBet)
privateAPI.post('/bets/join', q.joinBet)
privateAPI.post('/bets/admin/change', q.adminChangeBet)
privateAPI.post('/bets/admin/confirm', q.adminConfirmBet)
privateAPI.post('/bets/admin/close', q.adminCloseBet)

export default {
	public: publicAPI,
	private: privateAPI
}
