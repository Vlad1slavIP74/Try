import React, {Component} from 'react'
import { Row, Col, Visible, Hidden } from 'react-grid-system'
import { Table, Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import moment from 'moment'
import _ from 'lodash'
import queryString from 'querystringify'
import { getUserBetsHistory } from 'common/api'
import { getSecretToken } from 'common/modules/auth'
import { trancateIfLong, isLonger, spaceEvery3Symbols, commaEvery3Symbols } from 'common/modules/string'
import {bets} from 'config'

import LightButton from 'common/components/LightButton'

const betTypes = bets.categories

const NothingFound = styled.p`
  text-align: left;
`

const MobileContainer = styled.div`
  margin-top: 15px;
  padding: 0px 15px;
`

const MobileLabel = styled.p`
  margin: 5px;
  margin-left: 0px !important;
  font-weight: 600;
`

const RightCol = styled(Col)`
  text-align: right !important;
`

const HrMobile = styled.hr`
  border: 0px;
  border-top: solid 1px ${props => props.dark ? '#272d38' : '#e4e8ef'};
  margin: 0px;
`
const MobilePrice = styled.p`
  font-size: 15px;
  color: #2dae74;
`

const DesktopCurrencyBet = styled.span`
  color: ${props => props.rise ? '#29ca82' : '#e06362'};
`

const UnerlinedText = styled.p`
  text-decoration: underline;
  
  ${props => props.dark && `color: #fff;`}
`

const BreakLine = styled.span`
  display: inline-block;
  max-width: 200px;
  word-wrap: break-word;

  ${props => props.dark && `color: #fff;`}
`

const NoBreakLine = styled.span`
  white-space: nowrap;
  
  ${props => props.dark && `color: #fff;`}
`

const MobileRow = styled.div`
  border-bottom: 1px solid  #e4e8ef !important;
  padding: 5px 15px 0px 15px !important;
  ${props => props.dark && `
    background: ${props => props.active ? '#f6f7f8' : '#fff'};
  `}
`

const MobileLabelBlock = styled.div`
  float: left;
  margin-top: 10px;
  padding-right: 10px;

  b {
    color: #9299a2;
  }

  ${props => props.dark && `
    & > p {
      color: #fff;
    }
  `}
`

const MobileButtonBet = styled(LightButton)`
  float: right;
  margin-top: 8px !important;
  margin-right: 0px !important;
  margin-bottom: 10px !important;
`

const MobileOwnBetText = styled.p`
  float: right;
  margin-top: 30px !important;
  margin-right: 0px !important;
  margin-bottom: 10px !important;
`

const TableWithHr = styled(Table)`
  border-collapse: collapse !important;
`

const RowWithHr = styled(Table.Row)`
  border-bottom: 1px solid  #e4e8ef !important;
`

const RightMobileBlock = styled(MobileLabelBlock)`
  float: right !important;
  padding-right: 0px !important;
`

const GrayIfDark = styled.div`
  ${props => props.dark && `color: rgb(127, 133, 139);`}
`

class History extends Component {
  state = {
  	bets: []
  }

  componentWillMount () {
  	this.updateBetsHistory(this.props.location)
  }

  componentWillReceiveProps (nextProps) {
  	if (!_.isEqual(nextProps.location, this.props.location)) {
  		this.updateBetsHistory(nextProps.location)
  	}
  }

  updateBetsHistory (location) {
  	const { last } = queryString.parse(location.search)
  	const token = getSecretToken()
  	const { u_id } = this.props.user

  	getUserBetsHistory({
  		u_id,
  		last
  	}, {
  		Authorization: `user ${token}`
  	})
  		.then(({ bets }) => this.setState({ bets }))
  }

  render () {
  	const { u_id } = this.props.user
  	const { dark } = this.props
  	const { bets } = this.state

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

  	const toCryptoName = (value) => {
  		const CryptoNames = betTypes[3].subcategories

  		const item = _.find(CryptoNames, { value })
  		return item ? item.text : 'Без категории'
  	}

  	const getColKeys = (category, index) => {
  		let array
  		if (_.indexOf([0, 1, 4], category) > -1) {
  			array = ['bid_description', 'condition', 'bid_amount', null, 'date', 'source', null]
  		} else if (category === 2) {
  			array = ['bid_description', 'condition', 'bid_amount', null, 'date', 'source', null]
  		} else if (category === 3) {
  			array = ['subcategory', 'condition', 'bid_amount', null, 'date', 'source', null]
  		}

  		return array[index]
  	}

  	return (
  		<div>
  			<Hidden xs sm>
    			<TableWithHr columns={8} inverted={dark}>
    				<Table.Header>
    					<Table.Row>
    						<Table.HeaderCell>Категория</Table.HeaderCell>
    						<Table.HeaderCell>Событие</Table.HeaderCell>
    						<Table.HeaderCell>Ставка</Table.HeaderCell>
    						<Table.HeaderCell>Сумма</Table.HeaderCell>
    						<Table.HeaderCell>Кеф.</Table.HeaderCell>
    						<Table.HeaderCell>Дата события</Table.HeaderCell>
    						<Table.HeaderCell>Статус</Table.HeaderCell>
    						<Table.HeaderCell>Источник</Table.HeaderCell>
    					</Table.Row>
    				</Table.Header>
    				<Table.Body>
    					{bets.length
    						? bets.map((bet, index) =>
  									<RowWithHr key={index}>
      								<Table.Cell>{betTypes[bet.type].text}</Table.Cell>
      								<Table.Cell>{bet.bid_description}</Table.Cell>
      								<Table.Cell>
      									<span {...(isLonger(bet.ext_data.condition, 40) ? { title: bet.ext_data.condition } : null)}>
      										{trancateIfLong(bet.ext_data.condition, 40)}
      										{(bet.type === 2 || bet.type === 3) && toCurrencyIcon(bet.ext_data.condition_cur)}
      									</span>
      								</Table.Cell>
      								<Table.Cell>{`${bet.bid_amount} грн.`}</Table.Cell>
      								<Table.Cell>1.90</Table.Cell>
      								<Table.Cell>{moment(bet.created).format('HH:mm, DD/MM/YYYY')}</Table.Cell>
      								<Table.Cell>
      									{(bet.status === 0 && 'Открытая') ||
                          (bet.status === 1 && 'Закрытая') ||
                          (bet.status === 2 && (bet.winner_id
                          	? bet.winner_id === u_id ? 'Победа' : 'Поражение'
                          	: 'Победитель не определен'
                          ))}
      								</Table.Cell>
      								<Table.Cell>
      									<span {...(isLonger(bet.source, 60) ? { title: bet.source } : null)}>
      										{trancateIfLong(bet.source, 60)}
      									</span>
      								</Table.Cell>
      							</RowWithHr>
  							)
    						: <Table.Row>
    							<Table.Cell collSpan={8} textAlign='center'>
    								<NothingFound>Список пуст</NothingFound>
    							</Table.Cell>
    						</Table.Row>}
    				</Table.Body>
    			</TableWithHr>
  			</Hidden>
  			<Visible xs sm>
  				<MobileContainer>
  				{bets.length
  					? bets.map(item =>
  						<MobileRow key={item.b_id} dark={dark}>
  							<Row>
  								<Col xs={6}>
  									{item.type === 3
  										? <BreakLine dark={dark}>{toCryptoName(item.ext_data[getColKeys(item.type, 0)])}</BreakLine>
  										: <span {...(isLonger(item[getColKeys(item.type, 0)], 85) ? { title: item[getColKeys(item.type, 0)] } : null)}>
  											<BreakLine dark={dark}>{trancateIfLong(item[getColKeys(item.type, 0)], 85)}</BreakLine>
  										</span>}
  								</Col>
  								<RightCol xs={6}>
  									<BreakLine dark={dark}>
  										{(item.type === 2 || item.type === 3) ? spaceEvery3Symbols(item.ext_data[getColKeys(item.type, 1)]) : trancateIfLong(item.ext_data[getColKeys(item.type, 1)], 85)}
  										{(item.type === 2 || item.type === 3) && toCurrencyIcon(item.ext_data.condition_cur)}
  									</BreakLine>
  								</RightCol>
  							</Row>
  							<Row>
  								<Col xs={6}>
  									<BreakLine dark={dark}><GrayIfDark dark={dark}>{moment(item[getColKeys(item.type, 4)]).format('HH:mm, DD/MM/YYYY')}</GrayIfDark></BreakLine>
  								</Col>
  								<RightCol xs={6}>
  									<MobilePrice><BreakLine>{spaceEvery3Symbols(item[getColKeys(item.type, 2)])} грн.</BreakLine></MobilePrice>
  								</RightCol>
  							</Row>
  							<Row>
  								<Col>
  										<MobileLabelBlock dark={dark}>
  											<b>Категория</b>
  											<p>{betTypes[item.type].text}</p>
  										</MobileLabelBlock>
  										<MobileLabelBlock dark={dark}>
  											<b>Кеф.</b>
  											<p>1.90</p>
  										</MobileLabelBlock>
  										<MobileLabelBlock dark={dark}>
  											<b>Статус</b>
  											<p>
  												{(item.status === 0 && 'Открытая') ||
                          (item.status === 1 && 'Закрытая') ||
                          (item.status === 2 && (item.winner_id
                          	? item.winner_id === u_id ? 'Победа' : 'Поражение'
                          	: 'Победитель не определен'
                          ))}
  											</p>
  										</MobileLabelBlock>
  									<RightMobileBlock>
  										<b>Источник</b>
  										<UnerlinedText dark={dark}><GrayIfDark dark={dark}>{trancateIfLong(item.source, 12)}</GrayIfDark></UnerlinedText>
  									</RightMobileBlock>
  								</Col>
  							</Row>
  						</MobileRow>
  					)
  					: <div>
  						<p style={{ marginLeft: 15 }}>Ничего не найдено</p>
  					</div>}
  				</MobileContainer>
  			</Visible>
  		</div>
  	)
  }
}

export default History
