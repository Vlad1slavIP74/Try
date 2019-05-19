import React, {Component} from 'react'
import { Row, Col, Visible, Hidden } from 'react-grid-system'
import { Modal, Table, Form, Input } from 'semantic-ui-react'
import { DateTimePicker } from 'react-widgets'
import { connect } from 'react-redux'
import { updateProfileInfoRequest, updateProfilePasswordRequest } from 'common/actions/auth'
import { getProfilePassword } from 'common/api'
import { getSecretToken } from 'common/modules/auth'
import { validate } from 'common/modules/validation'
import { media } from 'common/styles/utils'
import _ from 'lodash'
import sha256 from 'sha256'
import moment from 'moment'
import styled from 'styled-components'

import CustomModal from 'common/components/Modal'
import ScrolableSwipe from 'common/components/ScrolableSwipe'
import LightButton from 'common/components/LightButton'
import ModalContent from 'common/components/ModalContent'
import ModalTitle from 'common/components/ModalTitle'
import ActionButton from 'common/components/ActionButton'
import CustomInput from 'common/components/CustomInput'

const RightAlign = styled.div`
  margin: 10px 10px;
  text-align: right;
`

const HR = styled.hr`
  border: solid 1px ${props => props.dark ? '#212731' : '#e4e8ef'};
  margin: 0px 12px;
`

const MobileContainer = styled.div`
  margin-top: 15px;
  padding: 0px 15px;
`

const MobileLabel = styled.p`
  margin: 5px;
  margin-left: 0px !important;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #9299a2;
`
const WithMarginLightButton = styled(LightButton)`
  margin-bottom: 10px !important;
  margin-top: 10px !important;
`

const defaultState = {
	changingAll: false,
	changingPassword: false,
	values: {}
}

const StyledDateTimePicker = styled(DateTimePicker)`
  & > .rw-widget-picker {
    width: 200px !important;
  }
`

const InputColorMode = styled(Input)`
  ${props => props.dark && `
    & > input {
      border: solid 1px #212731 !important;
      background-color: #1a1f28 !important;
      color: #ffffff !important;
    }    

    & > input:focus {  
      border: solid 1px #4f545a !important;
    }
  `}
`

const DatePickerColorMode = styled(DateTimePicker)`
  ${props => props.dark && `

    & > div {
      border: solid 1px #212731 !important;
      background-color: #1a1f28 !important;
    }    
    
    & > div > input {  
      background-color: #1a1f28 !important;
      color: #ffffff !important;
    }

    & > div > input:focus {  
      background-color: #1a1f28 !important;
      border: solid 1px #4f545a !important;
      border-right: 0px !important;
    }

    & > div > input ~ span {
      border-left: 0px !important;
    }

    & > div > input:focus ~ span {  
      background-color: #1a1f28 !important;
      border: solid 1px #4f545a !important;
      border-left: 0px !important;
    }
  `}
`

const WhiteIfDark = styled.p`
  color: ${props => props.dark ? '#ffffff' : 'inherit'};
`

class Profile extends Component {
  state = defaultState

  componentWillMount () {
  	this.setUserPasswordToState()
  }

  componentWillReceiveProps (nextProps) {
  	if (!_.isEqual(nextProps.auth.user, this.props.auth.user)) {
  		this.setUserPasswordToState()
  	}
  }

  setUserPasswordToState () {
  	const token = getSecretToken()

  	getProfilePassword({
  		token
  	}, {
  		Authorization: `user ${token}`
  	})
  		.then(({ password }) => this.setState({ CUR_USER_PASSWORD: password }))
  }

  toChangingAll = () => {
  	this.setState({ changingAll: true, changingPassword: false, values: this.props.user })
  }

  toChangingPassword = () => {
  	this.setState({ changingAll: false, changingPassword: true })
  }

  handleChangeData = name => event => {
  	const { values } = this.state

  	this.setState({ values: { ...values, [name]: event.target.value } })
  }

  handleChangeDate = (born) => {
  	const { values } = this.state

  	this.setState({
  		values: {
  			...values,
  			born: moment(born).format('YYYY-MM-DD')
  		}
  	})
  }

  cancel = () => {
  	this.setState(defaultState)
  }

  updateAllData = () => {
  	this.props.updateProfileInfoRequest(this.state.values, { Authorization: `user ${getSecretToken()}` })
  	this.setState(defaultState)
  }

