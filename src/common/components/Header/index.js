import React, {Component} from 'react'
import { Container, Row, Col, Hidden, Visible } from 'react-grid-system'
import { Link } from 'react-router-dom'
import { Icon, Button, Dropdown, Menu, Message, List, Transition } from 'semantic-ui-react'
import styled from 'styled-components'
import _ from 'lodash'
import { connect } from 'react-redux'
import { getSecretToken } from 'common/modules/auth'
import { renewTokenRequest, logoutRequest } from 'common/actions/auth'
import { openCreateBetForm, openSideBar, switchColorMode } from 'common/actions/layout'
import { media } from 'common/styles/utils'
import { spaceEvery3Symbols } from 'common/modules/string'
import ReactGA from 'react-ga'

import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import SwitchColorMode from 'common/components/SwitchColorMode'
import Label from '../Label'
import LightButton from '../LightButton'

const HeaderStyled = styled.header`
  position: fixed;
  top: 0;
  padding: 0px;
  width: 100%;
  height: 58px;
  z-index: 3;
  background: ${props => props.dark ? '#0f1419' : '#ffffff'};
`

const Logo = styled.div`
  display: inline-block;
  margin-top: 14px;
  font-weight: normal;

  & > img {
    float: left;
  }

  & > p {
    float: left;
    padding-left: 10px;
    color: ${props => props.dark ? '#d1d1d1' : '#55AC97'};
    font-size: 24px;
    letter-spacing: 1.3px;
  }

  & .large {
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.dark ? '#ffffff' : '#55AC97'};
  }
`

const AdminIcon = styled(Icon)`
  background-color: #ffffff !important;
  color: #51aa97 !important;
`

const Balans = styled.p`
  margin: 0px !important;
  margin-top: 10px !important;
  color: ${props => props.dark ? '#ffffff' : '#525f7f'};
  font-weight: 700;
  line-height: 1em;
`

const Block = styled.div`
  display: block;
  width: ${props => props.width ? `${props.width}px` : 'auto'};
  float: right;
  text-align: left;
  padding: 0px ${props => props.smallPadding ? '4px' : '15px'};
  ${media.xs`
    width: auto !important;
    padding: 0px 5px !important;
  `}
`

const AdminBlock = styled.div`
  float: right !important;
  display: block !important;
  margin-top: 13px !important;
  text-align: left;
  height: 45px !important;
  background: #52aa97 !important;
  padding: 8px !important;
  border-radius: 4px !important;

  & > a {
    display: inline-block;
    float: right;
    font-size: 25px !important;
    color: #fff !important;
  }

  & > i {
    cursor: pointer !important;
  }
`

