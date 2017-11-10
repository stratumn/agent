import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink, Route } from 'react-router-dom';
import * as statusTypes from '../constants/status';

const LeftLink = ({ to, item, margin }) => {
  const navLink = () => (
    <div>
      <NavLink to={to} style={{ marginLeft: margin }}>
        {item}
      </NavLink>
    </div>
  );
  const path = to
    .split('/')
    .slice(0, -1)
    .join('/');
  return <Route path={path} component={navLink} />;
};

LeftLink.propTypes = {
  to: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired,
  margin: PropTypes.string.isRequired
};

export const LeftNavigation = ({ agents }) => {
  const agentsList = agents.map(a => (
    <div key={a.name}>
      <LeftLink margin="0.5em" to={`/${a.name}`} item={a.name} />
      {a.processes.map(p => (
        <div key={p}>
          <LeftLink margin="1em" to={`/${a.name}/${p}`} item={p} />
          <LeftLink margin="1.5em" to={`/${a.name}/${p}/maps`} item="maps" />
          <LeftLink
            margin="1.5em"
            to={`/${a.name}/${p}/segments`}
            item="segments"
          />
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
