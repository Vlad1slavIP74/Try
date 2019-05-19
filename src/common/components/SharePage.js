import React from 'react'
import { Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import {FacebookShareButton, TwitterShareButton, VKShareButton} from 'react-share'

const ShareContainer = styled.div`
    position: absolute;
    left: 180px;
    top: 32px;
    width: 110px;
    height: 40px;

    ${props => props.dark && `
        color: #ffffff !important;
    `}

    & > p {
    ${props => props.dark && `
        color: #9299a2;
    `} 
    }
`

const ShareTitle = styled.p`
  margin: 0px auto;
  
`
const ShareIcon = styled(Icon)`
  display: inline-block !important;
  cursor: pointer;
`

const InlineFacebookBtn = styled(FacebookShareButton)`
  display: -webkit-inline-box !important;
  width: auto !important;
`

const InlineTwitterBtn = styled(TwitterShareButton)`
  display: -webkit-inline-box !important;
  width: auto !important;
`

const InlineVKBtn = styled(VKShareButton)`
  display: -webkit-inline-box !important;
  width: auto !important;
`

const SharePage = ({ dark, bet_id }) => {
	const url = `https://alfakasta.com/bets/${bet_id}`

	return (
		<ShareContainer dark={dark}>
			<ShareTitle>Поделиться</ShareTitle>
			<InlineFacebookBtn url={url}>
				<ShareIcon name='facebook f'/>
			</InlineFacebookBtn>
			<InlineTwitterBtn url={url}>
				<ShareIcon name='twitter'/>
			</InlineTwitterBtn>
			<InlineVKBtn url={url}>
				<ShareIcon name='vk'/>
			</InlineVKBtn>
		</ShareContainer>
	)
}

export default SharePage
