import React, {Component} from 'react'
import styled from 'styled-components'

const ScrolableSwipe = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  &::-webkit-scrollbar {
      display: none;
  }
`

export default ({ children }) => {
	return (
		<ScrolableSwipe>
			{children}
		</ScrolableSwipe>
	)
}
