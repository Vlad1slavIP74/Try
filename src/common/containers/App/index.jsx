/**
 * @flow
 */
import React, {Component} from 'react'
import styled from 'styled-components'
import {withRouter} from 'react-router'
import { connect } from 'react-redux'
import {correctBetsParamsIfWrong, handleQueryParams} from 'common/modules/url'
// Import main views
import CategoriesList from 'common/containers/Bets/CategoriesList'
import MarginComponent from 'common/components/MarginComponent'
import AllModalsOnPage from 'components/AllModalsOnPage'
import SidebarDashboard from 'components/SidebarDashboard'
import Header from 'components/Header'
import Login from 'components/Login'
import Footer from 'components/Footer'
import Slider from 'components/Slider'
import LiveChat from 'common/components/LiveChat'
import NotificationSystem from 'common/components/NotificationSystem'
import UserNotificationSocketSystem from 'common/modules/UserNotificationSocketSystem'
// Import actions
import ReactGA from 'react-ga'
// Import styled components
import _ from 'lodash'
// Scss is written as a case study and a proof of CSS support
import './App.scss'
import 'react-widgets/dist/css/react-widgets.css'

const BackgroundMode = styled.div`
  background: ${props => props.dark ? '#1A1F28' : '#ffffff'};
`

class App extends Component {
	state = { socketConnection: null }

	componentDidMount () {
		if (process.env.SENTRY_PUBLIC_DSN) {
			const script = document.createElement('script')
			script.type = 'text/javascript'
			script.crossorigin = 'anonymous'
			script.async = true
			script.onload = () => {
				Raven.config(process.env.SENTRY_PUBLIC_DSN).install()
			}
			script.src = 'https://cdn.ravenjs.com/3.22.1/raven.min.js'
			document.body.appendChild(script)
		}

		/*
		if (process.env.GA_ID) {
			const {location: {search, pathname}} = this.props
			ReactGA.initialize(process.env.GA_ID)
			ReactGA.pageview(pathname + search)
		}
		*/

		ReactGA.initialize('UA-123083769-1')

		// INIT SOCKET CONNECTION FOR NOTIFICATION SYSTEM
		this.setState({ socketConnection: UserNotificationSocketSystem.initSocket(this.props.auth.user.u_id || null, this.props.dispatch) })
	}

	componentWillReceiveProps ({location: nextLocation, auth: nextAuth, dispatch: nextDispatch}) {
		const {location, auth} = this.props

		/*
		if (process.env.GA_ID && !_.isEqual(nextLocation, location)) {
			const {search, pathname} = nextLocation
			ReactGA.pageview(pathname + search)
		}
		*/

		if (!_.isEqual(auth.user.u_id, nextAuth.user.u_id)) {
			// INIT SOCKET CONNECTION FOR NOTIFICATION SYSTEM
			// UserNotificationSocketSystem.checkConnection(nextAuth.user.u_id || null, nextDispatch)
		}
	}

	componentWillUnmount () {
		const { socketConnection } = this.state

		try {
			UserNotificationSocketSystem.closeSocket(socketConnection)
		} catch (err) {
			// console.log(err)
		}
	}

	render () {
		const {children, history, location, isMobile, auth} = this.props
  		const { darkMode } = this.props.layout

		const urlParams = correctBetsParamsIfWrong(this.props.location.search)
		/** NOTE: There is an issue with props and styled-components,
			So we use custom attributes and handle them inside styled component
			{@link: https://github.com/styled-components/styled-components/issues/439}
		*/
		let show = null
		if (new Date() < new Date('2019-05-21T00:00:00')) {
			show = <Header history={history}/>
		}
		return (
			<BackgroundMode dark={darkMode}>
				<SidebarDashboard>

					<Header history={history}/>
					<Slider location={location} dark={darkMode}/>
					<CategoriesList location={location} value={urlParams.type} onChange={handleQueryParams(history, ['type'])} dark={darkMode}/>
					<AllModalsOnPage location={location}/>
					{children}
					<LiveChat dark={darkMode}/>
					<NotificationSystem/>
					<Footer dark={darkMode}/>
				</SidebarDashboard>
			</BackgroundMode>
		)
	}
}

const mapStateToProps = ({ layout, auth }) => ({
	layout,
	auth
})

export default withRouter(connect(mapStateToProps, null)(App))
