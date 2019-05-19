import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled from 'styled-components'

import ComponentMaxWidth from 'common/components/ComponentMaxWidth'

const Container = styled.div`
  margin: 150px 0px;
  padding: 40px;
`

const NotFound = ({ location }) => {
	return (
		<ComponentMaxWidth>
			<Container>
				<h1>Error 404! Запрашиваемая страница не найдена</h1>
				<Link to='/' className='bold'>Вернуться на главную?</Link>
			</Container>
		</ComponentMaxWidth>
	)
}

export default withRouter(NotFound)
