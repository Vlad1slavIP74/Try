import React from 'react'
import { media } from 'common/styles/utils'
import styled from 'styled-components'

import ComponentMaxWidth from 'common/components/ComponentMaxWidth'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 325px;
  background: ${props => props.dark ? '#000000' : '#55ac97'};
  overflow: hidden;
`

const Background = styled.div`
  background: ${props => props.dark ? '#2f3a44' : '#55ac97'};
  width: 100%;
  height: 326px;
`

const TextContainer = styled.div`
  position: absolute;
  z-index: 2;
  display: block;
  width: 400px;
  left: 15;
  bottom: 32px;
  color: #ffffff;
  text-align: left;

  ${media.xs`
    width: 350px !important;
  `}
`

const TextTitle1 = styled.p`
  font-size: 45px;
  font-weight: bold;
  line-height: normal;
  margin-bottom: 0px;
`

const TextTitle2 = styled.p`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 0px;
`

const Text = styled.p`
  margin-top: 5px;
  margin-bottom: 32px;  
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  ${props => props.dark ? `color: #9299a2` : ''}
`
const HowItWorks = styled.a`
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  text-decoration: underline;
  -webkit-letter-spacing: normal;
  -moz-letter-spacing: normal;
  -ms-letter-spacing: normal;
  letter-spacing: normal;
  color: #ffffff;

  &:hover {
    color: ${props => props.dark ? '#9299A2' : '#fff'};
    text-decoration: underline;
    cursor: pointer;
  }
`

const PlayIcon = styled.img`
  display: inline-block;
  width: 8px;
  height: 10.7px;
  margin-right: 8px;
`

const Person = styled.img`
  position: absolute;
  z-index: 1;
  right: 110px;
  bottom: 0;
  height: 326px;

  ${media.xs`right: -136px;opacity: 0.23;`}
  ${media.sm`right: -136px;opacity: 0.23;`}
  ${media.md`right: -50px;`}
`

const adminUrl = /\/admin/

const Slider = ({ location, dark }) => {
	if (adminUrl.test(location.pathname)) return null

	return (
  	<Container dark={dark}>
  		<Background dark={dark}/>
  		<ComponentMaxWidth>
    		<TextContainer>
    			<TextTitle1>Делайте ставки</TextTitle1>
					<TextTitle2>на все что угодно.</TextTitle2>
    			<Text dark={dark}>От спортивных матчей и киберпорта до курса акций на фондовом рынке, криптовалюты и многое другое.</Text>
					<HowItWorks href='https://www.youtube.com/watch?v=1M_HF7wtaEs&feature=youtu.be' target='_blank' dark={dark}>
						<PlayIcon src="/images/play-arrow.svg"/>
            Как это работает
					</HowItWorks>
    		</TextContainer>
				<Person src='/images/man.png' />
  		</ComponentMaxWidth>
  	</Container>
	)
}

export default Slider
