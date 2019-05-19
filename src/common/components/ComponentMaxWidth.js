import styled from 'styled-components'

const ComponentMaxWidth = styled.div`
  position: relative;
  margin: ${props => props.margin ? props.margin : 'auto'};
  max-width: ${props => props.width ? props.width : 1120}px;
  height: max-content;
`
export default ComponentMaxWidth
