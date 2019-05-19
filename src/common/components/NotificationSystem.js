import React, {Component} from 'react'
import { Message, Transition } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { closeMessage } from 'common/actions/message'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`
  position: absolute;  
  right: 15;
  top: 80; 
`

const StyledMessage = styled(Message)` 
  width: 324px;
  padding: 10px 12px !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: ${props => props.info ? '#f8ffff' : 'red'};
  border: solid 0.5px #457686;

  & > i {
  	top: 0px !important;
    right: 0px !important;
  }
`

const NotificationSystem = ({ message, closeMessage }) => {
	const { list } = message

	return (
		<Container>
			<Transition.Group animation='fade right' duration={200}>
				<div hidden />
				{list.map(message =>
					<StyledMessage info={!message.error} negative={!!message.error} key={message.id} onDismiss={() => closeMessage(message.id)}>
						{message.title && <Message.Header>{message.title}</Message.Header>}
						<span>
							{message.text}
						</span>
					</StyledMessage>
				)}
			</Transition.Group>
		</Container>
	)
}

const mapStateToProps = ({ message }) => ({
	message
})

export default connect(mapStateToProps, { closeMessage })(NotificationSystem)
