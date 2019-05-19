import React from 'react'
import styled from 'styled-components'
import { trancateIfLong } from 'common/modules/string'

const Container = styled.label`
  display: block;
  position: relative;
  margin-top: 8px;
  width: auto;
`

const Text = styled.div`
  margin-top: 3px;
  font-size: 16px;
`

const LabelText = styled.span`
  white-space: nowrap;
  font-weight: normal !important;
  font-style: normal !important;
  font-stretch: normal !important;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.dark ? '#9299a2' : '#525f7f'};  
`

const Label = ({ dark, title, children }) => {
	return (
		<Container>
			<LabelText dark={dark}>{trancateIfLong(title, 28)}</LabelText>
			<Text>{children}</Text>
		</Container>
	)
}

export default Label
