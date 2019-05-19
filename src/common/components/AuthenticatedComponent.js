import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'

// permission_type:
// 0 - админ
// 1 - пользователь

export function requireAuthentication (Component, permissionType) {
	class AuthenticatedComponent extends React.Component {
		componentWillMount () {
			this.checkAuth(this.props.user)
		}

		componentWillReceiveProps (nextProps) {
			this.checkAuth(nextProps.user)
		}

		checkAuth (user) {
			const logged = !_.isEmpty(user)
			const havePermission = permissionType === user.permission_type

			// console.log(user, logged, havePermission)

			if (!logged || !havePermission) {
				let redirectAfterLogin = this.props.location.pathname
				let redirectPath = `${permissionType === 0 ? '/admin/login' : '/auth'}?next=${redirectAfterLogin}`
				this.props.history.push(redirectPath)
			}
		}

		render () {
			return (
				<div>
					{this.props.user
						? <Component {...this.props}/>
						: null
					}
				</div>
			)
		}
	}

	const mapStateToProps = ({ auth }) => ({
		user: auth.user
	})

	return connect(mapStateToProps)(withRouter(AuthenticatedComponent))
}

export const disableAuthentication = (Component) => {
/*
	const NotAuthenticatedComponent = (props) => ({ user, history }) => {
		console.log('NotAuthenticatedComponent')
		console.log(props)
		if (!_.isEmpty(user)) {
			history.push('/')
			// return null
		}

		return <Component {...props}/>
	} */

	class NotAuthenticatedComponent extends React.Component {
		componentWillMount () {
			this.checkAuth(this.props.user)
		}

		componentWillReceiveProps (nextProps) {
			this.checkAuth(nextProps.user)
		}

		checkAuth (user) {
			const logged = !_.isEmpty(user)

			if (logged) {
				this.props.history.push('/')
			}
		}

		render () {
			return (
				<Component {...this.props}/>
			)
		}
	}

	const mapStateToProps = ({ auth }) => ({
		user: auth.user
	})

	return connect(mapStateToProps)(withRouter(NotAuthenticatedComponent))
}
