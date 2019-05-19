import { push } from 'react-router-redux'
import {
  takeLatest,
  call,
  put
} from 'redux-saga/effects'

import {
  CREATE_BET_OPEN,
  JOIN_BET_OPEN,
  BET_FORM_CLOSE
} from 'common/constants/layout'

import { REDIRECT, TO_SIGNUP_PAGE, TO_SIGNIN_PAGE } from 'common/constants/router'

import { MESSAGE } from 'common/constants/message'

import {
  getBets,
  createBet,
  joinBet,
  closeBet
} from 'common/api'

import { getSecretToken } from 'common/modules/auth'

function * createBetOpenFlow ({ data }) {
  if (getSecretToken()) {
    return put({
      type: CREATE_BET_OPEN
    })
  }

  // Отменяем показывать форму
  yield put({
    type: BET_FORM_CLOSE
  })

  // Если не авторизован, то еррор
  yield put({
    type: MESSAGE,
    payload: {
      text: 'Для участия в ставках нужно авторизоваться'
    }
  })

  yield put({
    type: REDIRECT,
    to: TO_SIGNIN_PAGE
  })
}

function * joinBetOpenFlow ({ data }) {
  if (getSecretToken()) {
    return put({
      type: JOIN_BET_OPEN,
      data
    })
  }

  // Отменяем показывать форму
  yield put({
    type: BET_FORM_CLOSE
  })

  // Если не авторизован, то еррор
  yield put({
    type: MESSAGE,
    payload: {
      text: 'Для участия в ставках нужно авторизоваться'
    }
  })
}

function * authWatcher () {
  yield takeLatest(CREATE_BET_OPEN, createBetOpenFlow)
  yield takeLatest(JOIN_BET_OPEN, joinBetOpenFlow)
}

export default authWatcher
