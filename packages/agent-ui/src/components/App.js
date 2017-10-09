import React, { Component } from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { AppBar, Drawer, MenuItem } from 'material-ui'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <AppBar title="Agent info" />
      </MuiThemeProvider>
    )
  }
}

export default App
