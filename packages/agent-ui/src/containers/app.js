import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import layout from '../styles/layout';

import {
  TopBar,
  LeftNavigation,
  ContentPage,
  CreateMapDialog,
  AppendSegmentDialog,
  SelectRefsDialog
} from './';

export const App = ({ classes, location }) => (
  <div className={classes.appFrame}>
    <TopBar />
    <LeftNavigation />
    <ContentPage />
    <CreateMapDialog />
    <AppendSegmentDialog />
    <SelectRefsDialog location={location} />
  </div>
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
