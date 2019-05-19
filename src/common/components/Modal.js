import { Modal } from 'semantic-ui-react'
import styled from 'styled-components'
import { media } from 'common/styles/utils'

const CustomModal = styled(Modal)`
  width: 100% !important;
  max-width: 431px !important;
  color: #8d8d8d !important;

  .close {
    position: relative;
    display: inline-block;
    width: 20px !important;
    height: 20px !important;
    overflow: hidden;
  }
  .close:hover::before, .close:hover::after {
    background: #ebebeb !important;
  }
  .close::before, .close::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 100%;
    top: 50%;
    left: 0;
    margin-top: -1px;
    background: #fff;
  }
  .close::before {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .close::after {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .close::before, .close::after {
    height: 1px;
  }

`
export default CustomModal
