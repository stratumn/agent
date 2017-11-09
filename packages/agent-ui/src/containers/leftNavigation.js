import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import * as statusTypes from '../constants/status';

const LeftLink = ({ to, item }) => (
  <div>
    <NavLink to={to}>{item}</NavLink>
  </div>
);

LeftLink.propTypes = {
  to: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired
};

export const LeftNavigation = ({ agents }) => {
  const agentsList = agents.map(a => (
    <div key={a.name}>
      <LeftLink to={`/${a.name}`} item={a.name} />
      {a.processes.map(p => (
        <div key={p}>
          <LeftLink to={`/${a.name}/${p}`} item={p} />
          <LeftLink to={`/${a.name}/${p}/maps`} item="maps" />
          <LeftLink to={`/${a.name}/${p}/segments`} item="segments" />
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
    agents = Object.keys(state.agents)
      .filter(
        agentName =>
          state.agents[agentName].status &&
          state.agents[agentName].status === statusTypes.LOADED
      )
      .map(agentName => ({
        name: agentName,
        processes: Object.keys(state.agents[agentName].processes || [])
      }));
  }

  return {
    agents
  };
}

export default withRouter(connect(mapStateToProps)(LeftNavigation));