  updatePassword = () => {
  	const { u_id } = this.props.user
  	const { values, CUR_USER_PASSWORD } = this.state

  	let errorOldPassword = false,
  		  errorNewPassword = false,
  		  errorCPassword = false

  	if (!validate('not_null', values.old_password)) {
  		errorOldPassword = true
  	}

  	if (!validate('not_null', values.new_password)) {
  		errorNewPassword = true
  	}

  	if (!validate('not_null', values.errorCPassword)) {
  		errorCPassword = true
  	}

  	if (!validate('equal', sha256(values.old_password), CUR_USER_PASSWORD)) {
  		errorOldPassword = true
  	}

  	if (!validate('equal', values.new_password, values.conf_password)) {
  		errorCPassword = true
  		errorNewPassword = true
  	}

  	if (errorOldPassword || errorNewPassword) {
  		return this.setState({ errorOldPassword, errorNewPassword, errorCPassword })
  	}

  	this.props.updateProfilePasswordRequest({ u_id, password: values.new_password }, { Authorization: `user ${getSecretToken()}` })
  	this.setState(defaultState)
  }

  render () {
  	const {user, auth, dark} = this.props
  	const {
  		values,
  		changingAll,
  		changingPassword,
  		errorCPassword,
  		errorOldPassword,
  		errorNewPassword
  	} = this.state

  	console.log('render')

  	return (
  		<div>
  			<Hidden xs sm>
    			<Table columns={6} inverted={dark}>
    				<Table.Header>
    					<Table.Row>
    						<Table.HeaderCell>Имя</Table.HeaderCell>
    						<Table.HeaderCell>Фамилия</Table.HeaderCell>
    						<Table.HeaderCell>Дата рождения</Table.HeaderCell>
    						<Table.HeaderCell>Электронная почта</Table.HeaderCell>
    						<Table.HeaderCell>Телефон</Table.HeaderCell>
    						<Table.HeaderCell>Страна</Table.HeaderCell>
    					</Table.Row>
    				</Table.Header>
    				<Table.Body>
    					{changingAll
    						? <Table.Row>
    							<Table.Cell>
    								<InputColorMode
  										dark={dark}
    									value={values.name || ''}
    									onChange={this.handleChangeData('name')}/>
    							</Table.Cell>
    							<Table.Cell>
    								<InputColorMode
  										dark={dark}
    									value={values.last_name || ''}
    									onChange={this.handleChangeData('last_name')}/>
    							</Table.Cell>
    							<Table.Cell>
    								<DatePickerColorMode
  										dark={dark}
    									time={false}
    									placeholder={`дд/мм/гггг`}
    									max={new Date()}
    									value={values.born ? moment(values.born).toDate() : undefined}
    									onChange={this.handleChangeDate} />
    							</Table.Cell>
    							<Table.Cell>
    								<InputColorMode
  										dark={dark}
    									value={values.email || ''}
    									onChange={this.handleChangeData('email')}/>
    							</Table.Cell>
    							<Table.Cell>
    								<InputColorMode
  										dark={dark}
    									value={values.phone || ''}
    									onChange={this.handleChangeData('phone')}/>
    							</Table.Cell>
    							<Table.Cell>
    								<InputColorMode
  										dark={dark}
    									value={values.country || ''}
    									onChange={this.handleChangeData('country')}/>
    							</Table.Cell>
    						</Table.Row>
    						: <Table.Row>
    							<Table.Cell>{user.name || '-'}</Table.Cell>
    							<Table.Cell>{user.last_name || '-'}</Table.Cell>
    							<Table.Cell>{user.born ? moment(user.born).format('DD/MM/YYYY') : '-'}</Table.Cell>
    							<Table.Cell>{user.email || '-'}</Table.Cell>
    							<Table.Cell>{user.phone || '-'}</Table.Cell>
    							<Table.Cell>{user.country || '-'}</Table.Cell>
    						</Table.Row>}
    				</Table.Body>
    			</Table>
    			<HR dark={dark}/>
    			<RightAlign>
    				{!changingAll && !changingPassword && <div>
    					<LightButton onClick={this.toChangingAll} dark={dark}>Изменить данные</LightButton>
    					<LightButton onClick={this.toChangingPassword} dark={dark}>Изменить пароль</LightButton>
    				</div>}

    				{changingAll && <div>
    					<LightButton onClick={this.cancel} dark={dark}>Отменить</LightButton>
    					<LightButton onClick={this.updateAllData} dark={dark}>Сохранить</LightButton>
    				</div>}
    			</RightAlign>

  			</Hidden>
  			<Visible xs sm>
  				<MobileContainer>
    				<MobileLabel>Имя</MobileLabel>
  					{changingAll
  						? <InputColorMode
  							dark={dark}
  							value={values.name || ''}
  							onChange={this.handleChangeData('name')}
  						/>
  						: <WhiteIfDark dark={dark}>{user.name || '-'}</WhiteIfDark>}
    				<MobileLabel>Фамилия</MobileLabel>
  					{changingAll
  						? <InputColorMode
  							dark={dark}
  							value={values.last_name || ''}
  							onChange={this.handleChangeData('last_name')}
  						/>
  						: <WhiteIfDark dark={dark}>{user.last_name || '-'}</WhiteIfDark>}
    				<MobileLabel>Дата рождения</MobileLabel>
  					{changingAll
  						? <DatePickerColorMode
  							dark={dark}
  							time={false}
  							placeholder={`дд/мм/гггг`}
  							max={new Date()}
  							value={values.born ? moment(values.born).toDate() : undefined}
  							onChange={this.handleChangeDate}
  						/>
  						: <WhiteIfDark dark={dark}>{user.born ? moment(user.born).format('DD/MM/YYYY') : '-'}</WhiteIfDark>}
    				<MobileLabel>Электронная почта</MobileLabel>
  					{changingAll
  						? <InputColorMode
  							dark={dark}
  							value={values.email || ''}
  							onChange={this.handleChangeData('email')}
  						/>
  						: <WhiteIfDark dark={dark}>{user.email || '-'}</WhiteIfDark>}
    				<MobileLabel>Телефон</MobileLabel>
  					{changingAll
  						? <InputColorMode
  							dark={dark}
  							value={values.phone || ''}
  							onChange={this.handleChangeData('phone')}
  						/>
  						: <WhiteIfDark dark={dark}>{user.phone || '-'}</WhiteIfDark>}
    				<MobileLabel>Страна</MobileLabel>
  					{changingAll
  						? <InputColorMode
  							dark={dark}
  							value={values.country || ''}
  							onChange={this.handleChangeData('country')}
  						/>
  						: <WhiteIfDark dark={dark}>{user.country || '-'}</WhiteIfDark>}

  					{!changingAll && !changingPassword && <div>
  						<WithMarginLightButton onClick={this.toChangingAll} dark={dark}>Изменить данные</WithMarginLightButton>
  						<WithMarginLightButton onClick={this.toChangingPassword} dark={dark}>Изменить пароль</WithMarginLightButton>
  					</div>}

  					{changingAll && <div>
  						<WithMarginLightButton onClick={this.cancel} dark={dark}>Отменить</WithMarginLightButton>
  						<WithMarginLightButton onClick={this.updateAllData} dark={dark}>Сохранить</WithMarginLightButton>
  					</div>}

  				</MobileContainer>
  			</Visible>

  			<CustomModal
  				closeIcon={<div className="close icon"></div>}
  				style={{ maxWidth: 450 }}
  				dimmer={true}
  				closeOnDimmerClick={false}
  				open={changingPassword}
  				onClose={() => this.setState({ changingPassword: false })}
  			>
  				<Form>
  					<ModalContent>
  						<ModalTitle>Смена пароля</ModalTitle>
  						<CustomInput
  							required
  							disabled={false}
  							name='old_password'
  							label='Текущий пароль'
  							labelWidth={130}
  							value={values.old_password}
  							onChange={this.handleChangeData('old_password')}
  							error={errorOldPassword}/>
  						<CustomInput
  							required
  							secret
  							disabled={false}
  							name='new_password'
  							label='Новый пароль'
  							labelWidth={130}
  							value={values.new_password}
  							onChange={this.handleChangeData('new_password')}
  							error={errorNewPassword}/>
  						<CustomInput
  							required
  							secret
  							disabled={false}
  							name='conf_password'
  							label='Повторите пароль'
  							labelWidth={130}
  							value={values.conf_password}
  							onChange={this.handleChangeData('conf_password')}
  							error={errorNewPassword}/>
  					</ModalContent>
  					<ActionButton label='Создать новый пароль' onClick={this.updatePassword}/>
  				</Form>
  			</CustomModal>
  		</div>
  	)
  }
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, { updateProfileInfoRequest, updateProfilePasswordRequest })(Profile)
