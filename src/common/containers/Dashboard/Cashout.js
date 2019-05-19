import React, {Component} from 'react'
import sha256 from 'sha256'
import { Row, Col, Visible, Hidden } from 'react-grid-system'
import { Table, Dropdown, Form, Input, Icon, Checkbox } from 'semantic-ui-react'
import NumberFormat from 'react-number-format'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { validate } from 'common/modules/validation'
import { renewTokenRequest } from 'common/actions/auth'
import { getProfilePassword, InterKassaCashout, cashout } from 'common/api'
import { getSecretToken } from 'common/modules/auth'

import LightButton from 'common/components/LightButton'
import PaymentButton from 'common/components/PaymentButton'
import {fondy} from 'config'

const methods = [
	{ key: 1, value: 'privat', text: 'Приват24' },
	{ key: 2, value: 'yandex', text: 'Яндекс деньги' },
	{ key: 3, value: 'qiwi', text: 'Qiwi кошелек' },
	{ key: 4, value: 'visa', text: 'Visa / Master card' },
	{ key: 5, value: 'scrill', text: 'Scrill' }
]

const countries = [
	{ key: 1, value: 'ua', text: 'Украина' },
	{ key: 2, value: 'ru', text: 'Россия' }
]

const Link = styled.a`
  font-size: 13px !important;
  text-decoration: underline !important;
`

const StyledLabel = styled.label`
  font-size: 13px !important;

  ${props => props.dark && `
    color: #fff !important;

    & > a {
      color: #fff !important;
    }
  `}
`

const MobileContainer = styled.div`
  margin-top: 15px;
  padding: 0px 15px;
`

const MobileLabel = styled.p`
  margin: 5px;
  margin-left: 0px !important;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #9299a2;
`

const CurrencySelect = styled.select`
  background: none !important;
  border: 0px;
  font-family: "Proxima Nova";
  font-size: 17px !important;
  font-weight: 700;
  color: #b0b0b0;
`

const ShortInput = styled(Input)`
  width: 100px !important;

  & > input {
    width: 75px;
  }
`

const HeaderRow = styled(Table.Row)`
  padding-top: 10px !important;

  & > th {
    height: 18px !important;
    padding: 0px 10px !important;
    line-height: 18px !important;
  }
`

const CardInput = styled(NumberFormat)`
  margin: 0em;
  max-width: 100%;
  flex: 1 0 auto;
  outline: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  text-align: left;
  line-height: 1.21428571em;
  font-family: 'Proxima Nova', sans-serif;
  padding: 0.62619048em 0.93333333em;
  background: #FFFFFF;
  border: 1px solid rgba(34, 36, 38, 0.15);
  color: #2b2b2b;
  border-radius: 0.26666667rem;
  transition: box-shadow 0.1s ease, border-color 0.1s ease;
  box-shadow: none;

  &:focus {
    border-color: #85B7D9 !important;
    background: #FFFFFF !important;
    color: rgba(0, 0, 0, 0.8) !important;
    box-shadow: none !important;
  }

  ${props => !props.dark && props.error && `
    background-color: #FFFFFF !important;
    border-color: #E0B4B4 !important;
    color: #9F3A38 !important;
    box-shadow: none !important;
  `}

  ${props => props.dark && props.error && `
      border-color: #5c0303 !important;
      color: #5c0303 !important;
  `}
`

const StyledDropdown = styled(Dropdown)`
  &.error {
    background: #fff !important;
  }
`

const InputColorMode = styled(Input)`
  ${props => props.dark && `
    & > input {
      border: solid 1px #212731 !important;
      background-color: #1a1f28 !important;
      color: #ffffff !important;
    }

    & > input:focus {
      border: solid 1px #4f545a !important;
    }

    &.error > input {
      border-color: #5c0303 !important;
      color: #5c0303 !important;
    }
  `}
`

