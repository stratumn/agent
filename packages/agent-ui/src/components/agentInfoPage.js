import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class AgentInfoPage extends Component {
  render() {
    return (
      <div>
        <p>
          An agent executes the logic of your processes. A process is defined by
          a set of actions that may be used in the workflow.<br />
          An instance of a process is called a map. It contains the different
          steps of the process, called segments.
        </p>
        <hr />
        <h2>Endpoint</h2>
        <p>
          <a
            href={this.props.agentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props.agentUrl}
          </a>
        </p>
        <p>
          <small>
            You can use this URL to connect to your agent, using the{' '}
            <a
              href="https://github.com/stratumn/indigo-js/tree/master/packages/agent-client-js"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stratumn Javascript Agent Client
            </a>{' '}
            for instance.
          </small>
        </p>
        <hr />
      </div>
    );
  }
}

function mapStateToProps(state) {
  let agentUrl = '';
  if (state.agentInfo) {
    agentUrl = state.agentInfo.url;
  }
  return { agentUrl };
}

AgentInfoPage.propTypes = {
  agentUrl: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(AgentInfoPage);
