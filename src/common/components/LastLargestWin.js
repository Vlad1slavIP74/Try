import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  right: 0;
  top: -1px;
  height: 52px;
  width: 339px;
  padding-top: 19px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #de9b3c;

  & > span.price {
    font-size: 16px;
    font-weight: bold;
  }

  & > span.animated-block {
    float: left;
    position: relative;
    width: 22px;
    height: 20px;

    & > img {
      left: 20px;
      top: 0px;
      position: absolute;
      display: block;
      float: left;
      width: 15px;
      height: 16px;
    }

    & > img.animated {
      @keyframes flickerAnimation {
        0%   { opacity:1; }
        50%  { opacity:0; }
        100% { opacity:1; }
      }
      @-o-keyframes flickerAnimation{
        0%   { opacity:1; }
        50%  { opacity:0; }
        100% { opacity:1; }
      }
      @-moz-keyframes flickerAnimation{
        0%   { opacity:1; }
        50%  { opacity:0; }
        100% { opacity:1; }
      }
      @-webkit-keyframes flickerAnimation{
        0%   { opacity:1; }
        50%  { opacity:0; }
        100% { opacity:1; }
      }
      
     -webkit-animation: flickerAnimation 2.5s infinite;
     -moz-animation: flickerAnimation 2.5s infinite;
     -o-animation: flickerAnimation 2.5s infinite;
      animation: flickerAnimation 2.5s infinite;
    }
  }

  & > div.dark-win-underline {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 339px;
    height: 17px;
    background-image: linear-gradient(to bottom,rgba(246,247,248,0.01),rgba(211,134,23,0.2));
  }
`

const LastLargestWin = ({ dark, colorMode, price, currency }) => {
	return (
		<Container>
			<span className="animated-block">
				<img className="animated" src="/images/energy.svg" />
				<img src="/images/energy-empty.svg" />
			</span>
      Последний большой выигрыш <span className="price">{price} {currency}</span>
			{dark && <div className="dark-win-underline" />}
		</Container>
	)
}

export default LastLargestWin