const ShortInputColorMode = styled(ShortInput)`
  ${props => props.dark && `
    & > input {
      border: solid 1px #212731 !important;
      border-right: 0px !important;
      background-color: #1a1f28 !important;
      color: #ffffff !important;
    }

    & > input:focus {
      border: solid 1px #4f545a !important;
      border-right: 0px !important;
    }

    & > input + div {
      background: none !important;
      border: solid 1px #212731 !important;
      border-left: 0px !important;
    }

    & > input:focus ~ div {
      border: solid 1px #4f545a !important;
      border-left: 0px !important;
    }

    &.error > input {
      border-color: #5c0303 !important;
      color: #5c0303 !important;
    }

    &.error > div.ui.basic.label {
      border-color: #5c0303 !important;
      color: #5c0303 !important;
    }
  `}
`

const DropdownColorMode = styled(Dropdown)`
  ${props => props.dark && `
    border: solid 1px #212731 !important;
    background-color: #1a1f28 !important;
    color: #ffffff !important;

    &.visible > div {
      color: #fff !important;
    }

    & > .menu {
      border: 0px !important;
      background: none !important;
    }

    & > .menu > .item {
      border-top: 0px !important;
      color: #ffffff !important;
      background: #2f3a44 !important;
    }

    & > .menu > .item:hover {
      background: #2f3a44 !important;
      color: #525f7f !important;
    }

    &.error {
      border-color: #5c0303 !important;
      color: #5c0303 !important;
    }
  `}
`

const CardInputColorMode = styled(CardInput)`
  ${props => props.dark && `
    border: solid 1px #212731;
    background-color: #1a1f28 !important;
    color: #ffffff;

    &:focus {
      background-color: #1a1f28 !important;
      color: #ffffff !important;
      border: solid 1px #4f545a !important;
    }
  `}
`

class Cashout extends Component {
  state = {
 	  method: 'privat',
 	  amount: '',
 	  password: '',
  	cardNumber: '',
  	payType: '',
  	agreePolitic: true
  }

  componentWillMount () {
  	const token = getSecretToken()

  	getProfilePassword({
  		token
  	}, {
  		Authorization: `user ${token}`
  	})
  	.then(({ password }) => this.setState({ CUR_USER_PASSWORD: password }))

  	this.props.renewTokenRequest({ token }, { Authorization: `user ${token}` })
  }

  handleChangeData = name => (e, data) => this.setState({ [name]: data.value })

