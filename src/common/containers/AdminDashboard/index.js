import React, {Component} from 'react'
import { Route, Redirect } from 'react-router'
import { Switch, Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { openSideBar, closeSideBar } from 'common/actions/layout'

import ComponentMinHeight from 'common/components/ComponentMinHeight'
import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import Bets from './Bets'

const GrayBackground = styled.div`
  padding: 10px;
  background: rgb(246, 247, 248);
`
const Title = styled.h1`
  
`
const BigText = styled.p`
  padding: 15px;
  font-size: 35px;
  
`

class AdminDashboard extends Component {
	handleButtonClick = () => this.props.openSideBar()

	render () {
		const { pathname } = this.props.location
		console.log(this.props)

   	return (
  		<ComponentMinHeight height={800}>
				<GrayBackground>
				  <ComponentMaxWidth>
  					<Menu pointing secondary>
  						<Menu.Item>
  							<Button icon compact onClick={this.handleButtonClick}>
  								<Icon name='bars' size='big'/>
  							</Button>
  						</Menu.Item>
  						<Menu.Item>
								<Title>Панель администратора</Title>
							</Menu.Item>
  					</Menu>
					</ComponentMaxWidth>
				</GrayBackground>
				<ComponentMaxWidth>
  				<Switch>
  					<Route exact path='/admin/bets' component={Bets}/>
  					<BigText>Выберите один из разделов выше</BigText>
  				</Switch>
				</ComponentMaxWidth>
  		</ComponentMinHeight>
  	)
	}
}

const mapStateToProps = ({ layout }) => ({
	layout
})

export default connect(mapStateToProps, { openSideBar, closeSideBar })(AdminDashboard)
