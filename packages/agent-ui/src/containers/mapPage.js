import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MapExplorer } from 'react-mapexplorer';

import { selectMapSegment } from '../actions';

export const MapPage = ({
  agent,
  process,
  mapId,
  lastLinkHash,
  selectSegment
}) => {
  if (!agent.url) {
    return (
      <div className="error">
        Invalid agent. Make sure the url is correct and the agent is loaded.
      </div>
    );
  }

  return (
    <div>
      <MapExplorer
        key={lastLinkHash}
        agentUrl={agent.url}
        process={process.name}
        mapId={mapId}
        onSelectSegment={segment => selectSegment(segment)}
      />
    </div>
  );
};

MapPage.defaultProps = {
  lastLinkHash: 'none'
};
MapPage.propTypes = {
  agent: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string
  }).isRequired,
  process: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  mapId: PropTypes.string.isRequired,
  lastLinkHash: PropTypes.string,
  selectSegment: PropTypes.func.isRequired
};

export function mapStateToProps(state, ownProps) {
  const { appendSegment: { request: { linkHash } } } = state;
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
    mapId,
    lastLinkHash: linkHash
  };
}

export default withRouter(
  connect(mapStateToProps, { selectSegment: selectMapSegment })(MapPage)
);
