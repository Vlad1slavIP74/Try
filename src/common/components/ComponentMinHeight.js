import styled from 'styled-components'

const ComponentMinHeight = styled.div`
  position: relative;
  min-height: ${props => props.height ? props.height : 500}px;
`
export default ComponentMinHeight
