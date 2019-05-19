import React, {Component} from 'react'
import { Row, Col } from 'react-grid-system'
import { Menu, List } from 'semantic-ui-react'
import styled from 'styled-components'

import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import ScrolableSwipe from 'common/components/ScrolableSwipe'
import renderIcon from './renderBetIcon'

const SubCategoriesContainer = styled.div`
  padding: 15px;
  padding-bottom: 5px;
  width: 100%;
`
const ListItem = styled.a`
  margin-left: 10px !important;
  color: ${props => props.dark ? (props.active ? '#ffffff' : '#9299A2') : '#525f7f'} !important;
  font-size: 16px !important;
  font-weight: ${props => props.active && !props.dark ? 'bold' : 'normal'};

  &:hover {
    color: ${props => props.dark ? '#ffffff' : '#525f7f'} !important;
  }
`
const ListItemAll = styled.a`
  margin-left: 10px !important;
  color: ${props => props.dark ? (props.active ? '#ffffff' : '#9299A2') : '#444444'} !important;
  font-size: 16px !important;
  font-weight: ${props => props.active || props.dark ? 'bold' : 'normal'};

  &:hover {
    color: ${props => props.dark ? '#ffffff' : '#444444'} !important;
  }
`

const SubCategoriesList = ({ dark, category, data, value, onChange }) => <ComponentMaxWidth>
	{data.length !== 0 &&
    <ScrolableSwipe>
    	<SubCategoriesContainer>
      	<List horizontal link inverted={dark}>
      		<List.Item
      			key={-1}
      			as={props => <ListItemAll dark={dark} {...props} active={!value}/>}
      			active={!value}
      			onClick={() => onChange([null])}>Все</List.Item>
      		{data.map(item =>
    				<List.Item
      				key={item.value}
      				as={props => <ListItem dark={dark} {...props} active={item.value === value}>{renderIcon(category, item.value, 'subcategory')}{props.children}</ListItem>}
      				active={item.value === value}
      				onClick={() => onChange([item.value])}>{item.text}</List.Item>
      		)}
      	</List>
    	</SubCategoriesContainer>
    </ScrolableSwipe>}
</ComponentMaxWidth>

export default SubCategoriesList
