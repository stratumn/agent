import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { createMuiTheme, withStyles } from 'material-ui/styles';
import { indigo } from 'material-ui/colors';
import layout from '../styles/layout';

import {
  TopBar,
  LeftNavigation,
  ContentPage,
  CreateMapDialog,
  AppendSegmentDialog,
  SelectRefsDialog,
  WebSocketsManager
} from './';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: {
      main: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: 'EuclidCircularB,Roboto,"Helvetica Neue",Arial,sans-serif'
  }
});

export const App = ({ classes, location }) => (
  <MuiThemeProvider theme={theme}>
    <div className={classes.appFrame}>
      <TopBar />
      <LeftNavigation />
      <ContentPage />
      <CreateMapDialog />
      <AppendSegmentDialog />
      <SelectRefsDialog location={location} />
      <WebSocketsManager />
    </div>
  </MuiThemeProvider>
);

App.propTypes = {
  classes: PropTypes.shape({
    appFrame: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(layout)(withRouter(App));
