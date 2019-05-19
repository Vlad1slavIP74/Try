import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Visible, Hidden } from 'react-grid-system'
import { Dropdown, Input, TextArea, Button, Icon, Segment, Popup, Portal } from 'semantic-ui-react'
import CustomModal from 'common/components/Modal'
import styled from 'styled-components'
import { DateTimePicker } from 'react-widgets'
import _ from 'lodash'
import moment from 'moment'
import { validate } from 'common/modules/validation'
import { connect } from 'react-redux'
import { TO_SIGNUP_PAGE } from 'common/constants/router'
import { getBetsRequest, createBetRequest, joinBetRequest } from 'common/actions/bets'
import { redirectRequest } from 'common/actions/router'
import { getSecretToken } from 'common/modules/auth'
import ReactGA from 'react-ga'

import ModalContent from 'common/components/ModalContent'
import ModalTitle from 'common/components/ModalTitle'

import {bets} from 'config'
import {correctBetsParamsIfWrong} from 'common/modules/url'

import {
	Line,
	CategoryName,
	CategoryNameWithDescription,
	StyledDropdown,
	StyledInput,
	StyledTextArea,
	CurrencySelect,
	SharesGroup,
	SharesButton,
	ErrorAnimatedBlock,
	KoefValue,
	ErrorText,
	ActionButton,
	Info
} from './style'

const betTypes = bets.categories

const getIsCreating = (props) => props.layout.betFormCreating

class BetForm extends Component {
	constructor (props) {
		super(props)

		const isCreating = getIsCreating(this.props)
		const createdData = this.props.layout.defaultBetData

		const defaultCreatingState = {
			type: '',
			date: '',
			dateObj: undefined,
			bid_amount: '',
			source: '',
			ext_data: { condition_cur: 'grn', up: false },
			categoriesTypes: null
		}

		const defaultJoiningState = createdData

		this.state = isCreating ? defaultCreatingState : defaultJoiningState
	}

	componentWillMount () {
		if (_.isEmpty(this.props.auth.user)) {
			this.checkAuth(this.props.auth.user)
		}
	}

	componentWillReceiveProps (nextProps) {
		const isCreating = getIsCreating(nextProps)

		if (isCreating
			? (this.props.bets.create.loading && !nextProps.bets.create.loading && !nextProps.bets.create.error)
			: (this.props.bets.join.loading && !nextProps.bets.join.loading && !nextProps.bets.join.error)
		) {
			this.props.onClose()
			this.updateBetsList(nextProps)
		}

		if (_.isEmpty(nextProps.auth.user)) {
			this.checkAuth(nextProps.auth.user)
		}
	}

  onChangeCategoryType = (e, data) => {
  	let betSubcategories = _.find(betTypes, { value: data.value }).subcategories

  	this.setState({
  		type: data.value,
  		categoriesTypes: betSubcategories.length ? betSubcategories : null,
  		ext_data: { condition_cur: 'grn', up: false },
  		subcategory: '',
  		errorRequiredFields: false,
  		errorType: false,
  		errorSubCategory: false,
  		errorBidAmount: false,
  		errorBidDescription: false,
  		errorCondition: false,
  		errorUp: false,
  		errorDate: false,
  		errorSource: false,

  		errorBidAmountText: false
  	})
  }

  handleChangeDate = (date) => {
  	this.setState({
  		dateObj: date,
  		date: moment(date).format('YYYY-MM-DD HH:mm')
  	})
  }

  checkAuth = (user) => {
  	if (_.isEmpty(user)) {
  		this.redirectToLogin()
  	}
  }

  redirectToLogin = () => {
  	this.props.onClose()
  	this.props.redirectRequest({ to: TO_SIGNUP_PAGE, next: this.props.location.pathname })
  }

