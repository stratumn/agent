import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';
import AppStyle, { stylePropTypes, styleDefaultProps } from '../style/app';

export const AgentInfoPage = ({ agentUrl, style }) => (
  <div className={style.content}>
    <Typography paragraph>
      An agent executes the logic of your processes. A process is defined by a
      set of actions that may be used in the workflow.<br />
      An instance of a process is called a map. It contains the different steps
      of the process, called segments.
    </Typography>
    <Divider className={style.divider} />
    <Typography type="title" paragraph>
      Endpoint
    </Typography>
    <Typography paragraph>
      <a href={agentUrl} target="_blank" rel="noopener noreferrer">
        {agentUrl}
      </a>
    </Typography>
    <Typography paragraph>
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
    <Divider />
  </div>
);

function mapStateToProps(state, ownProps) {
  let agentUrl = '';
  if (state.agentInfo) {
    agentUrl = state.agentInfo.url;
  }
  return {
    agentUrl: agentUrl,
    style: ownProps.classes
  };
}

AgentInfoPage.defaultProps = {
  style: styleDefaultProps
};
AgentInfoPage.propTypes = {
  agentUrl: PropTypes.string.isRequired,
  style: stylePropTypes
};

export default withStyles(AppStyle)(connect(mapStateToProps)(AgentInfoPage));
