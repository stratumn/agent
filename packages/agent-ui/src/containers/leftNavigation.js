import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

export const LeftNavigation = ({ agents }) => {
  const agentsList = agents.map(a => (
    <div>
      <NavLink key={a} to={`/${a}`}>
        {a}
      </NavLink>
    </div>
  ));

  return (
    <div
      style={{
        position: 'absolute',
        width: '240px',
        borderStyle: 'solid'
      }}
    >
      {agentsList}
    </div>
  );
};

LeftNavigation.propTypes = {
  agents: PropTypes.arrayOf(PropTypes.string).isRequired
};

function mapStateToProps(state, ownProps) {
  console.log('LeftNavigation state', state);
  console.log('LeftNavigation ownProps', ownProps);

  let agents = [];
  if (state.agents) {
    agents = Object.keys(state.agents);
  }

  return {
    agents
  };
}

export default withRouter(connect(mapStateToProps)(LeftNavigation));
