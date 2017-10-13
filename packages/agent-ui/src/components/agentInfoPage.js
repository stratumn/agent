import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const AgentInfoPage = ({ agentUrl }) => (
  <div>
    <p>
      An agent executes the logic of your processes. A process is defined by a
      set of actions that may be used in the workflow.<br />
      An instance of a process is called a map. It contains the different steps
      of the process, called segments.
    </p>
    <hr />
    <h2>Endpoint</h2>
    <p>
      <a href={agentUrl} target="_blank" rel="noopener noreferrer">
        {agentUrl}
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
