import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink, Route } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import layout from '../styles/layout';

import { TopBarButton } from '../components';
import { openCreateMapDialog, openAppendSegmentDialog } from '../actions';
import { shortHash } from '../utils/hashUtils';

const renderTopBarLinks = path => {
  if (!path || path === '/') {
    return (
      <Typography variant="headline" noWrap>
        Welcome to the IndigoCore UI
      </Typography>
    );
  }

  const parts = path.split('/').filter(p => p);
  // shorten the segment linkHash in the topbar breadcrumbs display
  if (parts.length === 4 && parts[2] === 'segments') {
    parts[3] = shortHash(parts[3]);
  }
  let currentLink = '';

  // Note: typography automatically removes trailing whitespaces and requires
  // us to escape html tags, hence the use of &nbsp;&gt;&nbsp to render " > "
  return parts.map(p => {
    currentLink += `/${p}`;
    return (
      <div style={{ display: 'flex' }} key={p}>
        <Typography variant="headline" style={{ color: 'gray' }}>
          &nbsp;&gt;&nbsp;
        </Typography>
        <Typography
          variant="headline"
          component={NavLink}
          to={currentLink}
          style={{ textDecoration: 'none' }}
        >
          {p}
        </Typography>
      </div>
    );
  });
};

export const TopBar = ({ path, mapDialog, segmentDialog, classes }) => (
  <AppBar className={classes.appBar} color="default">
    <Toolbar>
      {renderTopBarLinks(path)}
      <Route
        exact
        path="/:agent/:process/maps"
        render={props => (
          <TopBarButton
            text="Create"
            openDialog={() =>
              mapDialog(props.match.params.agent, props.match.params.process)}
          />
        )}
      />
      <Route
        exact
        path="/:agent/:process/maps/:id"
        render={props => (
          <TopBarButton
            text="Append"
            openDialog={() =>
              segmentDialog(
                props.match.params.agent,
                props.match.params.process
              )}
          />
        )}
      />
    </Toolbar>
  </AppBar>
);

TopBar.propTypes = {
  path: PropTypes.string.isRequired,
  mapDialog: PropTypes.func.isRequired,
  segmentDialog: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  match: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    path: ownProps.location.pathname
  };
}

export default withStyles(layout)(
  withRouter(
    connect(mapStateToProps, {
      mapDialog: openCreateMapDialog,
      segmentDialog: openAppendSegmentDialog
    })(TopBar)
  )
);
