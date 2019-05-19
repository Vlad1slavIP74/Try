import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Menu } from 'semantic-ui-react'
import {media} from 'common/styles/utils'

import ScrolableSwipe from 'common/components/ScrolableSwipe'

const StyledLink = styled(Link)`
	cursor: pointer;
`

const MenuStyled = styled(Menu)`
	position: relative;
	max-width: 100%;
	margin: 0px 15px !important;
	border: 0px solid transparent !important;
	overflow-x: auto;
	overflow-y: hidden;
	-ms-overflow-style: -ms-autohiding-scrollbar;
	-webkit-overflow-scrolling: touch;
	white-space: nowrap;
	&::-webkit-scrollbar {
	  display: none;
	}

	${media.xs`
	  margin: 15px;
  `}
`

const ItemRight = styled(Menu.Item)`
	padding-bottom: 5px !important;
`

const ItemStyled = styled(Menu.Item)`	
	padding: 7px 0px !important;

	margin-left: ${props => props.marginleft ? props.marginleft : '0px'} !important;
	margin-right: ${props => props.marginright ? props.marginright : '0px'} !important;
`

const Navigation = ({ history, pathname, dark }) => (
	<MenuStyled pointing secondary inverted={dark}>
		<ItemStyled
			marginleft='0px'
			marginright='10px'
			name='Мой профиль'
			active={pathname === '/dashboard/profile'}
			onClick={() => history.push('/dashboard/profile')}/>
		<ItemStyled
			marginleft='10px'
			marginright='10px'
			name='История счета'
			active={pathname === '/dashboard/history'}
			onClick={() => history.push('/dashboard/history')}/>
		<ItemStyled
			marginleft='10px'
			marginright='10px'
			name='Депозит'
			active={pathname === '/dashboard/deposit'}
			onClick={() => history.push('/dashboard/deposit')}/>
		<ItemStyled
			marginleft='10px'
			marginright='0px'
			name='Вывод средств'
			active={pathname === '/dashboard/cashout'}
			onClick={() => history.push('/dashboard/cashout')}/>

		{pathname === '/dashboard/history' &&
		<Menu.Menu position='right'>
			<ItemRight>
				<StyledLink to={{ pathname: '/dashboard/history', search: 'last=1day' }}>За сегодня</StyledLink>
			</ItemRight>
			<ItemRight>
				<StyledLink to={{ pathname: '/dashboard/history', search: 'last=7days' }}>За неделю</StyledLink>
			</ItemRight>
			<ItemRight>
				<StyledLink to={{ pathname: '/dashboard/history', search: 'last=anytime' }}>За все время</StyledLink>
			</ItemRight>
		</Menu.Menu>}
	</MenuStyled>
)

export default Navigation
