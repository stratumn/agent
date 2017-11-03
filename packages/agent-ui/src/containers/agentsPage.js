import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getAgent, removeAgent } from '../actions';
import { statusTypes } from '../reducers';

const RenderLoadedAgents = ({ agents, deleteAgent }) =>
  agents &&
  agents.map(({ name, url }) => (
    <div key={name}>
      {`${name}: ${url}`}{' '}
      <button
        onClick={e => {
          e.preventDefault();
          deleteAgent(name);
        }}
      >
        X
      </button>
    </div>
  ));

export const AgentsPage = ({ agents, fetchAgent, deleteAgent }) => {
  let agentName;
  let agentUrl;

  return (
    <div>
      <RenderLoadedAgents agents={agents} deleteAgent={deleteAgent} />
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!agentName.value.trim() || !agentUrl.value.trim()) {
            return;
          }
          fetchAgent(agentName.value, agentUrl.value);
          agentName.value = '';
          agentUrl.value = '';
        }}
      >
        <input
          placeholder="Agent name"
          ref={node => {
            agentName = node;
          }}
        />
        <br />
        <input
          placeholder="Agent url"
          ref={node => {
            agentUrl = node;
          }}
        />
        <br />
        <button type="submit">Add Agent</button>
      </form>
    </div>
  );
};

AgentsPage.defaultProps = {
  agents: []
};
AgentsPage.propTypes = {
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  fetchAgent: PropTypes.func.isRequired,
  deleteAgent: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
  const agents = Object.keys(state.agents || [])
    .filter(a => state.agents[a].status === statusTypes.LOADED)
    .map(a => ({
      name: a,
      url: state.agents[a].url
    }));

  return {
    agents
  };
}

export default withRouter(
  connect(mapStateToProps, {
    fetchAgent: getAgent,
    deleteAgent: removeAgent
  })(AgentsPage)
);
