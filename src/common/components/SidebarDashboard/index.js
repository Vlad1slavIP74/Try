import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Button, Header, Icon, Menu, List, Sidebar } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { logoutRequest } from 'common/actions/auth'
import { openSideBar, closeSideBar, switchColorMode } from 'common/actions/layout'

import styled from 'styled-components'
import _ from 'lodash'
import ReactGA from 'react-ga'

import SwitchColorMode from 'common/components/SwitchColorMode'

const StyledSidebar = styled(Sidebar)`
  min-width: 250px !important;
  width: 250px !important;
  padding-left: 14px;
  padding-top: 20px;
  border: 0px !important;
  text-align: left !important;
  background: ${props => props.darkmode === 'true' ? '#000000' : '#ffffff'} !important;
`
const Title = styled.p`
  font-size: 28px;
  font-weight: bold;
  color: #2b2b2b;
`

const ListLabel = styled.p`
  margin-bottom: 5px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.dark ? '#ffffff' : '#9299a2'} !important;
`
const ListItem = styled(Link)`
  position: relative !important;
  display: block;
  font-size: 20px !important;
  font-weight: 500 !important;
  font-style: normal !important;
  color: ${props => props.dark ? '#ffffff' : '#525f7f'} !important;
  padding-bottom: 15px;

  &:hover{
    cursor: pointer !important;
    color: #2b2b2b !important;
  }
`
const StyledRightIcon = styled.img`
  display: block;
  position: absolute;
  right: 10px;
  top: 2px;
  height: 20px;
`
const SupportBlock = styled.div`
  text-align: center;
  margin-top: 80px;
  padding: 15px;
`

const CloseIcon = styled.img`
  position: fixed;
  left: 265;
  top: 15;
  z-index: 4;
  cursor: pointer;
`

const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.visible ? 'block' : 'none'};
  z-index: 4;
`

const RelativeBlock = styled.div`
  position: relative;
`

const HeaderBlock = styled.div`
  margin-bottom: 15px;

  & > div {
    position: absolute !important;
    top: 8px !important;
    left: 35px !important;
  }
`

class AdminSidebar extends Component {
  handleButtonClick = () => this.props.openSideBar()

  handleSidebarHide = () => this.props.closeSideBar()

  handleColorMode = () => this.props.switchColorMode()

  logout = () => {
  	this.props.logoutRequest()
  	this.handleSidebarHide()
  }

  render () {
  	const { children, layout, auth } = this.props
  	const dark = this.props.layout.darkMode
  	const isAdmin = auth.user ? auth.user.permission_type === 0 : false
  	const isAuthed = !_.isEmpty(auth.user)
  	console.log()

  	return (
  		<div>
  			<Background visible={layout.sideBarOpen} />
  				{layout.sideBarOpen && <CloseIcon src='/public/images/close.png' />}
    			<StyledSidebar
  				  darkmode={dark.toString()}
    				as={Menu}
    				animation='overlay'
    				icon='labeled'
    				onHide={this.handleSidebarHide}
    				vertical
    				visible={layout.sideBarOpen}
    			>
  				<HeaderBlock>
    				<img src="/images/logo.png" />
  					<SwitchColorMode dark={dark} onClick={this.handleColorMode}/>
  				</HeaderBlock>

    				{!isAdmin &&
              <div>
              	<ListLabel>Ставки</ListLabel>
              	<ListItem to='/bets?type=0' onClick={this.handleSidebarHide} dark={dark}>
                  Спорт
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>
              	<ListItem to='/bets?type=1' onClick={this.handleSidebarHide} dark={dark}>
                  Киберспорт
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>
              	<ListItem to='/bets?type=2' onClick={this.handleSidebarHide} dark={dark}>
                  Акции
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>
              	<ListItem to='/bets?type=3' onClick={this.handleSidebarHide} dark={dark}>
                  Криптовалюта
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>
              	<ListItem to='/bets?type=4' onClick={this.handleSidebarHide} dark={dark}>
                  События
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>
              	<ListLabel>Аккаунт</ListLabel>
              	{isAuthed && <ListItem to='/dashboard/profile' onClick={this.handleSidebarHide} dark={dark}>
                  Мой профиль
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>}
              	{isAuthed && <ListItem to='/dashboard/history' onClick={this.handleSidebarHide} dark={dark}>
                  История счет
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>}
              	{isAuthed && <ListItem to='/dashboard/deposit' onClick={this.handleSidebarHide} dark={dark}>
                  Депозит
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>}
              	{isAuthed && <ListItem to='/dashboard/cashout' onClick={this.handleSidebarHide} dark={dark}>
                  Вывод средств
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>}
              	{isAuthed && <ListItem to='/' onClick={this.logout}>
              		<div style={{ color: '#9b9b9b' }}>Выйти из системы</div>
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>}
              	{!isAuthed && <ListItem to='/auth' onClick={this.handleSidebarHide} dark={dark}>
                  Войти
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>}
              	{!isAuthed && <ListItem to='/register' onClick={() => {
              		// window.ga('send', 'event', 'reg-button', 'beginreg', 'podtverdit-button')
              		ReactGA.event({
              			category: 'registration',
              			action: 'beginreg',
              			label: 'reg-button'
              		})

              		this.handleSidebarHide()
              	}} dark={dark}>
                  Зарегистрироваться
              		<StyledRightIcon src='/public/images/right-chevron.svg' />
              	</ListItem>}

              	<SupportBlock>
              		<ListLabel dark={dark}>Поддержка</ListLabel>
              		<List>
              			{/* <List.Item><span style={{ color: '#444444' }}>+380965141144</span></List.Item> */}
              			<List.Item><span style={{ color: '#525f7f' }}>support@alfakasta.com</span></List.Item>
              			<List.Item>
              				<img src='/public/images/Telegram.png'/>
              				<img src='/public/images/Viber.png'/>
              				<img src='/public/images/Whatsapp.png'/>
              			</List.Item>
              		</List>
              	</SupportBlock>
              </div>
    				}

    				{isAdmin &&
              <div>
              	<ListLabel>Ставки</ListLabel>
              	<ListItem to='/admin/bets' onClick={this.handleSidebarHide} dark={dark}>Управление ставками</ListItem>
              </div>
    				}
    			</StyledSidebar>

  			<Sidebar.Pusher dimmed={layout.sideBarOpen}>
  				{children}
  			</Sidebar.Pusher>
  		</div>
  	)
  }
}

const mapStateToProps = ({ layout, auth }) => ({
	layout,
	auth
})

export default connect(mapStateToProps, { openSideBar, closeSideBar, logoutRequest, switchColorMode })(AdminSidebar)
