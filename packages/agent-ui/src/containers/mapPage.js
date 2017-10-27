import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MapExplorer } from 'react-mapexplorer';

export const MapPage = ({ agent, process, mapId }) => {
  if (!agent.url) {
    return (
      <div className="error">
        Invalid agent. Make sure the url is correct and the agent is loaded.
      </div>
    );
  }

  return (
    <div>
      <MapExplorer agentUrl={agent.url} process={process.name} mapId={mapId} />
    </div>
  );
};

MapPage.propTypes = {
  agent: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string
  }).isRequired,
  process: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  mapId: PropTypes.string.isRequired
};

export function mapStateToProps(state, ownProps) {
  const {
    match: { params: { agent: agentName, process: processName, id: mapId } }
  } = ownProps;
  const agent = {
    name: agentName
  };
  const process = {
    name: processName
  };

  const agentFromState = state.agents[agentName];
  if (agentFromState && agentFromState.url) {
    agent.url = agentFromState.url;
  }

  return {
    agent,
    process,
    mapId
  };
}

export default withRouter(connect(mapStateToProps)(MapPage));
