import React, {Component} from 'react'
import queryString from 'querystringify'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import { Segment, Form, Message } from 'semantic-ui-react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { loginRequest } from 'common/actions/auth'
import { validate } from 'common/modules/validation'

import MarginComponent from 'common/components/MarginComponent'
import ComponentMinHeight from 'common/components/ComponentMinHeight'
import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import ModalContent from 'common/components/ModalContent'
import ModalTitle from 'common/components/ModalTitle'
import ActionButton from 'common/components/ActionButton'
import CustomInput from 'common/components/CustomInput'

const RestoreLink = styled.span`
  color: #8d8d8d;
  font-size: 15px;
`

const FormContainer = styled.div`
  display; block;
  padding-top: 200px;
  margin: auto;
  width: 400px;
`

const GreenBackground = styled.div`
  background: #3ECF8E;
`

class LoginAdmin extends Component {
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
  	this.props.loginRequest({ email, password, permission_type: 0 })
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
  		<GreenBackground>
    		<ComponentMinHeight height={800}>
      		<ComponentMaxWidth>
    				<FormContainer>
          		<Segment>
    						<Form>
    							<ModalContent>
              			<ModalTitle>Войти как администратор</ModalTitle>

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

            		  </ModalContent>
    							<ActionButton loading={loading} label='Войти' onClick={this.onSubmit}/>
    						</Form>
          		</Segment>
    				</FormContainer>
      		</ComponentMaxWidth>
    		</ComponentMinHeight>
  		</GreenBackground>
  	)
  }
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, { loginRequest })(withRouter(LoginAdmin))
