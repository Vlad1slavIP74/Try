import {injectGlobal} from 'styled-components'

// NOTE: some styles are duplicated to make SSRed app looks better
injectGlobal`
  body {
    min-width: 320px;
	  background: #fff;  
    font-family: 'Proxima Nova', sans-serif;
    fons-size: 15px;
    font-style: normal;
    font-stretch: normal;
    line-height: normal !important;
    letter-spacing: normal;
	  color: rgba(0, 0, 0, 0.87);
    -webkit-font-smoothing: antialiased !important;
  }

  #app {
    margin-top: 0px !important;
    padding-top: 57px;    
    height: 100%;
    width: 100%;
  }
`
