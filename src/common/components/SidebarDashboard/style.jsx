import {Sidebar} from 'semantic-ui-react'
import styled from 'styled-components'

export const StyledSidebar = styled(Sidebar)`

  .logo-container {
    background-color: ${props => props.theme.black};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    padding: 20px;
    text-align: center;
  
    img {
      filter: invert(1);
    }
  }
`
