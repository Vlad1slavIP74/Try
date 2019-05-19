import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import { Form, Message } from 'semantic-ui-react'
import styled from 'styled-components'
import queryString from 'querystringify'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import _ from 'lodash'
import { validate } from 'common/modules/validation'
import { connect } from 'react-redux'
import { restorePasswordConfirmRequest } from 'common/actions/auth'
import {token} from 'config'
import { getSecretToken } from 'common/modules/auth'

import ModalContent from 'common/components/ModalContent'
import ModalTitle from 'common/components/ModalTitle'
import ActionButton from 'common/components/ActionButton'
import CustomInput from 'common/components/CustomInput'

class RestoreNewPassword extends Component {
  state = {
  	password: '',
  	c_password: '',
  	erorrEmail: false,
  	errorCPassword: false,
  	errorMessage: null,
  	errorToken: false,
  	fetchingData: false
  }

  componentWillMount () {
  	if (!_.isEmpty(this.props.auth.user)) {
  		this.props.history.push('/')
  	}

  	let params = queryString.parse(this.props.location.search)

  	// ПРОВЕРКА ТОКЕНА На СМЕНУ
  	if (!params.token) { return this.setState({ errorToken: true, errorMessage: 'Проверьте корректность url, токен не найден' }) }

  	jwt.verify(params.token, token.secret, (err, decoded) => {
  		console.log(decoded)

  		if (err) { return this.setState({ errorToken: true, errorMessage: 'Проверьте корректность url, токен не верный' }) }

  		const validExpires = moment(decoded.expires).isAfter(new Date(), 'second')

  		if (!validExpires) { return this.setState({ errorToken: true, errorMessage: `Время жизни ссылки на смену пароля вышло: ${moment(decoded.expires).format('DD.MM.YYYY, HH:MM')}` }) }

  		this.setState({ email: decoded.email, tokenId: decoded.vc_id, tokenExpires: decoded.expires })
  	})
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => {
  	const { email, password, c_password, tokenId, tokenExpires, error, errorToken } = this.state

  	// validation
  	let erorrEmail = false, errorCPassword = false

  	if (error || errorToken) {
  		return false
  	}

  	if (!validate('email', email)) {
  		erorrEmail = true
  	}

  	if (!password || !c_password) {
  		errorCPassword = true
  	}

  	if (!validate('equal', password, c_password)) {
  		errorCPassword = true
  	}

  	if (erorrEmail || errorCPassword) { return this.setState({ erorrEmail, errorCPassword }) }

  	// Fetching data
  	this.props.restorePasswordConfirmRequest({ email, password, tokenId, tokenExpires })
  }

  render () {
  	const {
  		email
  		, password
  		, c_password
  		, erorrEmail
  		, errorCPassword
  		, errorToken
  		, errorMessage
  	} = this.state

  	const {
  		error,
  		loading,
  		loaded,
  		message
  	} = this.props.auth

  	console.log(this.state)

  	return (
  		<Form>
  			<ModalContent largePadding>
  				<ModalTitle>Войдите с новым паролем</ModalTitle>

  				<CustomInput
  					required
  					disabled={true}
  					name='email'
  					label='Эл. почта'
  					labelWidth={160}
  					value={email}
  					onChange={this.handleChange}
  					error={erorrEmail}/>
  				<CustomInput
  					required
  					disabled={loading}
  					secret
  					name='password'
  					label='Новый пароль'
  					labelWidth={160}
  					value={password}
  					onChange={this.handleChange}
  					error={errorCPassword}/>
  				<CustomInput
  					required
  					disabled={loading}
  					secret
  					name='c_password'
  					label='Повторите пароль'
  					labelWidth={160}
  					value={c_password}
  					onChange={this.handleChange}
  					error={errorCPassword}/>

  				{(error || errorToken) &&
          <Message negative={error || errorToken}>
          	<p>Ошибка: {message || errorMessage}</p>
          </Message>}

  			</ModalContent>

  			<ActionButton loading={loading} label='Войти' onClick={this.onSubmit}/>
  		</Form>
  	)
  }
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, { restorePasswordConfirmRequest })(RestoreNewPassword)
