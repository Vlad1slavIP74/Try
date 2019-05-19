import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-grid-system'
import { Tab, Dropdown, Button, Input, Icon, Accordion, Popup } from 'semantic-ui-react'
import { DateTimePicker } from 'react-widgets'
import styled from 'styled-components'
import { getBetsNotConfirmed, getBetsNotSelectedWinner, adminConfirmBet, adminCloseBet, adminChangeBet } from 'common/api'
import { getSecretToken } from 'common/modules/auth'
import { validate } from 'common/modules/validation'
import moment from 'moment'
import {bets} from 'config'
import _ from 'lodash'

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
} from 'common/components/BetForm/style'

const betTypes = bets.categories

const panes = [
	{ menuItem: 'Активные ставки', render: null },
	{ menuItem: 'Выбрать победителя', render: null }
]

const MarginTop = styled.div`
  margin-top: 20px;
`

const MarginRight = styled.div`
  margin-right: 25px;
  display: -webkit-inline-box;
  vertical-align: middle;
`

const Bold = styled.b`
`

const BigText = styled.p`
  font-size: 20px;
`

const DesktopCurrencyBet = styled.span`
  color: ${props => props.rise ? '#29ca82' : '#e06362'};
`

class Bets extends Component {
  state = {
  	tabIndex: 0,
  	detailedId: -1,
  	winner_id: -1,
  	bets: []
  }

  componentWillMount () {
  	this.fetchBetsNotConfirmet()
  }

  fetchBetsNotConfirmet = () => {
  	getBetsNotConfirmed(null, { Authorization: `user ${getSecretToken()}` })
  		.then(res => this.setState({ bets: res.bets }))
  }

  fetchBetsNotSelectedWinner = () => {
  	getBetsNotSelectedWinner(null, { Authorization: `user ${getSecretToken()}` })
  		.then(res => this.setState({ bets: res.bets }))
  }

  handleClick = (e, titleProps) => {
  	const { index } = titleProps
  	const { detailedId } = this.state
  	const newIndex = detailedId === index ? -1 : index

  	this.setState({ detailedId: newIndex })
  }

  handleBetConfirm = (b_id, status) => {
  	adminConfirmBet({
  		b_id,
  		status
  	}, {
  		Authorization: `user ${getSecretToken()}`
  	}).then(res => {
  		this.fetchBetsNotConfirmet()
  		this.setState({ detailedId: -1, winner_id: -1 })
  	})
  }

  handleBetClose = (b_id, winner_id) => {
  	adminCloseBet({
  		b_id,
  		winner_id
  	}, {
  		Authorization: `user ${getSecretToken()}`
  	}).then(res => {
  		this.fetchBetsNotSelectedWinner()
  		this.setState({ detailedId: -1, winner_id: -1 })
  	})
  }

  handleTabChange = (e, data) => {
  	this.setState({ tabIndex: data.activeIndex, winner_id: -1 })

  	data.activeIndex === 0
  		? this.fetchBetsNotConfirmet()
  		: this.fetchBetsNotSelectedWinner()
  }

  handleChangeDate = (date) => {
  	this.setState({
  		changingBetData: {
  			...this.state.changingBetData,
  			dateObj: date,
  			date: moment(date).format('YYYY-MM-DD HH:mm')
  		}
  	})
  }

  onChangeCategoryType = (e, data) => {
  	let betSubcategories = _.find(betTypes, { value: data.value }).subcategories

  	this.setState({
  		changingBetData: {
    		type: data.value,
    		categoriesTypes: betSubcategories.length ? betSubcategories : null,
    		ext_data: { condition_cur: 'grn', up: false },
    		subcategory: '',
  			source: '',
  			bid_description: '',
  			bid_amount: this.state.changingBetData.bid_amount,

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
    	}
  	})
  }

  openChangingBet = (item) => this.setState({ changingBet: true, changingBetData: item })

  cancelChangingBet = () => this.setState({ changingBet: false, changingBetData: null })

  updateBet = () => {
  	const {
  		type,
  		date,
  		bid_amount,
  		bid_description,
  		source,
  		ext_data,

  		categoriesTypes
  	} = this.state.changingBetData

  	const { user, location } = this.props

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
  	adminChangeBet({
  		type,
  		date,
  		bid_description,
  		source,
  		ext_data,
  		bets_id: this.state.detailedId
  	  }, {
  		Authorization: `user ${getSecretToken()}`
  	})
  		.then(res => {
  			this.cancelChangingBet()
  			this.fetchBetsNotConfirmet()
  		})
  }