  checkPayments = (e) => {
  	e.preventDefault()

  	const { amount, password, agreePolitic, cardNumber, payType, CUR_USER_PASSWORD } = this.state
  	const { user } = this.props
  	const token = getSecretToken()

  	let errorAmount = false,
  		  errorPassword = false,
  	    errorAgreePolitic = false,
  		  errorCardNumber = false,
  		errorPayType = false

  	if (!validate('not_null', amount) || (parseInt(amount) > user.balans) || (parseInt(amount) < 1)) {
  		errorAmount = true
  	}

  	if (parseInt(amount) > user.balans) {
  		errorAmount = true
  	}

  	if (!payType) {
  		errorPayType = true
  	}

  	if (!validate('equal', sha256(password), CUR_USER_PASSWORD)) {
  		errorPassword = true
  	}

  	if (!agreePolitic) {
  		errorAgreePolitic = true
  	}

  	if (cardNumber.toString().length !== 16) {
  		errorCardNumber = true
  	}

  	this.setState({ errorPassword, errorAmount, errorAgreePolitic, errorCardNumber, errorPayType })

  	if (errorAmount || errorPassword || errorAgreePolitic || errorCardNumber || errorPayType) return

  	// Если все ок, то выводим деньги

  	const btoa = require('btoa')
  	const login = '5b62016f3d1eaf01238b4571'
  	const pass = 'Zxw1lvPZX1eW8Z4zAM23SDZTrI8HkG11'
  	const b64 = btoa(login + ':' + pass)

  	let headers = new Headers()

  	headers.append('Authorization', 'Basic ' + b64)
  	headers.append('Ik-Api-Account-Id', '5b6201a03d1eaf4a278b4569')
  	headers.append('Access-Control-Allow-Origin', '*')
  	headers.append('Access-Control-Allow-Method', 'GET, POST')
  	headers.append('Access-Control-Allow-Headers', 'Content-Type')
  	fetch('https://api.interkassa.com/v1/account', {
  		method: 'GET',
  		headers: headers
  	}).then(res => console.log(res.statusText))

  	InterKassaCashout({
  		u_id: this.props.auth.user.u_id,
  		amount: parseInt(amount),
  		card: cardNumber.toString(),
  		payType
  	})
  		.then((res) => {
  			this.setState({ cardNumber: '', amount: '', password: '' })
  			this.props.renewTokenRequest({ token }, { Authorization: `user ${token}` })
  		})

  	/*
  	fetch('https://api.interkassa.com/v1/withdraw', {
  		method: 'GET',
  		headers: {
  			'Authorization': 'Basic NWI2MjAxNmYzZDFlYWYwMTIzOGI0NTcxOnJ3ZnlHa3ZEUTh4eVRtNWNWZzZ3R2tpSFJCQ1JsRkRO',
  			'Ik-Api-Account-Id': '5b6201a03d1eaf4a278b4569'
  		},
  		data: {
  			amount: amount,
  			paywayId: '59dbc5823b1eaf791c8b456b',
  			purseId: 300656475524,
  			details,
  			calcKey: 'psPayeeAmount',
  			action: 'process'
  		}
  	})
    */
  }

  handleSuccess = () => {
  	const { u_id } = this.props.auth.user
  	const { amount } = this.state
  	const token = getSecretToken()

  	cashout({
  		u_id,
  		payed: amount
  	}, {
  		Authorization: `user ${token}`
  	})
  		.then(res => {
  			this.props.renewTokenRequest({ token }, { Authorization: `user ${token}` })
  		})
  }

  handleCancel = () => {
  	return null
  }