  createBet = () => {
  	const {
  		type,
  		date,
  		bid_amount,
  		bid_description,
  		source,
  		ext_data,

  		categoriesTypes
  	} = this.state

  	const { user, location } = this.props

  	// Редирект на страницу регистрации, если не авторизован
  	if (_.isEmpty(user)) {
  		return this.redirectToLogin()
  	}

  	// validation
  	let errorRequiredFields = false,
  		errorType = false,
  		errorSubCategory = false,
  		errorBidAmount = false,
  		errorBidDescription = false,
  		errorCondition = false,
  		errorUp = false,
  		errorDate = false,
  		errorSource = false,

  		errorBidAmountText = ''

  	// Проверка на нули
  	if (!validate('not_null', type)) { errorRequiredFields = true }

  	if (type !== 3 && !validate('not_null', bid_description)) { errorRequiredFields = true }

  	if (!validate('not_null', categoriesTypes ? ext_data.subcategory : true)) { errorRequiredFields = true }

  	if ([0, 1, 4].indexOf(type) > -1
  		? !validate('not_null', ext_data.condition)
  		: _.isNull(ext_data.up) || _.isUndefined(ext_data.up)
  	) { errorRequiredFields = true }

  	if (!validate('not_null', date)) { errorRequiredFields = true }

  	if (!validate('not_null', source)) { errorRequiredFields = true }

  	// Проверка баланса и суммы ставки
  	if (bid_amount > user.balans) {
  		errorBidAmount = true
  		errorBidAmountText = <div>
  			<p>Для создания ставки у вас недостаточно средств.</p>
  			{bid_amount > user.balans ? <Link to='/dashboard/deposit' onClick={this.props.onClose}>Пополните свой счет.</Link> : ''}
  		</div>
  	}

  	if (bid_amount < 50) {
  		errorBidAmount = true
  		errorBidAmountText = bid_amount && <div>
  			<p>Минимальная сумма ставки 50грн.</p>
  			{bid_amount > user.balans ? <Link to='/dashboard/deposit' onClick={this.props.onClose}>Пополните свой счет.</Link> : ''}
  		</div>
  	}

  	// Проверки еще раз всех полей
  	if (!validate('not_null', type)) {
  		errorType = true
  	}

  	if (!validate('not_null', categoriesTypes ? ext_data.subcategory : true)) {
  		errorSubCategory = true
  	}

  	if (type !== 3 && !validate('not_null', bid_description)) {
  		errorBidDescription = true
  	}

  	if ([0, 1, 4].indexOf(type) > -1 && !validate('not_null', ext_data.condition)) {
  		errorCondition = true
  	}

  	if ([0, 1, 4].indexOf(type) === -1 && _.toNumber(ext_data.condition || 0) <= 0) {
  		errorCondition = true
  	}

  	if ([0, 1, 4].indexOf(type) === -1 && !validate('not_null', ext_data.up)) {
  		errorUp = true
  	}

  	if (!validate('not_null', date)) {
  		errorDate = true
  	}

  	if (!validate('not_null', source)) {
  		errorSource = true
  	}

  	this.setState({
  		errorRequiredFields,
  		errorType,
  		errorSubCategory,
  		errorBidAmount,
  		errorBidDescription,
  		errorCondition,
  		errorUp,
  		errorDate,
  		errorSource,

  		errorBidAmountText
  	})

  	if (errorRequiredFields || errorType || errorSubCategory || errorBidAmount || errorBidDescription || errorCondition || errorUp || errorDate || errorSource) {
  		return
  	}

  	// Fetching data
  	ReactGA.event({
  		category: 'bets',
  		action: 'create-bet',
  		label: 'create-bet-button'
  	})

  	this.props.createBetRequest({
  		creator_id: user.u_id,
  		type,
  		date,
  		bid_amount,
  		bid_description,
  		source,
  		ext_data
  	}, { Authorization: `user ${getSecretToken()}` })
  }

  joinBet = (item) => {
  	const { user } = this.props
  	const { b_id, bid_amount } = this.state

  	let errorBidAmount = false, errorBidAmountText = ''

  	// Редирект на страницу регистрации, если не авторизован
  	if (_.isEmpty(user)) {
  		return this.redirectToLogin()
  	}

  	if (bid_amount > user.balans) {
  		errorBidAmount = true
  		errorBidAmountText = 'Для создания ставки у вас недостаточно средств'
  	}

  	this.setState({ errorBidAmount, errorBidAmountText })

  	if (errorBidAmount) {
  		return
  	}

  	// Fetching data
  	ReactGA.event({
  		category: 'bets',
  		action: 'join-bet',
  		label: 'join-bet-button'
  	})

  	this.props.joinBetRequest({
  		b_id,
  		bid_amount,
  		joiner_id: user.u_id
  	}, { Authorization: `user ${getSecretToken()}` })
  }

  updateBetsList = (props) => {
  	this.props.getBetsRequest(correctBetsParamsIfWrong(props.location.search))
  }

