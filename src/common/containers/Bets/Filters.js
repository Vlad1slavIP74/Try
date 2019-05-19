import React, {Component} from 'react'
import { Container, Row, Col, Visible, Hidden } from 'react-grid-system'
import { Menu, Input, Icon, Transition } from 'semantic-ui-react'
import styled from 'styled-components'
import {media} from 'common/styles/utils'

import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import ScrolableSwipe from 'common/components/ScrolableSwipe'

const SearchIcon = styled(Icon)``

const Sort = styled.p`
	cursor: pointer;
	color: #2b2b2b;
	font-size: 14px;
	font-weight: ${props => props.bold ? 'bold' : 'normal'};
  -webkit-touch-callout: none !important;
	  -webkit-user-select: none !important;
	   -khtml-user-select: none !important;
	     -moz-user-select: none !important;
	      -ms-user-select: none !important;
	          user-select: none !important;
`

const MenuStyled = styled(Menu)`
	position: relative;
	max-width: 100%;
	padding: 2px 15px !important;

	${media.xs`
	  padding: 15px;
  `}
`
const ItemStyled = styled(Menu.Item)`	
	padding: 7px 0px !important;
	border-bottom: ${props => props.active ? 2 : 0}px solid #3ecf8e !important;

	margin-left: ${props => props.marginleft ? props.marginleft : '0px'} !important;
	margin-right: ${props => props.marginright ? props.marginright : '0px'} !important;
`

const SeachDesktop = styled(Input)`
  border-radius: 0px !important;

	& > input {
		width: 110px;
		padding: 0px;
		border: 0px !important;
  	border-radius: 0px !important;
  	color: #2b2b2b !important;
	}

	& i {
		width: 20px !important;
		opacity: 0.8 !important;
		color: #2b2b2b;
	}

	input::placeholder {
		color: #2b2b2b !important;
	}

	& input:focus {
		border-bottom: 2px solid #3ECF8E !important;
	}

	& input:focus ~ i {
		color: #3ECF8E !important;
	}


`

const SearchMobile = styled(Input)`
	& input {
		border-width: 0px !important;
	}
`

const SeachMobile = styled.input`
	width: calc(100% - 40px);
	margin-left: 35px;
	padding: 5px;
	padding-left: 30px;
	font-family: 'Montserrat', sans-serif;
	color: #2b2b2b !important;
	border: 0px;
	border-bottom: 2px solid;
	outline: 0;
	outline-offset: 0;

	&:focus {
		border-color: #21BA45 !important;
	}

  &:focus ~ i {
		color: #21BA45 !important;
	}
`

const SeachContainer = styled.div`
	position: relative;
  width: 100%;
  height: 35px;
  padding-top: 10px;
  color: #525f7f;

`

const IconSearch = styled(Icon)`
	cursor: pointer;
	position: absolute;
	left: 40;
	top: 15;
`
const IconBack = styled(Icon)`
	cursor: pointer;
	position: absolute;
	left: 0;
	top: 13;
	font-size: 17px !important;

	&:hover {
		color: #2b2b2b !important;
	}
`

const MobileBoxShadow = styled.div`
	${media.xs`
		padding-bottom: 15px !important;
		box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
	`}
`

const TransitionMobileContainer = styled.div`
	overflow: hidden;
	height: 40px;
`

class MobileFilters extends Component {
	state = {
		openSearch: false,
		search: this.props.betName
	}

	render () {
		const { openSearch, search } = this.state
		const { betName, betsStatus, handleBetStatus, handleBetName } = this.props

		return (
			<TransitionMobileContainer>
				<Transition.Group animation='scale' duration={400}>
					{!openSearch
						?	<div key={1}>
							<MenuStyled pointing secondary>
								<ItemStyled
									key='search-mob1'
									marginleft='0px'
									marginright='10px'
									name='Открытые ставки'
									active={betsStatus === 0}
									onClick={() => handleBetStatus([0])}/>
								<ItemStyled
									key='search-mob2'
									marginleft='10px'
									marginright='10px'
									name='Закрытые ставки'
									active={betsStatus === 1}
									onClick={() => handleBetStatus([1])}/>
								<ItemStyled position='right' key='search-mob3' onClick={() => this.setState({ openSearch: true })}>
									<Icon name='search' />
									<span>Поиск</span>
								</ItemStyled>
							</MenuStyled>
						</div>
						: <div key={2}>
							<MenuStyled pointing secondary>
								<SeachContainer>
									<IconBack name='arrow left' onClick={() => this.setState({ openSearch: false })}/>
									<SeachMobile
										placeholder='Поиск'
										value={search}
										onChange={(e) => this.setState({ search: e.target.value })}
										onKeyPress={(e) => (e.which || e.keyCode) === 13 && handleBetName([e.target.value])}
										onBlur={(e) => handleBetName([e.target.value])}
									/>
									<IconSearch name='search' onClick={() => handleBetName([search])}/>
								</SeachContainer>
							</MenuStyled>
						</div>
					}
				</Transition.Group>
			</TransitionMobileContainer>
		)
	}
}

const Filters = ({ sort, order, betsStatus, betName, handleBetName, handleBetStatus, handleSort }) => {
	const props = { sort, order, betsStatus, betName, handleBetName, handleBetStatus, handleSort }

	const isSortPrice = sort === 'price'
	const isSortDate = sort === 'date'
	const isAscOrder = order === 'asc'

	return (
		<ComponentMaxWidth>
			<MobileBoxShadow>
				<ScrolableSwipe>
					<Hidden xs>
						<MenuStyled pointing secondary>
							<ItemStyled
								marginleft='0px'
								marginright='10px'
								name='Открытые ставки'
								active={betsStatus === 0}
								onClick={() => handleBetStatus([0])}/>
							<ItemStyled
								marginleft='10px'
								marginright='10px'
								name='Закрытые ставки'
								active={betsStatus === 1}
								onClick={() => handleBetStatus([1])}/>

							<Menu.Menu position='right'>
								<ItemStyled
									marginleft='10px'
									marginright='0px'
								>
									<SeachDesktop
										iconPosition='left'
										icon='search'
										placeholder='Поиск'
										defaultValue={betName}
										onKeyPress={(e) => (e.which || e.keyCode) === 13 && handleBetName([e.target.value])}
										onBlur={(e) => handleBetName([e.target.value])}/>
								</ItemStyled>
								<ItemStyled
									marginleft='10px'
									marginright='0px'
								>
									<Sort
										bold={isSortPrice}
										onClick={() => handleSort(['price', isSortPrice && isAscOrder ? 'desc' : 'asc'])}
									>
										По сумме
										<Icon name={isSortPrice && isAscOrder ? 'caret up' : 'caret down'} />
									</Sort>
								</ItemStyled>
								<ItemStyled
									marginleft='10px'
									marginright='0px'
								>
									<Sort
										bold={isSortDate}
										onClick={() => handleSort(['date', isSortDate && isAscOrder ? 'desc' : 'asc'])}
									>
										По дате
										<Icon name={isSortDate && isAscOrder ? 'caret up' : 'caret down'} />
									</Sort>
								</ItemStyled>
							</Menu.Menu>
						</MenuStyled>
					</Hidden>

					<Visible xs>
						<MobileFilters {...props} />
					</Visible>

				</ScrolableSwipe>
			</MobileBoxShadow>
		</ComponentMaxWidth>
	)
}

export default Filters
