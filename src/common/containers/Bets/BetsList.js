import React from 'react'
import styled from 'styled-components'
import { Container, Row, Col, Visible, Hidden } from 'react-grid-system'
import { Table, Popup, Menu, Icon, Button } from 'semantic-ui-react'
import moment from 'moment'
import _ from 'lodash'
import { trancateIfLong, isLonger, spaceEvery3Symbols, commaEvery3Symbols } from 'common/modules/string'
import {bets} from 'config'

import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import SharePage from 'common/components/SharePage'
import LightButton from 'common/components/LightButton'
import Label from 'common/components/Label'
import renderIcon from './renderBetIcon'

const betTypes = bets.categories

const Root = styled.div`
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  padding: 0px;
  position: relative;
`

const StyledPopup = styled(Popup)`
	margin-left: 0px !important;
	background: none !important;
	box-shadow: none !important;
	border: 0px !important;
	border-radius: 0px !important;

	&:before {
		content: none !important;
	}
`

const PaginationMenu = styled(Menu)`
	background: none !important;
	box-shadow: none !important;
	border: 0px !important;
`

const PaginationItem = styled(Menu.Item)`
	&:before {
		width: 0px !important;
	}
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
`

const BreakLine = styled.span`
	display: block;
	word-wrap: break-word;
`

const NoBreakLine = styled.span`
	white-space: nowrap;
`

const MinWidth = styled.div`
    min-width: ${props => props.width}px;
`

const PaginationContainer = styled.div`
   height: 85px;
   width: 85%;
`

const MobileRow = styled.div`
  background: ${props => props.active ? '#f6f7f8' : '#fff'};
  padding: 5px 15px 0px 15px !important;
  ${props => props.active ? 'border-bottom: 1px solid #e4e8ef' : ''};
  ${props => props.dark && `
  	border-bottom: 0px;
  	background: ${props.active ? '#272d38' : 'none'};
  `}
`

const MobileContainer = styled(Container)`
  padding-left: 0px !important;
  padding-right: 0px !important;
`

const MobileLabelBlock = styled.div`
	float: left;
	margin-top: 10px;
	padding-right: 10px;

	b {
		color: #9299a2;
	}
`

const MobileButtonBet = styled(LightButton)`
	float: right;
	margin-top: 8px !important;
	margin-right: 0px !important;
	margin-bottom: 10px !important;
`

const PCButtonBet = styled(LightButton)`
	&:hover {
		${props => props.dark && `
			background: #1d252c !important;
		`}
	}
`

const MobileOwnBetText = styled.p`
	float: right;
	margin-top: 30px !important;
	margin-right: 0px !important;
	margin-bottom: 10px !important;
`

const LightColorText = styled.a`
	color: #7f858b !important;
`

const LightColorLink = styled.a`
	display: block;
	color: #7f858b !important;
`

const ColorText = styled.span`
	${props => props.value ? `color: ${props.value} !important;` : ''}
`

