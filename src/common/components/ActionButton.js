import React from 'react'
import { Row, Col } from 'react-grid-system'
import { Button } from 'semantic-ui-react'
import styled from 'styled-components'

const StyledButton = styled(Button)`
	font-size: 20px !important;
	border-radius: 0px !important;
`

const ActionButton = ({ label = 'OK', loading, onClick }) => {
	return (
		<StyledButton
			fluid
			secondary
			disabled={loading}
			loading={loading}
			onClick={onClick}
		>
			{label}
		</StyledButton>
	)
}

export default ActionButton
