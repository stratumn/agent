import 'babel-polyfill';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeAllWebSockets } from '../utils/webSocketHelpers';
import { getAgent } from '../actions';
import * as statusTypes from '../constants/status';

/**
 * This component's sole purpose is to manage agents websockets upon mounting
 * and unmounting.
 * On mount, all agents will be stale (loaded from persisted user's preferences).
 * We want to fetch those stale agents (which will re-open a web socket with them).
 * On unmount, we want to close all the opened web sockets.
 */
export class WebSocketsManager extends Component {
  componentDidMount() {
    const { agents, fetchAgent } = this.props;

    agents
      .filter(({ status }) => status === statusTypes.STALE)
      .forEach(({ name, url }) => fetchAgent(name, url));
  }

  componentWillUnmount() {
    closeAllWebSockets();
  }

  render() {
    return null;
  }
}

WebSocketsManager.propTypes = {
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ).isRequired,
  fetchAgent: PropTypes.func.isRequired
};

export const mapStateToProps = state => {
  const agents = Object.keys(state.agents)
    .filter(
      a =>
        state.agents[a].status === statusTypes.LOADED ||
        state.agents[a].status === statusTypes.STALE ||
        state.agents[a].status === statusTypes.FAILED
    )
    .map(a => ({
      name: a,
      url: state.agents[a].url,
      status: state.agents[a].status
    }));

  return { agents };
};

export default connect(mapStateToProps, {
  fetchAgent: getAgent
})(WebSocketsManager);
