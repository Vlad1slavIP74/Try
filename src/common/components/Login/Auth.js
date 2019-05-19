import React, {Component} from 'react'
import queryString from 'querystringify'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import { Form, Message } from 'semantic-ui-react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { loginRequest } from 'common/actions/auth'
import { validate } from 'common/modules/validation'

import ModalContent from 'common/components/ModalContent'
import ModalTitle from 'common/components/ModalTitle'
import ActionButton from 'common/components/ActionButton'
import CustomInput from 'common/components/CustomInput'

const RestoreLink = styled.span`
  color: #8d8d8d;
  font-size: 15px;
`

class Auth extends Component {
  state = {
  	email: '',
  	password: '',
  	errorEmail: false,
  	errorPassword: false
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => {
  	const { email, password } = this.state

  	// validation
  	let errorEmail = false, errorPassword = false

  	if (!validate('email', email)) {
  		errorEmail = true
  	}

  	if (errorEmail || errorPassword) { return this.setState({ errorEmail, errorPassword }) }

  	// Fetching data
  	this.props.loginRequest({ email, password, permission_type: 1 })
  }

  render () {
  	const {
  		email,
  		password,
  		errorEmail,
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
  			<ModalContent largePadding>
  				<ModalTitle>Вход</ModalTitle>
  				<ModalTitle link={{ pathname: '/register', search: location.search }}>Регистрация</ModalTitle>

  				<CustomInput
  					required
  					disabled={loading}
  					name='email'
  					label='Эл. почта'
  					value={email}
  					onChange={this.handleChange}
  					error={errorEmail}/>
  				<CustomInput
  					required
  					disabled={loading}
  					secret
  					name='password'
  					label='Пароль'
  					value={password}
  					onChange={this.handleChange}
  					error={errorPassword}/>

  				{message &&
            <Message info={!error} negative={error}>
            	<p>{message}</p>
            </Message>}

  				<Link to='/restore'><RestoreLink>Восстановить пароль</RestoreLink></Link>
  			</ModalContent>
  			<ActionButton loading={loading} label='Войти' onClick={this.onSubmit}/>
  		</Form>
  	)
  }
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, { loginRequest })(Auth)
