import React, {Component} from 'react'
import { Row, Col, Visible, Hidden } from 'react-grid-system'
import { Table, Input, Button, Dropdown, Icon, Checkbox } from 'semantic-ui-react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { validate } from 'common/modules/validation'
import { renewTokenRequest } from 'common/actions/auth'
import { makeDeposit, renewToken } from 'common/api'
import { getSecretToken } from 'common/modules/auth'
import ReactGA from 'react-ga'

import LightButton from 'common/components/LightButton'
import PaymentButton from 'common/components/PaymentButton'
import {fondy} from 'config'
import {getUrlWithPath} from 'common/utils/hostname'

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

const currencies = [
	{key: 1, value: 'UAH', text: 'UAH'},
	{key: 2, value: 'USD', text: 'USD'},
	{key: 3, value: 'RUB', text: 'RUB'},
	{key: 3, value: 'EUR', text: 'EUR'}
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
  width: 130px !important;

  & > input {
    width: 100px;
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
      border-left: 0px !important;'UAH'
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

const initialState = {
	method: 'privat',
	amount: '',
	country: 'ua',
	agreePolitic: true,
	currency: 'USD'
}

class Deposit extends Component {
  state = initialState

  componentWillMount () {
  	const token = getSecretToken()
  	this.props.renewTokenRequest({ token }, { Authorization: `user ${token}` })
  }

  handleChangeData = name => (e, data) => this.setState({ [name]: data.value })

	handleChangeCurrency = (event) => {
		this.setState({
			currency: event.target.value
		})
		console.log('hello ' + event.target.value)
	}

  checkPayments = (e) => {
  	const { amount, agreePolitic } = this.state

  	let errorAmount = false
  	let errorAgreePolitic = false

  	if (!validate('not_null', amount) || amount <= 0) {
  		errorAmount = true
  	}

  	if (!agreePolitic) {
  		errorAgreePolitic = true
  	}

  	this.setState({ errorAmount, errorAgreePolitic })

  	if (errorAmount || errorAgreePolitic) return e.preventDefault()

  	// window.ga('send', 'event', 'pay-button', 'startpay', 'podtverdit-button')

  	ReactGA.event({
  		category: 'pay',
  		action: 'startpay',
  		label: 'pay-button-start'
  	})
  	// this.setState(initialState)
  }

  closePayForm = () => {

  }

  handleSuccessedPay = () => {
  	const { u_id } = this.props.auth.user
  	const { amount } = this.state
  	const token = getSecretToken()

  	makeDeposit({
    		u_id,
    		payed: amount
    	}, {
  		  Authorization: `user ${token}`
  	  })
  		.then(res => {
  			this.props.renewTokenRequest({ token }, { Authorization: `user ${token}` })
  		})
  }

  render = () => {
  	const { u_id } = this.props.auth.user
  	const { dark } = this.props
  	const { method, amount, country, errorAmount, currency } = this.state

  	return (
  		<div style={{ marginTop: 20 }}>
  			<Hidden xs sm>
    			<Table columns={5} compact='very' collapsing inverted={dark}>
    				<Table.Header>
    					<HeaderRow>
    						{/* <Table.HeaderCell>Метод платежа</Table.HeaderCell> */}
    						<Table.HeaderCell>Сумма</Table.HeaderCell>
    						<Table.HeaderCell>Ваша страна</Table.HeaderCell>
  							<Table.HeaderCell>Валюта</Table.HeaderCell>
    						<Table.HeaderCell></Table.HeaderCell>
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
	                      	value={currency}
	                      	onChange={this.handleChangeCurrency}
	                      >
	                      	<option value="UAH">&#8372;</option>
	                      	<option value="USD">&#x24;</option>
	                      	<option value="RUB">&#8381;</option>
	                      	<option value="EUR">&#8364;</option>
	                      </CurrencySelect>
	  									}}
	  									labelPosition='right'
	    								placeholder=''
	    								error={errorAmount}
	    								value={amount}
	    								onChange={this.handleChangeData('amount')}/>
	    						</Table.Cell>

    						<Table.Cell>
    							<DropdownColorMode
  									dark={dark}
  									selection
    								placeholder=''
    								options={countries}
    								value={country}
    								onChange={this.handleChangeData('country')}/>
    						</Table.Cell>

  							{/* For choosing currency
  							<Table.Cell>
  								<DropdownColorMode
  									dark={dark}
  									selection
  									placeholder=''
  									options={currencies}
  									value={currency}
  									onChange={this.handleChangeData('currency')}/>
  							</Table.Cell> */}

  							<Table.Cell>
  								<Checkbox
  									defaultChecked={true}
  									label={<StyledLabel dark={dark}>
                      Согласен с <Link href='https://alfakasta.com/policies' target='_blank' rel="noopener noreferrer">условиями сайта и возврата средств</Link>
  									</StyledLabel>}
  									onClick={(e, data) => this.setState({ agreePolitic: data.checked })}/>
  							</Table.Cell>
    						<Table.Cell>
    							<PaymentButton
  									dark={dark}
    								label="Внести депозит"
    								onClick={this.checkPayments}
    								u_id={u_id}
    								pay_amount={parseInt(amount || 0)}
    								pay_currency={this.state.currency}
    								payment_desc='Пополнение внутреннего баланса Alfakasta.com'
    								ik_suc_u={typeof window !== 'undefined' && getUrlWithPath('/dashboard/deposit')}
    								ik_ia_u={typeof window !== 'undefined' && getUrlWithPath('/api/v1/account/deposit')}
    								ik_ia_m={'POST'}
    							/>
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
                	value={currency}
                	onChange={this.handleChangeCurrency}
                >
                	<option value="UAH">&#8372;</option>
                	<option value="USD">&#x24;</option>
                	<option value="RUB">&#8381;</option>
                	<option value="EUR">&#8364;</option>
                </CurrencySelect>
  						}}
  						labelPosition='right'
  						placeholder=''
  						error={errorAmount}
  						value={amount}
  						onChange={this.handleChangeData('amount')}
  					/>
  					<MobileLabel>Ваша страна</MobileLabel>
    				<DropdownColorMode
  						dark={dark}
    					selection
    					placeholder=''
    					options={countries}
    					value={country}
    					onChange={this.handleChangeData('country')}
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
    				<PaymentButton
  						dark={dark}
    					label="Внести депозит"
    					onClick={this.checkPayments}
    					u_id={u_id}
    					pay_amount={parseInt(amount || 0)}
    					pay_currency={this.state.currency}
    					payment_desc='Пополнение внутреннего баланса Alfakasta.com'
    					ik_suc_u={typeof window !== 'undefined' && getUrlWithPath('/dashboard/deposit')}
    					ik_ia_u={typeof window !== 'undefined' && getUrlWithPath('/api/v1/account/deposit')}
    					ik_ia_m={'POST'}
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

export default connect(mapStateToProps, { renewTokenRequest })(Deposit)
