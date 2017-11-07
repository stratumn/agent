import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink, Route } from 'react-router-dom';

import { AppendSegmentButton, CreateMapButton } from '../components';

import { openCreateMapDialog } from '../actions';

const renderTopBarLinks = path => {
  const parts = path.split('/').filter(p => p);
  let currentLink = '';
  return parts.map(p => {
    currentLink += `/${p}`;
    return (
      <span key={p}>
        {' > '}
        <NavLink key={p} to={currentLink}>
          {p}
        </NavLink>
      </span>
    );
  });
};

export const TopBar = ({ path, mapDialog }) => {
  const style = {
    position: 'absolute',
    width: 'calc(100% - 240px)',
    height: '56px',
    marginLeft: '240px',
    borderStyle: 'solid'
  };

  if (!path || path === '/') {
    return <div style={style}>Welcome to the Indigo Framework UI</div>;
  }

  return (
    <div style={style}>
      {renderTopBarLinks(path)}
      <Route
        exact
        path="/:agent/:process/maps"
        render={props => (
          <CreateMapButton openDialog={mapDialog} {...props.match.params} />
        )}
      />
      <Route
        exact
        path="/:agent/:process/maps/:id"
        render={props => (
          <AppendSegmentButton
            openDialog={() => console.log('Append segment...')}
            {...props.match.params}
          />
        )}
      />
    </div>
  );
};

TopBar.propTypes = {
  path: PropTypes.string.isRequired,
  mapDialog: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  match: PropTypes.object.isRequired
  /* eslint-enable react/forbid-prop-types */
};

function mapStateToProps(state, ownProps) {
  return {
    path: ownProps.location.pathname
  };
}

export default withRouter(
  connect(mapStateToProps, { mapDialog: openCreateMapDialog })(TopBar)
);
