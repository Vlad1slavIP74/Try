import { Button } from 'semantic-ui-react'
import styled from 'styled-components'

const LightButton = styled(Button)`
  padding: 0px 5px !important;
  height: 38px !important;
  width: 170px !important;
  font-size: 14px !important;
  font-weight: bold !important;
  border: ${props => props.dark ? '0px' : 'solid 1px #e4e8ef'}  !important;
  color: ${props => props.dark ? '#ffffff' : '#525f7f'} !important;
  background: ${props => props.dark ? '#232c33' : '#fff'} !important;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.02) !important;

  &:hover {
    cursor: pointer;
    box-shadow: none !important;
  }

  &:active {
    border: 1px solid ${props => props.dark ? '#4f545a' : '#525f7f'} !important;
  }
`
export default LightButton
