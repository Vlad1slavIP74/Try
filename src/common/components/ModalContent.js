import { media } from 'common/styles/utils'
import styled from 'styled-components'

const ModalContent = styled.div`
  padding: ${props => props.largePadding ? 30 : 15}px;
  text-align: ${props => props.center ? 'center' : 'left'};
  color: #8d8d8d !important;
  min-height: 330px;

  ${media.xs`
    padding: ${props => props.largePadding ? '30px 20px' : '15px 20px'};
  `}

  a{
    color: #525f7f !important;
    text-decoration: underline;
  }
`

export default ModalContent
