import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import layout from '../styles/layout';

import {
  AgentInfoPage,
  AgentsPage,
  MapPage,
  ProcessInfoPage,
  ProcessMapsPage,
  ProcessSegmentsPage,
  SegmentPage
} from './';

export const ContentPage = ({ classes }) => (
  <div className={classes.content}>
    <Route exact path="/" component={AgentsPage} />
    <Route exact path="/:agent" component={AgentInfoPage} />
    <Route exact path="/:agent/:process" component={ProcessInfoPage} />
    <Route exact path="/:agent/:process/maps" component={ProcessMapsPage} />
    <Route
      exact
      path="/:agent/:process/segments"
      component={ProcessSegmentsPage}
    />
    <Route exact path="/:agent/:process/maps/:id" component={MapPage} />
    <Route exact path="/:agent/:process/segments/:id" component={SegmentPage} />
  </div>
);

ContentPage.propTypes = {
  classes: PropTypes.shape({
    content: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(layout)(withRouter(ContentPage));
