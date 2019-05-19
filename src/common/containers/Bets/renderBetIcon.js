import React from 'react'
import styled from 'styled-components'

const SportIcon = styled.div`
  display: block;
  float: left;
  margin-top: 6px;
  width: 6px;
  height: 6px;
  border-radius: 10px;
  background-color: ${props => props.color};

  ${props => props.role === 'subcategory' && `
    margin-left: 13px;
    margin-right: 5px;
  `}

  ${props => props.role === 'bet_item' && `
    margin-right: 10px;
  `}
`

const CyberSportIcon = styled.img`
  display: block;
  float: left;
  height: 15px;
  margin-top: 2px;

  ${props => props.role === 'subcategory' && `
    margin-right: 6px;
    margin-left: 10px;
  `}

  ${props => props.role === 'bet_item' && `
    margin-right: 10px;
  `}
`

const CryptoIcon = styled.img`
  display: block;
  float: left;
  margin-right: 6px;
  height: 15px;
  margin-top: 1px;

  ${props => props.role === 'subcategory' && `
    margin-left: 13px;
  `}

  ${props => props.role === 'bet_item' && `
    margin-right: 10px;
  `}
`

const getCircleColor = (value) => {
	switch (value) {
	case 1: return '#2d8ad9'
	case 2: return '#b8b95a'
	case 3: return '#6c9e34'
	case 4: return '#d39631'
	case 5: return '#c82a3d'

	default: return '#000000'
	}
}

const getCyberSportIcon = (value) => {
	switch (value) {
	case 1: return '/images/CS.png'
	case 2: return '/images/Dota.png'

	default: return null
	}
}

const getCryptoIcon = (value) => {
	switch (value) {
	case 1: return '/images/1.png'
	case 2: return '/images/2.png'
	case 3: return '/images/3.png'
	case 4: return '/images/4.png'
	case 5: return '/images/5.png'
	case 6: return '/images/6.png'
	case 7: return '/images/7.png'
	case 8: return '/images/8.png'
	case 9: return '/images/9.png'

	default: return null
	}
}

const renderIcon = (category, subcategory, role) => {
	switch (category) {
	case 0: return <SportIcon color={getCircleColor(subcategory)} role={role} />
	case 1: return <CyberSportIcon src={getCyberSportIcon(subcategory)} role={role} />
	case 3: return <CryptoIcon src={getCryptoIcon(subcategory)} role={role} />

	default: return null
	}
}

export default renderIcon
