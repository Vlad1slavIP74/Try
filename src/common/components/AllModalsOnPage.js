/**
 * @flow
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { closeBetForm } from 'common/actions/layout'
// Import main views
import BetForm from 'components/BetForm'
import Login from 'components/Login'

const AllModalsOnPage = ({ location, layout, auth, bets, closeBetForm }) => {
	const showLogin = /\/(auth|register|restore|verify)/.test(location.pathname)

	return (
		<div>
			{showLogin && <Login location={location}/>}

			{layout.betFormOpen &&
				<BetForm
					user={auth.user}
					location={location}
					onClose={closeBetForm}/>}

		</div>
	)
}

const mapStateToProps = ({ layout, auth, bets }) => ({
	layout,
	bets,
	auth
})

export default connect(mapStateToProps, { closeBetForm })(AllModalsOnPage)
