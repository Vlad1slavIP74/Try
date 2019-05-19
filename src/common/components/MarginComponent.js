import styled from 'styled-components'

const MarginComponent = styled.div`
  margin: ${props => props.margin ? props.margin : '10px'};
`
export default MarginComponent
