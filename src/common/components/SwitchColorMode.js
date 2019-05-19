
import React from 'react'
import styled from 'styled-components'
import { trancateIfLong } from 'common/modules/string'

const ColorMode = styled.div`
  cursor: pointer;
  display: block;
  float: left;
  width: 120px;
  height: 23px;
  margin-top: 20px;
  margin-left: 30px;
  border-radius: 3px;
  
  border: solid 1px ${props => props.dark ? '#000000' : '#e4e8ef'};
  background-color: ${props => props.dark ? '#232c33' : '#ffffff'};

  & > span {
    margin-left: 10px;
    width: 87px;
    height: 15px;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 22px;
    -webkit-letter-spacing: normal;
    -moz-letter-spacing: normal;
    -ms-letter-spacing: normal;
    letter-spacing: normal;
    color: #9299a2;  
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }

  &:hover {
    ${props => props.dark
		? `
      background: #1d252c !important;`
		: `
      & > span {
        color: #525f7f !important;
      }
    `}    
  }

  & > div.colormode-indicator {
    position: relative;
    display: block;
    width: 11px;
    height: 11px;    
    float: right;
    margin-right: 6px;
    margin-top: 5px;
    border-radius: 10px;
    ${props => props.dark
		? `  
      box-shadow: inset 0 1px 2px 0 rgba(29, 42, 54, 0.25);
      background-image: linear-gradient(to bottom, #171717, #232323);`
		: `
      box-shadow: inset 0 1px 2px 0 rgba(29,42,54,0.25);
      background-image: linear-gradient(to bottom,#f8f8f8,#dddddd);`}
  }

  &:hover div.colormode-indicator {
    ${props => props.dark
		? ``
		: `
      box-shadow: inset 0 1px 2px 0 rgba(29, 42, 54, 0.25) !important;
      background-image: linear-gradient(to bottom, #f8f8f8, #dddddd) !important;
    `}
  }

  & > div.colormode-indicator > div.colormode-indicator-2 {
    position: absolute;
    right: 2px;
    top: 2px;
    z-index: 99;
    width: 0px;
  }

  ${props => !props.dark && `
    &:hover > div.colormode-indicator > div.colormode-indicator-2 {
      width: 7.1px;
      height: 7px;
      border-radius: 5px;
      opacity: 0.3;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15), inset 0 1px 2px 0 rgba(29, 42, 54, 0.25);
      background-image: linear-gradient(to bottom, #b3e84c, #3c901e);
    }
  `}

  ${props => props.dark && `
    & > div.colormode-indicator > div.colormode-indicator-2 {
      width: 7.1px;
      height: 7px;
      border-radius: 10px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15), inset 0 1px 2px 0 rgba(29, 42, 54, 0.25) !important;
      background-image: linear-gradient(to bottom, #b3e84c, #3c901e) !important;
    }

    &:hover > div.colormode-indicator > div.colormode-indicator-2 {
      width: 7.1px;
      height: 7px;
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15), inset 0 1px 2px 0 rgba(29, 42, 54, 0.25);
      background-image: linear-gradient(to bottom, #b3e84c, #3c901e);
    }
  `}

`

const SwitchColorMode = ({ dark, onClick }) => {
	return (
		<ColorMode dark={dark} onClick={onClick}>
			<span>Темный режим</span>
			<div className="colormode-indicator">
				<div className="colormode-indicator-2"/>
			</div>
		</ColorMode>
	)
}

export default SwitchColorMode
