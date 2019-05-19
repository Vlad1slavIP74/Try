import styled, {css} from 'styled-components'
import {Button, Input, TextArea, Dropdown} from 'semantic-ui-react'
import { media } from 'common/styles/utils'

export const Line = styled.div`
  position: relative;
  margin: 10px 0px;
  padding: 0px;
  ${media.xs`
    min-height: 70px;
  `}
`
export const CategoryName = styled.span`
  display: inline-block;
  vertical-align: top;  
  padding: 0px;
  margin: 0px;
  width: 109px;
  height: 17px;
  color: #2b2b2b;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 34px;  
  letter-spacing: normal;
  ${media.xs`
    height: 34px;
    width: 100%;
  `}
`
export const CategoryNameWithDescription = styled.span`
  display: inline-block;
  vertical-align: top;  
  padding: 0px;
  margin: 0px;
  color: #2b2b2b;
  width: 109px;
  height: 17px;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 34px;  
  letter-spacing: normal;
  
  ${media.xs`
    height: 34px;
    width: 100%;
  `}

  &:hover {
    cursor: pointer !important;
    color: #457686 !important;
  }
`
export const CategoryDescription = styled.p`
  display: none;
  z-index: 9999999;
  position: absolute;
  top: 10px;
  left: 25px;

  &:hover {
    display: block;
  }
`

export const KoefValue = styled.span`
  margin-left: 56px;
`

export const Info = styled.p`
  display: block;
  padding: 15px;
  text-align: center;
  font-size: 24px;
`

export const ErrorText = styled.p`
  margin-top: 10px;
  margin-bottom: 0px;
  text-align: center;
  font-size: 12px;
  color: #e06362;
`

export const StyledInput = styled(Input)`
  min-width: auto !important;
  margin-left: 10px !important;

  ${media.xs`
    margin-left: 0px !important;
  `}

  & > input {
    padding: 7px 12px !important;
    font-size: 15px !important;
    text-decoration: ${props => props.underlinedinput ? 'underline !important' : 'none'};
  }

  & > input::placeholder {
    text-decoration: ${props => props.underlinedinput ? 'underline !important' : 'none'};
  }

  &.disabled {
    opacity: 1 !important;
    cursor: not-allowed !important;
  }

  &.disabled > input {
    background: #eee !important;
  }

  &.labeled > .label {
    padding: 9px !important;
  }
`

export const StyledTextArea = styled(TextArea)`
  min-width: auto !important;
  font-family: 'Proxima Nova';
  padding: 10px 14px !important;
  margin-left: 10px !important;
  color: #2b2b2b !important;
  border: 1px solid rgba(34, 36, 38, 0.15); 
  border-radius: 4px !important;
  outline:none;
  
  ${media.xs`
    margin-left: 0px !important;
  `}

  &.disabled {
    opacity: 1 !important;
    cursor: not-allowed !important;
  }

  &.disabled > input {
    background: #eee !important;
  }

  &:focus {
    border-color: #85B7D9;
  }

  &::-moz-placeholder {
    color: #adadad !important;
  }

  &::-webkit-input-placeholder {
    color: #adadad !important;
  }

`

export const StyledDropdown = styled(Dropdown)`
  min-width: auto !important;
  min-height: auto !important;
  height: 34px !important;
  padding: 8px 12px !important;
  margin-left: 10px !important;
  
  ${media.xs`
    margin-left: 0px !important;
  `}

  & i {
    top: 7px !important;
  }

  &.disabled {
    opacity: 1 !important;
    cursor: not-allowed !important;
    background: #eee !important;
    pointer-events: auto !important;
  }

  &.error {
    background: #fff !important;
  }

`

export const SharesButton = styled(Button)`
  width: 63px !important;
  height: 32px;
  padding: 0px !important;
  text-align: center !important;
  line-height: 34px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
`

export const SharesGroup = styled(Button.Group)`
  margin: 0px !important;
  margin-left: 47px !important;
  border: 1px solid ${props => props.error ? '#E0B4B4' : '#d8d8d8'} !important;
  border-radius: 3px;

  ${media.xs`
    margin-left: 0px !important;
    padding-top: 5px;
  `}
`

export const ActionButton = styled(Button)`
  font-size: 20px !important;
`
export const ErrorAnimatedBlock = styled.div`
  z-index: 9999999;
  position: absolute;
  bottom: 52px;
  right: -20px;
  width: auto;
  max-width: 200px;
  padding: 10px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  background-color: #fffafa;
  border: solid 0.8px #e06362;
  border-radius: 4px;
  color: #e06362;

  & p, a {
    font-size: 12px !important;
    word-break: break-word !important;
  }

  & a {
    text-decoration: underline !important;
    color: #4183c4 !important;
  }
`

export const CurrencySelect = styled.select`
  background: none !important;
  border: 0px;
  font-family: "Proxima Nova";
  font-size: 1em;
  font-weight: 700;
  color: #b0b0b0;
`
