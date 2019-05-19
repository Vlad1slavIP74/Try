import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import { Form, Message } from 'semantic-ui-react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { restorePasswordByEmailRequest } from 'common/actions/auth'
import { validate } from 'common/modules/validation'

import ModalContent from 'common/components/ModalContent'
import ModalTitle from 'common/components/ModalTitle'
import ActionButton from 'common/components/ActionButton'
import CustomInput from 'common/components/CustomInput'

class Restore extends Component {
  state = {
  	email: '',
  	erorrEmail: false
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => {
  	const { email } = this.state

  	// validation
  	let erorrEmail = false

  	if (!validate('email', email)) {
  		erorrEmail = true
  	}

  	if (erorrEmail) { return this.setState({ erorrEmail }) }

  	// Fetching data
  	this.props.restorePasswordByEmailRequest({ email })
  }
  render () {
  	const {
  		email,
  		erorrEmail
  	} = this.state

  	const {
  		error,
  		loading,
  		loaded,
  		message
  	} = this.props.auth

  	return (
  		<Form>
  			{(!loaded || error)
  				? <ModalContent largePadding>
  					<ModalTitle>Сброс пароля</ModalTitle>
  					<ModalTitle link='/auth'>Вход</ModalTitle>

  					<CustomInput
  						required
  						disabled={loading}
  						name='email'
  						label='Эл. почта'
  						value={email}
  						onChange={this.handleChange}
  						error={erorrEmail}/>

  					{message &&
            <Message info={!error} negative={error}>
            	<p>{message}</p>
            </Message>}

  					<p>Введите эл. почту, указанную при регистрации, — вышлем ссылку для сброса пароля.</p>
  					<p>Если не помните логин и эл. почту, обратитесь к менеджеру по телефону: +380965141144</p>
  				</ModalContent>
  				: <ModalContent largePadding>
  					<ModalTitle>Мы отправили ссылку для сброса пароля на почту</ModalTitle>

  					{message &&
            <Message info={!error} negative={error}>
            	<p>{message}</p>
            </Message>}

  					<p>Мы отправили ссылку для сброса пароля на почту {email}. Перейдите по ссылке из письма, придумайте новый пароль и войдите.</p>
  				</ModalContent>}

  			{(!loaded || error) && <ActionButton loading={loading} label='Сбросить пароль' onClick={this.onSubmit}/>}
  		</Form>
  	)
  }
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, { restorePasswordByEmailRequest })(Restore)
