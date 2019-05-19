import React from 'react'
import { withRouter } from 'react-router-dom'

class RouteChangeHook extends React.Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (location !== prevProps.location) {
      this.props.onUpdate(location)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(RouteChangeHook)
