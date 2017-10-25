import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

export const LeftNavigation = ({ agents }) => {
  const agentsList = agents.map(a => (
    <div>
      <NavLink key={a.name} to={`/${a.name}`}>
        {a.name}
      </NavLink>
      {a.processes.map(p => (
        <div>
          <NavLink key={p} to={`/${a.name}/${p}`}>
            {p}
          </NavLink>
        </div>
      ))}
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
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

export function mapStateToProps(state) {
  let agents = [];
  if (state.agents) {
    agents = Object.keys(state.agents).map(agentName => ({
      name: agentName,
      processes: state.agents[agentName].processes
        ? Object.keys(state.agents[agentName].processes)
        : []
    }));
  }

  return {
    agents
  };
}

export default withRouter(connect(mapStateToProps)(LeftNavigation));
