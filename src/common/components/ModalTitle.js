import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Title = styled.span`
  display: -webkit-inline-box;
  max-width: 300px;
  margin: 0px;
  margin-bottom: 10px;
  padding-right: 30px;
  line-height: normal;
  font-size: ${props => props.small === true ? '20px' : '23px'} !important;
  font-weight: bold;
  text-align: left;
  color: ${props => props.link ? '#525f7f' : '#2b2b2b'} !important;
`

const ModalTitle = ({ children, link, small }) => {
	return (
		link
			? <Link to={link}>
				<Title link small={small}>{children}</Title>
			</Link>
			: <Title small={small}>{children}</Title>
	)
}

export default ModalTitle
