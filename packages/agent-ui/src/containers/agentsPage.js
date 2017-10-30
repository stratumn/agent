import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getAgent } from '../actions';
import { statusTypes } from '../reducers';

const renderLoadedAgents = agents =>
  agents.map(a => <div key={a.name}>{`${a.name}: ${a.url}`}</div>);

export const AgentsPage = ({ agents, fetchAgent }) => {
  let agentName;
  let agentUrl;

  return (
    <div>
      {agents && renderLoadedAgents(agents)}
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
  fetchAgent: PropTypes.func.isRequired
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
    fetchAgent: getAgent
  })(AgentsPage)
);
