import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MapExplorer } from '@indigoframework/react-mapexplorer';
import { v4 as uuid } from 'uuid';

import { selectMapSegment, removeNotifications } from '../actions';

export class MapPage extends Component {
  shouldComponentUpdate(nextProps) {
    const { notifications } = nextProps;
    return notifications.length > 0;
  }

  componentDidUpdate() {
    const { notifications, removeSegmentNotifications } = this.props;
    removeSegmentNotifications(notifications.map(({ key }) => key));
  }

  render() {
    const { agent, process, mapId, selectSegment } = this.props;
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
          key={uuid()}
          agentUrl={agent.url}
          process={process.name}
          mapId={mapId}
          onSelectSegment={segment => selectSegment(segment)}
        />
      </div>
    );
  }
}

MapPage.propTypes = {
  agent: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string
  }).isRequired,
  process: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  mapId: PropTypes.string.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape(PropTypes.string.isRequired))
    .isRequired,
  selectSegment: PropTypes.func.isRequired,
  removeSegmentNotifications: PropTypes.func.isRequired
};

export function mapStateToProps(state, ownProps) {
  const { notifications } = state;
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
    notifications: notifications.filter(({ mapId: id }) => id === mapId)
  };
}

export default withRouter(
  connect(mapStateToProps, {
    selectSegment: selectMapSegment,
    removeSegmentNotifications: removeNotifications
  })(MapPage)
);
