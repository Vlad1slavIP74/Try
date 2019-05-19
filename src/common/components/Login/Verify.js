import React, {Component} from 'react'
import { Container, Row, Col } from 'react-grid-system'
import { Message, Icon, Loader } from 'semantic-ui-react'
import styled from 'styled-components'
import queryString from 'querystringify'
import { connect } from 'react-redux'
import { verifyAccountRequest } from 'common/actions/auth'

import ModalContent from 'common/components/ModalContent'

class Verify extends Component {
	componentWillMount () {
  	let params = queryString.parse(this.props.location.search)

		// Fetching data
		this.props.verifyAccountRequest({ token: params.id || '' })
	}

	render () {
		const {
			error,
			loading,
			loaded,
			message
		} = this.props.auth

  	return (
  		<ModalContent largePadding>
  			<Message icon>
  				{loading
  					? <Icon name='circle notched' loading />
  					: !error
  						? <Icon name='check' />
  						: <Icon name='times' />}
  				<Message.Content>
  					<Message.Header>Подтверждение почты</Message.Header>
  					{loading ? 'Выполняется проверка' : message}
  				</Message.Content>
  			</Message>

  		</ModalContent>
  	)
	}
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, { verifyAccountRequest })(Verify)