const options = [
	{ key: 'angular', text: 'Angular', value: 'angular' },
	{ key: 'css', text: 'CSS', value: 'css' },
	{ key: 'design', text: 'Graphic Design', value: 'design' },
	{ key: 'ember', text: 'Ember', value: 'ember' },
	{ key: 'html', text: 'HTML', value: 'html' },
	{ key: 'ia', text: 'Information Architecture', value: 'ia' },
	{ key: 'javascript', text: 'Javascript', value: 'javascript' },
	{ key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
	{ key: 'meteor', text: 'Meteor', value: 'meteor' },
	{ key: 'node', text: 'NodeJS', value: 'node' },
	{ key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
	{ key: 'python', text: 'Python', value: 'python' },
	{ key: 'rails', text: 'Rails', value: 'rails' },
	{ key: 'react', text: 'React', value: 'react' },
	{ key: 'repair', text: 'Kitchen Repair', value: 'repair' },
	{ key: 'ruby', text: 'Ruby', value: 'ruby' },
	{ key: 'ui', text: 'UI Design', value: 'ui' },
	{ key: 'ux', text: 'User Experience', value: 'ux' }
]

const StyledRow = styled(Row)`
  padding: 0px !important;
`

const StyledCol = styled(Col)`
  text-align: ${props => props.align ? props.align : 'left'};
  overflow: initial !important;
  ${media.xs`
    padding: 0px 5px !important;
  `}
`

const MenuIcon = styled(Icon)`
  width: 24px !important;
  height: 24px !important;
  margin: 0px !important;
  margin-top: 15px !important;
  font-size: 24px !important;
  line-height: 24px !important;
  color: ${props => props.dark ? '#ffffff' : '#525f7f'} !important;
`

const ButtonMenu = styled(Button)`
  margin-top: 10px !important;
  margin-left: 5px !important;
  border: ${props => props.dark ? '0px' : '1px solid #e4e8ef'} !important;
  background: ${props => props.dark ? '#232c33' : '#ffffff'} !important;
  padding: 6px !important;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.02) !important;

  &:hover {
    box-shadow: none !important;
  }
`

const StyledButton = styled(Button)`
  font-size: 14px !important;
  font-weight: bold !important;
  font-style: normal !important;
  font-stretch: normal !important;
  line-height: normal !important;
  letter-spacing: normal !important;

  padding: 10px ${props => props.wide ? '20px' : '10px'} !important;
  display: block !important;
  border-radius: 3px !important;
  box-shadow: ${props => props.shadow ? '0 2px 4px 0 rgba(0, 0, 0, 0.1) !important' : 'none'};
  background-color: #3ecf8e !important;
  width: ${props => props.width ? props.width : 'auto'} !important;

  &:hover {
    box-shadow: none !important;
    background-color: #2bcd84 !important;
  }
`

const DropdownStyled = styled(Dropdown)`
  background: ${props => props.dark ? '#222b32' : '#FFFFFF'};
  border: ${props => props.dark ? '0px' : '1px solid rgba(34, 36, 38, 0.15)'};
  border-radius: 4px;
  padding: 3px 8px !important;
  max-width: 105px !important;
  min-height: auto !important;
  font-size: 12px !important;
  font-weight: bold !important;
  font-style: normal !important;
  font-stretch: normal !important;
  line-height: normal !important;
  letter-spacing: normal !important;
  text-align: left !important;
  color: ${props => props.dark ? '#ffffff' : '#525f7f'};

  &:hover {
    ${props => props.dark && `
      color: #444444;
      background: #ffffff;
    `};
  }

  & > .menu {
    width: 150px !important;
    max-height: none !important;
    margin-top: 5px !important;
    border-radius: 3px !important;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2) !important;
    border: ${props => props.dark ? '0px' : 'solid 1px #cfcfcf'} !important;
    border-top: ${props => props.dark ? '0px' : 'solid 1px #cfcfcf'} !important;
  }

  & > .menu > .item {
    padding: 12px 8px !important;
    color: ${props => props.dark ? '#ffffff' : '#525f7f'} !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    background: ${props => props.dark ? '#222b32' : '#ffffff'};
  }

  & > .menu > .item:hover {
    background: ${props => props.dark ? '#222b32' : '#ffffff'} !important;
    color: ${props => props.dark ? '#9299a2' : '#444444'} !important;
  }

  & > .dropdown.icon {
    top: 2px !important;
  }
`

const RegisterButton = styled(StyledButton)`
  background-color: #de9b3c !important;

  &:hover {
    background-color: #c7882d !important;
  }
`

const AuthButton = styled(LightButton)`
  width: auto !important;
  padding: 0px 15px !important;

  ${props => props.dark && `
    &:hover {
      background-color: #1D252C !important;
    }
  `}

`

// user.permission:
// 0 - админ
// 1 - пользователь

class Header extends Component {
	componentWillMount () {
		const token = getSecretToken()

		if (token) {
			this.props.renewTokenRequest({ token }, { Authorization: `user ${token}` })
		}
	}

	logout () {
  	this.props.logoutRequest()
	}

  pushUrl = (url) => this.props.history.push(url)

  closeMessage = (id) => {
  	this.props.closeMessage(id)
  }

  handleOpenMenu = () => this.props.openSideBar()

  handleColorMode = () => this.props.switchColorMode()

  render () {
  	const { user } = this.props.auth
  	const { darkMode } = this.props.layout

  	return (
  		<HeaderStyled dark={darkMode}>
  			<ComponentMaxWidth>
  				<Container fluid>
  					<StyledRow>
  						<StyledCol xs={2} sm={5} md={5} xl={5} align='left'>
  							<Hidden xs sm>
  								<Link to='/' style={{ float: 'left' }}>
  									<Logo dark={darkMode}>
  										<img src='/public/images/logo.png' />
  										<p><span className="large">Альфа222</span>каста</p>
  									</Logo>
  								</Link>
  								<SwitchColorMode dark={darkMode} onClick={this.handleColorMode}/>
  							</Hidden>
  							<Visible xs sm>
  								<ButtonMenu compact icon onClick={this.handleOpenMenu} dark={darkMode}>
  									<MenuIcon name='bars' dark={darkMode} />
  								</ButtonMenu>
  							</Visible>
  						</StyledCol>
  						<StyledCol xs={10} sm={7} md={7} xl={7} align='right' style={{ marginTop: _.isEmpty(user) ? 10 : 0 }}>

  							{user.permission_type === 0 && <div>
  								<AdminBlock>
									  <Link to='/admin'> Администратор </Link>
  									<AdminIcon bordered name='sign out alternate' onClick={() => this.logout()}/>
								  </AdminBlock>
  							</div>}

  							{user.permission_type !== 0 && <div>
  								<Block smallPadding={_.isEmpty(user)} style={{ paddingRight: 0 }}>
    								<StyledButton wide='true' primary shadow='true' onClick={this.props.openCreateBetForm} style={{ marginTop: _.isEmpty(user) ? 0 : 10 }}>СОЗДАТЬ СТАВКУ</StyledButton>
    							</Block>

    							<Block smallPadding={_.isEmpty(user)}>
    							{_.isEmpty(user)
    								? <Hidden xs sm>
  											<RegisterButton wide='true' primary shadow='true' onClick={() => {
  												// window.ga('send', 'event', 'reg-button', 'beginreg')
  												ReactGA.event({
  													category: 'registration',
  													action: 'beginreg',
  													label: 'reg-button'
  												})
  												this.pushUrl('/register')
  											}}>Зарегистрироваться</RegisterButton>
  										</Hidden>
    								: <div style={{ marginLeft: 20 }}>
  										<Label title='Баланс' dark={darkMode}>
    									 <Balans dark={darkMode}>{user.balans ? spaceEvery3Symbols(user.balans) : '0'} грн.</Balans>
    								  </Label>
  									</div>}
    							</Block>

    							<Block smallPadding={_.isEmpty(user)}>
    								{_.isEmpty(user)
    									? <AuthButton onClick={() => this.pushUrl('/auth')} dark={darkMode}>Войти</AuthButton>
    									: <Hidden xs sm>
											    <Label title={`Здравствуйте, ${user.name || 'Без_имени'}`} dark={darkMode}>
        										<DropdownStyled text='МОЙ СЧЕТ' basic fluid dark={darkMode}>
        											<Dropdown.Menu>
        												<Dropdown.Item onClick={() => this.pushUrl('/dashboard/profile')}>Мой профиль</Dropdown.Item>
        												<Dropdown.Item onClick={() => this.pushUrl('/dashboard/history')}>История счета</Dropdown.Item>
        												<Dropdown.Item onClick={() => this.pushUrl('/dashboard/deposit')}>Депозит</Dropdown.Item>
        												<Dropdown.Item onClick={() => this.pushUrl('/dashboard/cashout')}>Вывод средств</Dropdown.Item>
        												<Dropdown.Item onClick={() => this.logout()}>Выйти из системы</Dropdown.Item>
        											</Dropdown.Menu>
        										</DropdownStyled>
											  </Label>
  										</Hidden>}
  								</Block>
  							</div>}
  						</StyledCol>
  					</StyledRow>
  				</Container>
  			</ComponentMaxWidth>
  		</HeaderStyled>
  	)
  }
}

const mapStateToProps = ({ layout, auth, message }) => ({
	layout,
	auth,
	message
})

export default connect(mapStateToProps, { renewTokenRequest, logoutRequest, openCreateBetForm, openSideBar, switchColorMode })(Header)
