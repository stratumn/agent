import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';

export const AgentInfoPage = ({ agentUrl }) => (
  <div>
    <Typography paragraph>
      An agent executes the logic of your processes. A process is defined by a
      set of actions that may be used in the workflow.<br />
      An instance of a process is called a map. It contains the different steps
      of the process, called segments.
    </Typography>
    <Divider />
    <Typography type="title">Endpoint</Typography>
    <Typography paragraph>
      <a href={agentUrl} target="_blank" rel="noopener noreferrer">
        {agentUrl}
      </a>
    </Typography>
    <Typography paragraph>
      <Typography>
        You can use this URL to connect to your agent, using the{' '}
        <a
          href="https://github.com/stratumn/indigo-js/tree/master/packages/agent-client-js"
          target="_blank"
          rel="noopener noreferrer"
        >
          Stratumn Javascript Agent Client
        </a>{' '}
        for instance.
      </Typography>
    </Typography>
    <Divider />
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