  render () {
  	const toCurrencyIcon = (value) => {
  		let getSymbol = () => {
  			if (value === 'rub') {
  				return ' &#8381;'
  			}
  			if (value === 'usd') {
  				return ' &#36;'
  			}
  			if (value === 'eur') {
  				return ' &euro;'
  			}

  			return ' &#8372;'
  		}
  		return <span dangerouslySetInnerHTML={{__html: getSymbol()}} />
  	}
  	const {
  		tabIndex,
  		changingBet,
  		changingBetData,
  		detailedId,
  		winner_id,
  		bets,

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

  	console.log(this.state)

  	return (
  		<div>
  			<Tab
  				menu={{ secondary: true, pointing: true }}
  				panes={panes}
  				activeIndex={tabIndex}
  				onTabChange={this.handleTabChange}/>

  			<MarginTop>

    				{bets.length
  						? <Accordion fluid styled>
      						{bets.map((item, index) =>
          					<div key={item.b_id}>
        							<Accordion.Title
            						active={detailedId === item.b_id}
            						index={item.b_id}
            						onClick={this.handleClick}
            					>
            						<Icon name='dropdown' />
            						{index + 1}. {item.bid_description}
            					</Accordion.Title>
        							<Accordion.Content active={detailedId === item.b_id}>
        								<p>
      										<Bold>Условия победы </Bold>:
      										{item.ext_data.condition}
      										{(item.type === 2 || item.type === 3) && <DesktopCurrencyBet rise={item.ext_data.up}>{toCurrencyIcon(item.ext_data.condition_cur)} <Icon name={item.ext_data.up ? 'caret up' : 'caret down'} /></DesktopCurrencyBet>}
      									</p>
      									<p><Bold>Сумма ставки</Bold>: {item.bid_amount} грн.</p>
      									<p><Bold>Дата события</Bold>: {moment(item.date).format('HH:mm, DD/MM/YYYY')}</p>
        								<p><Bold>Источник</Bold>: {item.source}</p>

        								{tabIndex === 0
        									? (changingBet ? <div style={{ marginTop: 40 }}>
        											<Line>
        												<CategoryName>Категория</CategoryName>
        												<StyledDropdown
        													selection
        													placeholder='Спорт'
        													className='w-150'
        													error={errorType}
        													options={betTypes}
        													value={changingBetData.type}
        													onChange={this.onChangeCategoryType}/>
        											</Line>
        											{changingBetData.categoriesTypes && <Line>
        												<CategoryName>Подкатегория</CategoryName>
        												<StyledDropdown
        													selection
        													placeholder={changingBetData.categoriesTypes[0].text}
        													className='w-150'
        													error={errorSubCategory}
        													options={changingBetData.categoriesTypes}
        													value={changingBetData.ext_data.subcategory}
        													onChange={(e, data) => this.setState({ changingBetData: {...changingBetData, ext_data: {...changingBetData.ext_data, subcategory: data.value}} })}/>
        											</Line>}

        											{(changingBetData.type === 0 || changingBetData.type === 1 || changingBetData.type === 4) && <Line>
        												<CategoryName>Событие</CategoryName>
        												{changingBetData.type === 4 ? <StyledTextArea
        													rows={2}
        													autoHeight
        													placeholder='Укажите событие на которое хотите сделать прогноз'
        													className='w-250'
        													error={errorBidDescription}
        													value={changingBetData.bid_description}
        													onChange={(e, data) => this.setState({ changingBetData: {...changingBetData, bid_description: data.value} })}
        												/>
        													: <StyledInput
        														placeholder={'Команда А - Команда Б'}
        														className='w-250'
        														error={errorBidDescription}
        														value={changingBetData.bid_description}
        														onChange={(e, data) => this.setState({ changingBetData: {...changingBetData, bid_description: data.value} })}
        													/>}
        											</Line>}
        											{(changingBetData.type === 2) && <Line>
        												<CategoryName>Акции компании</CategoryName>
        												<StyledInput
        													placeholder='Название компании'
        													className='w-250'
        													error={errorBidDescription}
        													value={changingBetData.bid_description}
        													onChange={(e, data) => this.setState({ changingBetData: {...changingBetData, bid_description: data.value} })}/>
        											</Line>}

        											{(changingBetData.type === 0 || changingBetData.type === 1 || changingBetData.type === 4) && <Line>
        												<Popup
        													trigger={<CategoryNameWithDescription>Ставка</CategoryNameWithDescription>}
        													content='Укажите свой прогноз на событие' />
        												<StyledInput
        													placeholder={(changingBetData.type === 4 && 'Укажите исход/победителя') || 'Укажите победителя'}
        													className='w-250'
        													error={errorCondition}
        													value={changingBetData.ext_data.condition}
        													onChange={(e, data) => this.setState({ changingBetData: {...changingBetData, ext_data: {...changingBetData.ext_data, condition: data.value}} })}/>
        											</Line>}
        											{(changingBetData.type === 2 || changingBetData.type === 3) && <Line>
        												<Popup
        													trigger={<CategoryNameWithDescription>Ставка</CategoryNameWithDescription>}
        													content='Укажите свой прогноз на событие' />
        												<StyledInput
        													label={{
        														basic: true,
        														content:
                                        <CurrencySelect
                                        	name='currency'
                                        	value={changingBetData.ext_data.condition_cur}
                                        	onChange={e => this.setState({ changingBetData: {...changingBetData, ext_data: {...changingBetData.ext_data, condition_cur: e.target.value}} })}
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
        													error={errorCondition}
        													value={changingBetData.ext_data.condition}
        													onChange={(e, data) => this.setState({ changingBetData: {...changingBetData, ext_data: {...changingBetData.ext_data, condition: data.value}} })}
        												/>
        												<SharesGroup error={errorUp}>
        													<SharesButton
        														color={changingBetData.ext_data.up === false ? 'red' : null }
        														onClick={() => this.setState({ changingBetData: {...changingBetData, ext_data: {...changingBetData.ext_data, up: false}} })}
        													>
                                        Ниже
        													</SharesButton>
        													<SharesButton
        														color={changingBetData.ext_data.up === true ? 'green' : null }
        														onClick={() => this.setState({ changingBetData: {...changingBetData, ext_data: {...changingBetData.ext_data, up: true}} })}
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
  													disabled={true}
        													labelPosition='right'
        													className='w-70'
        													placeholder=''
        													error={errorBidAmount}
        													value={changingBetData.bid_amount}
        													onChange={(e, data) => this.setState({ changingBetData: {...changingBetData, bid_amount: parseInt(data.value) || 0} })}
        												/>
        												<KoefValue>кеф. 1.9</KoefValue>
        											</Line>
        											<Line>
        												<Popup
        													trigger={<CategoryNameWithDescription>Дата</CategoryNameWithDescription>}
        													content='Укажите точную дату и время, когда событие по вашей ставке произойдет.' />
        												<DateTimePicker
        													containerClassName={`date-time-picker w-250 ${errorDate ? 'datetimepicker-error' : ''}`}
        													placeholder={`00:00 дд/мм/гггг`}
        													min={new Date()}
        													step={1}
        													value={changingBetData.dateObj ? changingBetData.dateObj : new Date(changingBetData.date)}
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
        														(changingBetData.type === 0 && 'www.myscore.com.ua/') ||
                                        (changingBetData.type === 1 && 'www.myscore.ua/esports') ||
                                        (changingBetData.type === 3 && 'www.google.com.ua') ||
                                        'https://www.nasdaq.com...'
        													}
        													className='w-250'
        													error={errorSource}
        													value={changingBetData.source}
        													onChange={(e, data) => this.setState({ changingBetData: {...changingBetData, source: data.value} })}/>
        											</Line>

        											{errorRequiredFields && <ErrorText>
                                    Все поля обязательны для заполнения
        											</ErrorText>}

  											<Button basic onClick={() => this.cancelChangingBet()}>Отменить</Button>
  											<Button primary onClick={() => this.updateBet()}>Сохранить</Button>
        										</div> : <div>
        											<Button basic onClick={() => this.handleBetConfirm(item.b_id, -1)}>Удалить</Button>
        											<Button primary onClick={() => this.openChangingBet(item)}>Редактировать</Button>
        										</div>)
        									: <div>
        										<MarginRight>
          										<Dropdown
          											placeholder='Победитель'
          											selection
          											options={[
          												{ text: 'Создатель', value: item.creator_id },
          												{ text: 'Присоеденившийся', value: item.joiner_id }
          											]}
  													value={winner_id}
  													onChange={(e, data) => this.setState({ winner_id: data.value })}
          										/>
        										</MarginRight>
        										<Button primary onClick={() => this.handleBetClose(item.b_id, winner_id)}>Подтвердить</Button>
        									</div>
        								}
        							</Accordion.Content>
        						</div>
          				)}
      					</Accordion>

  						: <BigText>Ничего не найдено</BigText>
  					}
  			</MarginTop>
  		</div>
  	)
  }
}

const mapStateToProps = ({ bets }) => ({
	bets
})

export default connect(mapStateToProps, null)(Bets)
