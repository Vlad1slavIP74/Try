import React, {Component} from 'react'
import { Row, Col } from 'react-grid-system'
import { Form, Input, Icon } from 'semantic-ui-react'
import styled from 'styled-components'

const Label = styled.label`
  margin: 15px 0px;
  display: block;
  position: relative;
  font-size: 15px !important;
  color: #8d8d8d !important;
`
const PlaceHolder = styled.p`
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
`
const StyledInput = styled.input`
  width: 100% !important;
  max-width: none;
  padding-left: ${props => props.labelWidth ? props.labelWidth : 95}px !important;
  padding-right: ${props => props.secret ? '45px' : '10px'} !important;
  ${props => props.disabled
		? ` background-color: #cbc9c9 !important;
        color: #2b2b2b !important;
        border-radius: 3px !important;`
		: ''}

`

const InputIcon = styled.div`
  position: absolute;
  z-index: 2;
  top: 13px;
  right: 10px;
  cursor: pointer;
`

class CustomInput extends Input {
  state = {
  	hideDigits: !!this.props.secret
  }

  render () {
  	const {
  		required,
  		disabled,
  		label,
  		labelWidth,
  		name,
  		secret,
  		value = '',
  		onChange,
  		error
  	} = this.props

  	const { hideDigits } = this.state

  	return (
  		<Label>
  			<PlaceHolder>{label}</PlaceHolder>
  			<InputIcon>
  				{secret && <img src='/public/images/eye.svg' onClick={() => this.setState({ hideDigits: !hideDigits })}/>}
  			</InputIcon>
  			<Form.Input fluid disabled={disabled} error={error}>
  				<StyledInput
  					secret={secret}
  					disabled={disabled}
  					required={required}
  					labelWidth={labelWidth}
  					name={name}
  					type={hideDigits ? 'password' : 'text'}
  					value={value}
  					onChange={(e) => onChange(e, { name, value: e.target.value })}/>
  			</Form.Input>
  		</Label>
  	)
  }
}

export default CustomInput

/*
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-grid-system'
import { Form, Input, Icon } from 'semantic-ui-react'
import styled from 'styled-components'

const Label = styled.label`
  margin: 15px 0px;
  display: block;
  position: relative;
  font-size: 15px !important;
  color: #8d8d8d !important;
`
const PlaceHolder = styled.p`
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
`
const StyledInput = styled.input`
  width: 100% !important;
  max-width: none;
  padding-left: ${props => props.labelWidth ? props.labelWidth : 95}px !important;
  padding-right: ${props => props.secret ? '45px' : '10px'} !important;
  border-radius: 3px !important;

  ${props => props.dark && `
    background-color: #1a1f28 !important;
    color: #ffffff !important;
  `}

  ${props => !props.dark && props.disabled && `
    background-color: #cbc9c9 !important;
    color: #2b2b2b !important;
  `}

  ${props => props.dark && props.disabled && `
    background-color: #cbc9c9 !important;
    color: #2b2b2b !important;
  `}

`

const InputIcon = styled.div`
  position: absolute;
  z-index: 2;
  top: 13px;
  right: 10px;
  cursor: pointer;
`

class CustomInput extends Input {
  state = {
    hideDigits: !!this.props.secret
  }

  render () {
    const {
      required,
      disabled,
      label,
      labelWidth,
      name,
      secret,
      value = '',
      onChange,
      error
    } = this.props
    const { darkMode } = this.props.layout
    const { hideDigits } = this.state

    console.log(darkMode)
    return (
      <Label>
        <PlaceHolder>{label}</PlaceHolder>
        <InputIcon>
          {secret && <img src='/public/images/eye.svg' onClick={() => this.setState({ hideDigits: !hideDigits })}/>}
        </InputIcon>
        <Form.Input fluid disabled={disabled} error={error}>
          <StyledInput
            dark={darkMode}
            secret={secret}
            disabled={disabled}
            required={required}
            labelWidth={labelWidth}
            name={name}
            type={hideDigits ? 'password' : 'text'}
            value={value}
            onChange={(e) => onChange(e, { name, value: e.target.value })}/>
        </Form.Input>
      </Label>
    )
  }
}

const mapStateToProps = ({ layout }) => ({
  layout
})

export default connect(mapStateToProps, null)(CustomInput)
*/
