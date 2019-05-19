import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Visible, Hidden } from 'react-grid-system'
import { List } from 'semantic-ui-react'
import styled from 'styled-components'
import {media} from 'common/styles/utils'

import ComponentMaxWidth from './ComponentMaxWidth'
import ScrolableSwipe from 'common/components/ScrolableSwipe'

const ContainerMobileCenter = styled(Container)`
	${media.xs`
		text-align: center;
	`}
	${media.sm`
		text-align: center;
	`}
`
const Wrapper = styled.footer`
	padding-top: 30px;
	padding: 0px 30px 35px;
	width: 100%;
	min-height: 263px;
	background-image: linear-gradient(to top, ${props => props.dark ? '#0f1419, #0f1419' : '#eaeaea, #ececec'});
	color: #444444;
`
const Header = styled.h5`
	color: ${props => props.dark ? '#ffffff' : '#9299a2'};
	margin-top: 10px !important;
`

const Image = styled.img`
  width: 100px;
  margin-right: 15px;
  ${props => props.gray
		? 'filter: grayscale(100%);'
		: ''}
`

const RealSizeImage = styled.img`
  ${props => props.gray
		? 'filter: grayscale(100%);'
		: ''}
`

const ImageContainer = styled.div`
  margin: 10px 0px;
  margin-left: -20px;
`

const SupportImageContainer = styled.div`
  margin-left: -7px;
`

const ColorfullList = styled.div`
	& > div.item, & > div.item > a {
		${props => props.dark ? 'color: #9299a2 !important;' : ''}
	}
`

const Footer = ({ dark }) => {
	return (
		<Wrapper dark={dark}>
			<ComponentMaxWidth>
  			<ContainerMobileCenter fluid>
					<Row>
						<Col xl={12}>
							<ScrolableSwipe>
								<ImageContainer>
									<Image src='/public/images/Visa.png' gray/>
									<Image src='/public/images/Master.png' gray/>
									<Image src='/public/images/Приват24.png' gray/>
									<Image src='/public/images/Яндекс-Деньги.png' gray/>
									<Image src='/public/images/Qiwi.png' gray/>
									<Image src='/public/images/Skrill.png' gray/>
									<Image src='/public/images/Stripe.png' gray/>
									<Image src='/public/images/Interkassa.png' gray/>
								</ImageContainer>
							</ScrolableSwipe>
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={4} xl={2}>
							<Header dark={dark}>Поддержка</Header>
							<ColorfullList dark={dark}>
								{/* <List.Item>+380965141144</List.Item> */}
								<List.Item>support@alfakasta.com</List.Item>
								<List.Item>
									<SupportImageContainer>
										<RealSizeImage src='/public/images/Telegram.png' gray/>
										<RealSizeImage src='/public/images/Viber.png' gray/>
										<RealSizeImage src='/public/images/Whatsapp.png' gray/>
									</SupportImageContainer>
								</List.Item>
							</ColorfullList>
						</Col>
						<Col xs={12} md={4} xl={2}>
							<Hidden xs sm>
								<Header dark={dark}>Alfakasta</Header>
								<ColorfullList dark={dark}>
									<List.Item><Link to='/policies'>Правила сервиса</Link></List.Item>
									<List.Item><Link to='/privacy'>Конфиденциальность</Link></List.Item>
									<List.Item><Link to='/faq'>Часто задаваемые вопросы</Link></List.Item>
								</ColorfullList>
							</Hidden>
						</Col>
						<Col xs={12} md={4} xl={2}>
							<Hidden xs sm>
								<Header dark={dark}>Мы в сети</Header>
								<ColorfullList dark={dark}>
									<List.Item><a href="https://www.facebook.com/AlfakastaSupport" target="_blank" rel="noopener noreferrer">Facebook</a></List.Item>
								</ColorfullList>
							</Hidden>
						</Col>
						<Col xs={12} md={6} xl={6}>
							<Header dark={dark}>Безопасность</Header>
							<ScrolableSwipe>
								<Image src='/public/images/Norton.png'/>
								<Image src='/public/images/Visa-v.png'/>
								<Image src='/public/images/SSL.png'/>
								<Image src='/public/images/Master-s.png'/>
							</ScrolableSwipe>
						</Col>
					</Row>
				</ContainerMobileCenter>
			</ComponentMaxWidth>
		</Wrapper>
	)
}

export default Footer
