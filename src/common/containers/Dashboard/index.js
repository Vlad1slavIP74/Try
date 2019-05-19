import React from 'react'
import styled from 'styled-components'
import { Route, Redirect } from 'react-router'
import { Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import * as pageActions from '../../redux/actions/PageActions'
import ComponentMaxWidth from '../../components/ComponentMaxWidth'
import ComponentMinHeight from 'common/components/ComponentMinHeight'
import Navigation from './Navigation'
import Profile from './Profile'
import History from './History'
import Deposit from './Deposit'
import Cashout from './Cashout'

const BackgroundMode = styled.div`
	background: ${props => props.dark ? '#1A1F28' : '#ffffff'};
`

const Dashboard = ({ history, location, layout, auth }) => (
	<BackgroundMode dark={layout.darkMode}>
		<ComponentMaxWidth>
			<ComponentMinHeight height={500}>
				<Navigation history={history} pathname={location.pathname} dark={layout.darkMode}/>

				<div style={{ margin: '0px 5px' }}>
					<Switch>
						<Route exact path='/dashboard/profile' render={props => <Profile user={auth.user} dark={layout.darkMode} {...props} />}/>
						<Route exact path='/dashboard/history' render={props => <History user={auth.user} dark={layout.darkMode} {...props} />}/>
						<Route exact path='/dashboard/deposit' render={props => <Deposit dark={layout.darkMode} {...props} />}/>
						<Route exact path='/dashboard/cashout' render={props => <Cashout user={auth.user} dark={layout.darkMode} {...props} />}/>
					</Switch>
				</div>
			</ComponentMinHeight>
		</ComponentMaxWidth>
	</BackgroundMode>
)

withRouter(Dashboard)

const mapStateToProps = ({ layout, auth }) => ({
	layout,
	auth
})

export default connect(mapStateToProps, null)(Dashboard)