  render () {
  	const {
  		type,
  		date,
  		dateObj,
  		bid_amount,
  		bid_description,
  		source,
  		ext_data,
  		status,

  		categoriesTypes,

  		errorRequiredFields,
  		errorType,
  		errorSubCategory,
  		errorBidAmount,
  		errorBidDescription,
  		errorCondition,
  		errorUp,
  		errorDate,
  		errorSource,

  		errorBidAmountText
  	} = this.state

  	const { onClose } = this.props

  	const open = this.props.layout.betFormOpen
  	const isAuthed = !_.isEmpty(this.props.auth.user)
  	const creatingBetStatus = this.props.bets.create
  	const joiningBetStatus = this.props.bets.join
  	const isCreating = getIsCreating(this.props)

  	const ACTION_STATUS = isCreating ? creatingBetStatus : joiningBetStatus

  	const IS_LOADING = ACTION_STATUS.loading === true

  	console.log(this.state)

  	return (
  		<CustomModal
  			closeIcon={<div className="close icon"></div>}
  			dimmer={true}
  			closeOnDimmerClick={true}
  			open={open}
  			onClose={onClose}
  		>
  			<ModalContent largePadding>
  				<ModalTitle small>
  					{isCreating
  						? 'Создать новую ставку'
  						: (
  							status === 0
  								? 'Поставить против ставки'
  								: 'Детали ставки'
  						)}
  				</ModalTitle>

  				<Line>
  					<CategoryName>Категория</CategoryName>
  					<StyledDropdown
  						selection
  						placeholder='Спорт'
  						className='w-150'
  						disabled={IS_LOADING || !isCreating}
  						error={errorType}
  						options={betTypes}
  						value={type}
  						onChange={this.onChangeCategoryType}/>
  				</Line>
  				{categoriesTypes && <Line>
  					<CategoryName>Подкатегория</CategoryName>
  					<StyledDropdown
  						selection
  						placeholder={categoriesTypes[0].text}
  						className='w-150'
  						disabled={IS_LOADING || !isCreating}
  						error={errorSubCategory}
  						options={categoriesTypes}
  						value={ext_data.subcategory}
  						onChange={(e, data) => this.setState({ ext_data: { ...ext_data, subcategory: data.value } })}/>
  				</Line>}

  				{(type === 0 || type === 1 || type === 4) && <Line>
  					<CategoryName>Событие</CategoryName>
  					{type === 4 ? <StyledTextArea
  						rows={2}
  						autoHeight
  						placeholder='Укажите событие на которое хотите сделать прогноз'
  						className='w-250'
  						disabled={IS_LOADING || !isCreating}
  						error={errorBidDescription}
  						value={bid_description}
  						onChange={(e, data) => this.setState({ bid_description: data.value })}
  					/>
  						: <StyledInput
  							placeholder={'Команда А - Команда Б'}
  							className='w-250'
  							disabled={IS_LOADING || !isCreating}
  							error={errorBidDescription}
  							value={bid_description}
  							onChange={(e, data) => this.setState({ bid_description: data.value })}
  						/>}
  				</Line>}
  				{(type === 2) && <Line>
  					<CategoryName>Акции компании</CategoryName>
  					<StyledInput
  						placeholder='Название компании'
  						className='w-250'
  						disabled={IS_LOADING || !isCreating}
  						error={errorBidDescription}
  						value={bid_description}
  						onChange={(e, data) => this.setState({ bid_description: data.value })}/>
  				</Line>}

  				{(type === 0 || type === 1 || type === 4) && <Line>
  					<Popup
  						trigger={<CategoryNameWithDescription>Ставка</CategoryNameWithDescription>}
  						content='Укажите свой прогноз на событие' />
  					<StyledInput
  						placeholder={(type === 4 && 'Укажите исход/победителя') || 'Укажите победителя'}
  						className='w-250'
  						disabled={IS_LOADING || !isCreating}
  						error={errorCondition}
  						value={ext_data.condition}
  						onChange={(e, data) => this.setState({ ext_data: { ...ext_data, condition: data.value } })} />
  				</Line>}
  				{(type === 2 || type === 3) && <Line>
  					<Popup
  						trigger={<CategoryNameWithDescription>Ставка</CategoryNameWithDescription>}
  						content='Укажите свой прогноз на событие' />
  					<StyledInput
  						label={{
  							basic: true,
  							content:
                <CurrencySelect
                	name='currency'
                	value={ext_data.condition_cur}
                	onChange={e => this.setState({ ext_data: { ...ext_data, condition_cur: e.target.value } })}
                >
                	<option value="grn">&#8372;</option>
                	<option value="rub">&#8381;</option>
                	<option value="usd">&#36;</option>
                	<option value="eur">&euro;</option>
                </CurrencySelect>
  						}}
  						labelPosition='right'
  						className='w-75'
  						placeholder='Курс'
  						disabled={IS_LOADING || !isCreating}
  						error={errorCondition}
  						value={ext_data.condition}
  						onChange={(e, data) => this.setState({ ext_data: { ...ext_data, condition: data.value } })}
  					/>
  					<SharesGroup error={errorUp}>
  						<SharesButton
  							color={ext_data.up === false ? 'red' : null }
  							onClick={() => this.setState({ ext_data: { ...ext_data, up: false } })}
  						>
                Ниже
  						</SharesButton>
  						<SharesButton
  							color={ext_data.up === true ? 'green' : null }
  							onClick={() => this.setState({ ext_data: { ...ext_data, up: true } })}
  						>
                Выше
  						</SharesButton>
  					</SharesGroup>
  				</Line>}

  				<Line>
  					{errorBidAmount && errorBidAmountText ? <ErrorAnimatedBlock>
  						{errorBidAmountText}
  					</ErrorAnimatedBlock> : ''}

  					<CategoryName>Сумма</CategoryName>
  					<StyledInput
  						label={{
  							basic: true,
  							content: <CurrencySelect name='currency'>
  								<option value="грн">&#8372;</option>
  							</CurrencySelect>
  						}}
  						labelPosition='right'
  						className='w-70'
  						disabled={IS_LOADING || !isCreating}
  						placeholder=''
  						error={errorBidAmount}
  						value={bid_amount}
  						onChange={(e, data) => this.setState({ bid_amount: parseInt(data.value) || 0 })}
  					/>
  					<KoefValue>кеф. 1.9</KoefValue>
  				</Line>
  				<Line>
  					<Popup
  						trigger={<CategoryNameWithDescription>Дата</CategoryNameWithDescription>}
  						content='Укажите точную дату и время, когда событие по вашей ставке произойдет.' />
  					<DateTimePicker
  						disabled={IS_LOADING || !isCreating}
  						containerClassName={`date-time-picker w-250 ${errorDate ? 'datetimepicker-error' : ''}`}
  						placeholder={`00:00 дд/мм/гггг`}
  						min={new Date()}
  						step={1}
  						value={isCreating ? dateObj : moment(date).toDate()}
  						onChange={this.handleChangeDate}
  						onKeyPress={(e) => e.preventDefault()}
  						onKeyDown={(e) => e.preventDefault()}
  					/>
  				</Line>
  				<Line>
  					<Popup
  						trigger={<CategoryNameWithDescription>Источник</CategoryNameWithDescription>}
  						content='Укажите ссылку на независимый ресурс, который подтвердит исход события' />
  					<StyledInput
  						underlinedinput='true'
  						placeholder={
  							(type === 0 && 'www.myscore.com.ua/') ||
                (type === 1 && 'www.myscore.ua/esports') ||
                (type === 3 && 'www.google.com.ua') ||
                'https://www.nasdaq.com...'
  						}
  						className='w-250'
  						disabled={IS_LOADING || !isCreating}
  						error={errorSource}
  						value={source}
  						onChange={(e, data) => this.setState({source: data.value})}/>
  				</Line>

  				{errorRequiredFields && <ErrorText>
            Все поля обязательны для заполнения
  				</ErrorText>}

  			</ModalContent>

  			{isCreating &&
          <ActionButton
          	primary
          	fluid
          	loading={IS_LOADING}
          	onClick={this.createBet}>Создать</ActionButton>}

  			{!isCreating && status === 0 &&
          <ActionButton
          	primary
          	fluid
          	loading={IS_LOADING}
          	onClick={this.joinBet}>Поставить против</ActionButton>}

  			{!isCreating && status === 1 &&
            <Info>Ставка закрыта</Info>}
  		</CustomModal>
  	)
  }
}

const mapStateToProps = ({ auth, bets, layout }) => ({
	auth,
	bets,
	layout
})

export default connect(mapStateToProps, { getBetsRequest, createBetRequest, joinBetRequest, redirectRequest })(BetForm)
