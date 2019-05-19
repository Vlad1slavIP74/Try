import { Button } from 'semantic-ui-react'
import styled from 'styled-components'

const DarkButton = styled(Button)`
  padding: 0px 5px !important;
  height: 38px !important;
  width: 170px !important;
  font-size: 14px !important;
  font-weight: bold !important;
  color: #fff !important;
  border: solid 1px #525f7f !important;
  background: #525f7f !important;

  &:hover {
    background: #fff !important;
    color: #525f7f !important;
  }
`
export default DarkButton
