import React, {Component} from 'react'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import _ from 'lodash'
import { connect } from 'react-redux'
import { getBetsRequest, getBetsByOneRequest } from 'common/actions/bets'
import { openJoinBetForm } from 'common/actions/layout'
import {bets} from 'config'
import {correctBetsParamsIfWrong, handleQueryParams} from 'common/modules/url'

import Filters from './Filters'
import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import ComponentMinHeight from 'common/components/ComponentMinHeight'
import CategoriesList from './CategoriesList'
import SubCategoriesList from './SubCategoriesList'
import BetsList from './BetsList'

const BackgroundMode = styled.div`
  ${props => props.dark ? 'background: #1a1f28 !important;' : ''}
`

class Bets extends Component {
	constructor (props) {
		super(props)
		this.state = {
			urlParams: correctBetsParamsIfWrong(this.props.location.search),
			activeBetId: null
		}
	}

	async bootstrap () {
		const urlParams = correctBetsParamsIfWrong(this.props.location.search)
		const b_id = this.props.match.params.id

		// await b_id ? this.props.getBetsByOneRequest({ b_id }) : this.props.getBetsRequest(urlParams)
	}

	componentDidMount () {
  	const { urlParams } = this.state
		const b_id = this.props.match.params.id

		// Если запрашиваемая страница /bets , то получаем ставки по url параметрам
		// Если страница /bets/:id, то получаем ставки исходя из положения запрашиваемой ставки в общем таблице
		// (в том числе паггинация, соседние ставки)
		const requestParams = correctBetsParamsIfWrong(this.props.location.search)

		if (_.isEqual(requestParams, urlParams)) {
			return b_id ? this.props.getBetsByOneRequest({ b_id }) : this.props.getBetsRequest(urlParams)
		}
	}

	componentWillReceiveProps (nextProps) {
  	if (!_.isEqual(nextProps.location.search, this.props.location.search)) {
  		// проверяем параметры из url, если некорректные, изменяем

  		const requestParams = correctBetsParamsIfWrong(nextProps.location.search)

  		// Обновляем стейт для фильтров и обновляем поиск
  		this.setState({ urlParams: requestParams })
  		this.props.getBetsRequest(requestParams)
  	}
	}

  handleMobileActiveBet = (b_id) => this.setState({ activeBetId: b_id })

  onBetJoin = (data) => this.props.openJoinBetForm(data)

  render () {
  	const user_id = this.props.auth.user && this.props.auth.user.u_id
  	const isShareBetPage = !!this.props.match.params.id
  	const { location, history, layout } = this.props
  	const betData = layout.defaultBetData
  	const { urlParams, activeBetId } = this.state
  	const { data, pagination } = this.props.bets.all
  	const { subcategories } = _.find(bets.categories, { value: urlParams.type })
  	const { loading } = this.props.bets.all
  	const { darkMode } = this.props.layout

  	return (
    	<BackgroundMode dark={darkMode}>
  			<ComponentMinHeight height={500}>
    			{isShareBetPage &&
            <Helmet>
            	<meta charSet="utf-8" />
            	<title>{betData.bid_description || ''} - ставки Alfakasta</title>
            	<meta name="description" content="1"/>
            	<meta name="keywords" content="1"/>
            	<meta property="fb:app_id" content="123715308261227"/>
            	<meta property="og:title" content="1"/>
            	<meta property="og:description" content="1"/>
            	<meta property="og:image" content="https://alfakasta.com/public/images/logo.png"/>
            	<meta property="og:type" content="article"/>
            	<meta property="og:url" content={`https://1001kurort.com` + location.pathname} />
            </Helmet>
    			}

    			<SubCategoriesList dark={darkMode} category={urlParams.type} data={subcategories} value={urlParams.subcategory} onChange={handleQueryParams(history, ['subcategory'])}/>
    			<ComponentMaxWidth>
    				{/* <Filters
    					sort={urlParams.sort}
    					order={urlParams.order}
    					betsStatus={urlParams.status}
    					betName={urlParams.bet_name}
    					handleBetStatus={handleQueryParams(history, ['status'])}
    					handleSort={handleQueryParams(history, ['sort', 'order'])}
    					handleBetName={handleQueryParams(history, ['bet_name'])}/> */}
      			<BetsList
    					dark={darkMode}
    					loading={loading}
    					location={location}
    					user_id={user_id}
    					betsStatus={urlParams.status}
    					category={urlParams.type}
    					data={data}
    					pagination={pagination}
    					activeBetId={activeBetId}
    					onPageChange={handleQueryParams(history, ['page'])}
    					onJoin={this.onBetJoin}
    					onBetMobileClicked={this.handleMobileActiveBet} />
    			</ComponentMaxWidth>
      	</ComponentMinHeight>
  		</BackgroundMode>
  	)
  }
}

const mapStateToProps = ({ layout, auth, bets }) => ({
	layout,
	auth,
	bets
})

export default connect(mapStateToProps, { getBetsRequest, getBetsByOneRequest, openJoinBetForm })(Bets)
