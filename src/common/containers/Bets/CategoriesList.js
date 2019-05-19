import React, {Component} from 'react'
import { Container, Row, Col, Visible, Hidden } from 'react-grid-system'
import { Menu, List } from 'semantic-ui-react'
import styled from 'styled-components'

import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import ScrolableSwipe from 'common/components/ScrolableSwipe'
import LastLargestWin from 'common/components/LastLargestWin'

const FullWidthBackground = styled.div`
	padding: 0px;
    width: 100%;
    height: 52px;
    background-color: ${props => props.dark ? '#0f1419' : '#f6f7f8'};
`
const Item = styled.a`
  ${props => !props.active ? 'color: #9299a2 !important;' : ''}
  font-size: 16px !important;
`

const CustomMenu = styled(Menu)`
	margin-top: 5px !important;
`

const adminUrl = /\/admin/

const CategoriesList = ({ dark, location, value, onChange }) => {
	if (adminUrl.test(location.pathname)) return null

	return (
		<FullWidthBackground dark={dark}>
			<ComponentMaxWidth>
				<ScrolableSwipe>
					<CustomMenu secondary inverted={dark}>
						<Menu.Item
							as={props => <Item {...props} active={value === 0}/>}
							name='Спорт'
							active={value === 0}
							onClick={() => onChange([0])} />
						<Menu.Item
							as={props => <Item {...props} active={value === 1}/>}
							name='Киберспорт'
							active={value === 1}
							onClick={() => onChange([1])} />
						<Menu.Item
							as={props => <Item {...props} active={value === 2}/>}
							name='Акции'
							active={value === 2}
							onClick={() => onChange([2])} />
						<Menu.Item
							as={props => <Item {...props} active={value === 3}/>}
							name='Криптовалюта'
							active={value === 3}
							onClick={() => onChange([3])} />
						<Menu.Item
							as={props => <Item {...props} active={value === 4}/>}
							name='События'
							active={value === 4}
							onClick={() => onChange([4])} />
					</CustomMenu>
				</ScrolableSwipe>
				<Hidden xs sm md>
					<LastLargestWin price="10500" currency="грн" dark={dark}/>
				</Hidden>
			</ComponentMaxWidth>
		</FullWidthBackground>
	)
}

export default CategoriesList
