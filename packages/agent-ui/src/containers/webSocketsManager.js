import 'babel-polyfill';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openWebSocket, closeAllWebSockets } from '../utils/webSocketHelpers';
import * as statusTypes from '../constants/status';

// this component's sole purpose is to manage websockets
// upon mounting and unmounting. On mount, we want to
// re open ws with all exisiting agents in our state.
// On unmount, we want to close all the opened ws.
export class WebSocketsManager extends Component {
  componentDidMount() {
    const { webSocketUrls, dispatch } = this.props;
    webSocketUrls.forEach(({ name, url }) =>
      openWebSocket(name, url, dispatch)
    );
  }

  componentWillUnmount() {
    closeAllWebSockets();
  }

  render() {
    return null;
  }
}

WebSocketsManager.propTypes = {
  webSocketUrls: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  dispatch: PropTypes.func.isRequired
};

export const mapStateToProps = state => {
  const { agents = {} } = state;
  const webSocketUrls = Object.values(agents)
    .filter(({ status }) => status === statusTypes.LOADED)
    .map(({ name, url }) => ({ name, url }));
  return { webSocketUrls };
};

export default connect(mapStateToProps)(WebSocketsManager);
