import React, {Component} from 'react'
import { Row, Col } from 'react-grid-system'
import { Link } from 'react-router-dom'
import { Button, Header, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import CustomModal from 'common/components/Modal'
import { openAuthForm } from 'common/actions/auth'
import styled from 'styled-components'

import Register from './Register'
import Auth from './Auth'
import Restore from './Restore'
import RestoreNewPassword from './RestoreNewPassword'
import Verify from './Verify'

class Login extends Component {
	componentWillMount () {
		this.props.openAuthForm()
	}

	render () {
		const { location, history, openModal, loaded, error } = this.props
		const path = location.pathname

		return (

			<CustomModal
				closeIcon={<div className="close icon"></div>}
				dimmer={true}
				closeOnDimmerClick={true}
				open={openModal}
				onClose={() => history.push('/')}
			>
				<div>
					{ path === '/register' && <Register/>}
					{ path === '/auth' && <Auth history={history}/>}
					{ path === '/restore' && <Restore location={location}/>}
					{ path === '/restore/confirm' && <RestoreNewPassword history={history} location={location}/>}
					{ path === '/verify' && <Verify location={location}/>}
				</div>
			</CustomModal>
		)
	}
}

const mapStateToProps = ({ auth }) => ({
	loaded: auth.loaded,
	error: auth.error,
	openModal: auth.openModal
})

export default connect(mapStateToProps, { openAuthForm })(withRouter(Login))