const BetsList = ({ dark, loading, location, data, pagination, category, betsStatus, user_id, activeBetId, onPageChange, onJoin, onBetMobileClicked }) => {
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

	const getColNames = () => {
		if (_.indexOf([0, 1, 4], category) > -1) {
			return ['Событие', 'Ставка', 'Сумма', 'Кеф.', 'Дата события', 'Источник', '']
		} else if (category === 2) {
			return ['Компания', 'Курс акции', 'Сумма', 'Кеф.', 'Дата события', 'Источник', '']
		} else if (category === 3) {
			return ['Валюта', 'Курс', 'Сумма', 'Кеф.', 'Дата события', 'Источник', '']
		}
	}

	const getColKeys = () => {
		if (_.indexOf([0, 1, 4], category) > -1) {
			return ['bid_description', 'condition', 'bid_amount', null, 'date', 'source', null]
		} else if (category === 2) {
			return ['bid_description', 'condition', 'bid_amount', null, 'date', 'source', null]
		} else if (category === 3) {
			return ['subcategory', 'condition', 'bid_amount', null, 'date', 'source', null]
		}
	}

	const HeaderCells = getColNames()
	const ColumnKeys = getColKeys()

  	const HrMobileWithColorMode = (props) => <HrMobile dark={dark} {...props} />

	return (
		loading ? <div/>
			: <Root>
				<Hidden xs sm>
					<Table padded columns={betsStatus === 0 ? 7 : 6} inverted={dark}>
						<Table.Header>
							<Table.Row>
								{HeaderCells.map((cell, index) =>
									<Table.HeaderCell key={index}>{cell}</Table.HeaderCell>
								)}
							</Table.Row>
						</Table.Header>
						<Table.Body style={{ paddingLeft: 5, paddingRight: 5 }}>
							{data.length
								? data.map(item =>
									<Table.Row key={item.b_id}>
										<Table.Cell>
											<MinWidth width={250}>
												{renderIcon(category, item.ext_data.subcategory, 'bet_item')}
												{item.type === 3
													? <BreakLine>{toCryptoName(item.ext_data[ColumnKeys[0]])}</BreakLine>
													: <span {...(isLonger(item[ColumnKeys[0]], 85) ? { title: item[ColumnKeys[0]] } : null)}>
														<BreakLine>{trancateIfLong(item[ColumnKeys[0]], 85)}</BreakLine>
													</span>}
											</MinWidth>
										</Table.Cell>
										<Table.Cell>
											<span {...(isLonger(item.ext_data[ColumnKeys[1]], 85) ? { title: item.ext_data[ColumnKeys[1]] } : null)}>
												<BreakLine>
													{(category === 2 || category === 3)
														? <DesktopCurrencyBet rise={item.ext_data.up}>{commaEvery3Symbols(item.ext_data[ColumnKeys[1]], 85)} {toCurrencyIcon(item.ext_data.condition_cur)} <Icon name={item.ext_data.up ? 'caret up' : 'caret down'} /></DesktopCurrencyBet>
														: trancateIfLong(item.ext_data[ColumnKeys[1]], 85)}
												</BreakLine>
											</span>
										</Table.Cell>
										<Table.Cell>
											<BreakLine>{spaceEvery3Symbols(item[ColumnKeys[2]])} грн.</BreakLine>
										</Table.Cell>
										<Table.Cell>
										1.9
										</Table.Cell>
										<Table.Cell>
											<BreakLine>
												<LightColorText>
													{moment(item[ColumnKeys[4]]).format('HH:mm, DD/MM/YYYY')}
												</LightColorText>
											</BreakLine>
										</Table.Cell>
										<Table.Cell>
											<UnerlinedText {...(isLonger(item[ColumnKeys[5]], 85) ? { title: item[ColumnKeys[5]] } : null)}>
												<NoBreakLine>
													<LightColorLink href={item[ColumnKeys[5]]} target="_blank" rel="noopener noreferrer">
														{trancateIfLong(item[ColumnKeys[5]], 25)}
													</LightColorLink>
												</NoBreakLine>
											</UnerlinedText>
										</Table.Cell>
										{betsStatus === 0 && (
											user_id === item.creator_id
												? <Table.Cell><p>Ваша ставка</p></Table.Cell>
												: <Table.Cell style={{ position: 'relative', textAlign: 'right' }}>
													<StyledPopup
								        	hoverable
								        	horizontalOffset={0}
								          	trigger={
								          	<PCButtonBet onClick={() => onJoin(item)} dark={dark}>Поставить против</PCButtonBet>
								          }
								        >
								        	<SharePage bet_id={item.b_id} dark={dark} />
								        </StyledPopup>
								      </Table.Cell>
										)}
									</Table.Row>
								)
								: <Table.Row>
									<Table.Cell colSpan={8}>Ничего не найдено</Table.Cell>
								</Table.Row>}
						</Table.Body>
					</Table>
				</Hidden>
				<Visible xs sm>
					<MobileContainer fluid>
						{data.length
							? data.map(item =>
								<MobileRow key={item.b_id} active={activeBetId === item.b_id} onClick={() => onBetMobileClicked(item.b_id)} dark={dark}>
									<Row>
										<Col xs={6}>
											<ColorText value={dark ? '#ffffff' : ''}>
												{renderIcon(category, item.ext_data.subcategory, 'bet_item')}
												{item.type === 3
													? <BreakLine>{toCryptoName(item.ext_data[ColumnKeys[0]])}</BreakLine>
													: <span {...(isLonger(item[ColumnKeys[0]], 85) ? { title: item[ColumnKeys[0]] } : null)}>
														<BreakLine>{trancateIfLong(item[ColumnKeys[0]], 85)}</BreakLine>
													</span>}
											</ColorText>
										</Col>
										<RightCol xs={6}>
											<ColorText value={dark ? '#ffffff' : ''}>
												<BreakLine>
													{(category === 2 || category === 3) ? spaceEvery3Symbols(item.ext_data[ColumnKeys[1]]) : trancateIfLong(item.ext_data[ColumnKeys[1]], 85)}
													{(category === 2 || category === 3) && toCurrencyIcon(item.ext_data.condition_cur)}
												</BreakLine>
											</ColorText>
										</RightCol>
									</Row>
									<Row>
										<Col xs={6}>
											<BreakLine>
												<LightColorText>
													{moment(item[ColumnKeys[4]]).format('HH:mm, DD/MM/YYYY')}
												</LightColorText>
											</BreakLine>
										</Col>
										<RightCol xs={6}>
											<MobilePrice><BreakLine>{spaceEvery3Symbols(item[ColumnKeys[2]])} грн.</BreakLine></MobilePrice>
										</RightCol>
									</Row>
									{activeBetId === item.b_id ? <Row>
										<Col>
											<MobileLabelBlock>
												<b>Кеф.</b>
												<p><ColorText value={dark ? '#ffffff' : ''}>1.90</ColorText></p>
											</MobileLabelBlock>
											<MobileLabelBlock>
												<b>Источник</b>
												<LightColorLink>
													{trancateIfLong(item.source, 12)}
												</LightColorLink>
											</MobileLabelBlock>
											{betsStatus === 0 && (
												user_id === item.creator_id
													? <MobileOwnBetText><ColorText value={dark ? '#ffffff' : ''}>Ваша ставка</ColorText></MobileOwnBetText>
													: <MobileButtonBet onClick={() => onJoin(item)} dark={dark}>Поставить против</MobileButtonBet>)}
										</Col>
									</Row> : <HrMobileWithColorMode />}
								</MobileRow>
							)
							: <div>
								<p style={{ marginLeft: 15 }}>Ничего не найдено</p>
							</div>}
					</MobileContainer>
				</Visible>

	    {pagination && pagination.pages.length > 1 && <PaginationContainer>
					<PaginationMenu floated='right' pagination>
						<PaginationItem as='a' icon onClick={() => onPageChange([pagination.active_page !== 1 ? pagination.active_page - 1 : pagination.active_page])}>
							<Icon name='chevron left'/>
						</PaginationItem>
						{pagination.pages.map(item =>
          	<PaginationItem
          		key={item}
          		as='a'
          		active={pagination.active_page === item}
          		onClick={() => onPageChange([item])}
          	>
          		{item}
          	</PaginationItem>
						)}
						<PaginationItem as='a' icon onClick={() => onPageChange([pagination.active_page !== pagination.total_pages ? pagination.active_page + 1 : pagination.active_page])}>
							<Icon name='chevron right'/>
						</PaginationItem>
					</PaginationMenu>
	    </PaginationContainer>}
			</Root>
	)
}

export default BetsList