  render () {
  	const {
  		method,
  		amount,
  		password,
  		cardNumber,
  		payType,
  		errorAmount,
  		errorPassword,
  		errorCardNumber,
  		errorPayType
  	} = this.state
  	const { u_id } = this.props.auth.user
  	const { dark } = this.props

  	return (
  		<div style={{ marginTop: 20 }}>
  			<Hidden xs sm>
    			<Table columns={4} collapsing inverted={dark}>
    				<Table.Header>
    					<HeaderRow>
    						{/* <Table.HeaderCell>Метод платежа</Table.HeaderCell> */}
    						<Table.HeaderCell>Сумма</Table.HeaderCell>
    						<Table.HeaderCell>Ваш пароль</Table.HeaderCell>
  							<Table.HeaderCell>Способ оплаты</Table.HeaderCell>
  							<Table.HeaderCell>Номер карты</Table.HeaderCell>
    					</HeaderRow>
    				</Table.Header>
    				<Table.Body>
    					<Table.Row>
    						{/* <Table.Cell>
    							<Dropdown
    								selection
    								placeholder=''
    								options={methods}
    								value={method}
    								onChange={this.handleChangeData('method')}/>
    						</Table.Cell> */}
    						<Table.Cell>
    							<ShortInputColorMode
  									dark={dark}
  									label={{
  										basic: true,
  										content:
                      <CurrencySelect
                      	name='currency'
                      	value={'grn'}
                      >
                      	<option value="grn">&#8372;</option>
                      </CurrencySelect>
  									}}
  									labelPosition='right'
    								placeholder=''
    								value={amount}
    								error={errorAmount}
    								onChange={this.handleChangeData('amount')}/>
    						</Table.Cell>
  							<Table.Cell>
  								<InputColorMode
  									dark={dark}
  									className='w-150'
  									placeholder=''
  									value={password}
  									error={errorPassword}
  									onChange={this.handleChangeData('password')}/>
  							</Table.Cell>
  							<Table.Cell>
  								<DropdownColorMode
  									dark={dark}
  									className='w-150 no-min-width'
  									selection
  									options={[{ key: 'visa', value: 'visa', text: 'VISA' }, { key: 'master', value: 'master', text: 'Master card' }]}
  									error={errorPayType}
  									value={payType} onChange={(e, data) => this.setState({ payType: data.value })}/>
  							</Table.Cell>
  							<Table.Cell>
  								<CardInputColorMode dark={dark} className='w-185' format="#### #### #### ####" value={cardNumber} onValueChange={(values, e) => this.setState({ cardNumber: values.floatValue })} error={errorCardNumber}/>
  							</Table.Cell>
    						<Table.Cell>
    							<Checkbox
    								defaultChecked={true}
    								label={<StyledLabel dark={dark}>
                      Согласен с <Link href='https://alfakasta.com/policies' target='_blank' rel="noopener noreferrer">условиями сайта и возврата средств</Link>
    								</StyledLabel>}
    								onClick={(e, data) => this.setState({ agreePolitic: data.checked })}/>
    						</Table.Cell>
    						<Table.Cell>
  								<LightButton onClick={this.checkPayments} dark={dark}>
                    Вывести средства
  								</LightButton>
    						</Table.Cell>
    					</Table.Row>
    				</Table.Body>
    			</Table>
  			</Hidden>
  			<Visible xs sm>
  				<MobileContainer>
  					<MobileLabel>Сумма</MobileLabel>
  					<ShortInputColorMode
  						dark={dark}
  						label={{
  							basic: true,
  							content:
                <CurrencySelect
                	name='currency'
                	value={'grn'}
                >
                	<option value="grn">&#8372;</option>
                </CurrencySelect>
  						}}
  						labelPosition='right'
  						placeholder=''
  						value={amount}
  						error={errorAmount}
  						onChange={this.handleChangeData('amount')}
  					/>
  					<MobileLabel>Ваш пароль</MobileLabel>
  					<InputColorMode
  						dark={dark}
  						placeholder=''
  						value={password}
  						error={errorPassword}
  						onChange={this.handleChangeData('password')}
  					/>
  					<div style={{ margin: '15px 0px' }}>
  						<Checkbox
  							defaultChecked={true}
  							label={<StyledLabel dark={dark}>
                  Согласен с <Link href='https://alfakasta.com/policies' target='_blank' rel="noopener noreferrer">условиями сайта и возврата средств</Link>
  							</StyledLabel>}
  							onClick={(e, data) => this.setState({ agreePolitic: data.checked })}
  						/>
  					</div>
  					<MobileLabel>Способ оплаты</MobileLabel>
  					<DropdownColorMode
  						dark={dark}
  						className='w-150 no-min-width'
  						selection
  						options={[{ key: 'visa', value: 'visa', text: 'VISA' }, { key: 'master', value: 'master', text: 'Master card' }]}
  						error={errorPayType}
  						value={payType} onChange={(e, data) => this.setState({ payType: data.value })}/>
  					<MobileLabel>Номер карты</MobileLabel>
  					<CardInputColorMode dark={dark} className='w-185' format="#### #### #### ####" value={cardNumber} onValueChange={(values, e) => this.setState({ cardNumber: values.floatValue })} error={errorCardNumber}/>
  					<PaymentButton
  						dark={dark}
  						label="Вывести средства"
  						onClick={this.checkPayments}
  						u_id={u_id}
  						pay_amount={parseInt(amount || 0)}
  						pay_currency='UAH'
  						payment_desc='Вывод средств с Alfakasta.com'

  						onSuccess={this.handleSuccessedPay}
  						onError={() => console.log('ERROR')}
  						onCancel={this.closePayForm}
  					/>
  				</MobileContainer>
  			</Visible>
  		</div>
  	)
  }
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, { renewTokenRequest })(Cashout)
