import React, {Component} from 'react'
import { Container, Row, Col } from 'react-grid-system'
import { Form, Message } from 'semantic-ui-react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { signupRequest } from 'common/actions/auth'
import { validate } from 'common/modules/validation'
import ReactGA from 'react-ga'

import ModalContent from 'common/components/ModalContent'
import ModalTitle from 'common/components/ModalTitle'
import ActionButton from 'common/components/ActionButton'
import CustomInput from 'common/components/CustomInput'

class Register extends Component {
  state = {
  	name: '',
  	last_name: '',
  	email: '',
  	password: '',
  	errorName: false,
  	errorLastName: false,
  	erorrEmail: false,
  	errorPassword: false
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => {
  	const { name, last_name, email, password } = this.state

  	// validation
  	let erorrEmail = false, errorPassword = false, errorName = false, errorLastName = false

  	if (!validate('not_null', name)) {
  		errorName = true
  	}

  	if (!validate('not_null', last_name)) {
  		errorLastName = true
  	}

  	if (!validate('email', email)) {
  		erorrEmail = true
  	}

  	if (!validate('password', password)) {
  		errorPassword = true
  	}

  	if (erorrEmail || errorPassword || errorName || errorLastName) { return this.setState({ erorrEmail, errorPassword }) }

  	// Fetching data
  	// window.ga('send', 'event', 'reg-button', 'finishreg', 'podtverdit-button')

  	ReactGA.event({
  		category: 'registration',
  		action: 'finishreg',
  		label: 'reg-button-end'
  	})
  	this.props.signupRequest({ email, password, name, last_name, permission_type: 1 })
  }

  render () {
  	const {
  		name,
  		last_name,
  		email,
  		password,
  		errorName,
  		errorLastName,
  		erorrEmail,
  		errorPassword
  	} = this.state

  	const {
  		error,
  		loading,
  		loaded,
  		message
  	} = this.props.auth

  	return (
  		<Form>
  			{!loaded || error
  				? <ModalContent largePadding>
    					<ModalTitle>Регистрация</ModalTitle>
    					<ModalTitle link={{ pathname: '/auth', search: location.search }}>Вход</ModalTitle>

    					<CustomInput
    						required
    						disabled={loading}
    						name='name'
    						label='Имя'
    						value={name}
    						onChange={this.handleChange}
    						error={errorName}/>
    					<CustomInput
    						required
    						disabled={loading}
    						name='last_name'
    						label='Фамилия'
    						value={last_name}
    						onChange={this.handleChange}
    						error={errorLastName}/>
    					<CustomInput
    						required
    						disabled={loading}
    						name='email'
    						label='Эл. почта'
    						value={email}
    						onChange={this.handleChange}
    						error={erorrEmail}/>
    					<CustomInput
    						required
    						disabled={loading}
    						secret
    						name='password'
    						label='Пароль'
    						value={password}
    						onChange={this.handleChange}
    						error={errorPassword}/>

    					{error &&
              <Message negative={error}>
              	<p>Ошибка: {message}</p>
              </Message>}

    					<p>
                Нажимая кнопку {'"'}Продолжить{'"'}<br/>
                Вы подтверждаете свое согласие с <a target="_blank" rel="noopener noreferrer" href='/policies'>офертой</a>
    					</p>
    				</ModalContent>
    			: <ModalContent largePadding>
    					<ModalTitle>Подтвердите пожалуйста свою почту</ModalTitle>

    					<p>
              Мы отправили ссылку с подтверждением на почту {email}. Перейдите по ссылке из письма, чтобы завершить процесс регистрации.
    					</p>
  				  </ModalContent>}

  			{(!loaded || error) && <ActionButton loading={loading} label='Продолжить' onClick={this.onSubmit}/>}
  		</Form>
  	)
  }
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, { signupRequest })(Register)
