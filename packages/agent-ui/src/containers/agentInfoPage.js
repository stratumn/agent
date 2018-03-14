import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import { PrettyDivider } from '../components';

import progressStyle from '../styles/progress';

import { getAgent } from '../actions';
import * as statusTypes from '../constants/status';

export const AgentInfoPage = ({ name, url, status, fetchAgent, classes }) => {
  if (status === statusTypes.LOADING) {
    return <CircularProgress className={classes.circular} />;
  }

  return (
    <div style={{ padding: '1em' }}>
      <Typography variant="display2" gutterBottom>
        Agent info
      </Typography>
      <Typography>
        An agent executes the logic of your processes. A process is defined by a
        set of actions that may be used in the workflow. An instance of a
        process is called a map. It contains the different steps of the process,
        called segments.
      </Typography>
      <PrettyDivider />
      <Typography variant="headline">Name</Typography>
      <Typography variant="subheading">{name}</Typography>
      <PrettyDivider />
      <Typography variant="headline">Endpoint</Typography>
      <Typography variant="subheading" component="a" href={url} paragraph>
        {url}
      </Typography>
      {status === statusTypes.FAILED && (
        <Typography variant="subheading" className="error" paragraph>
          There was an issue loading your agent
        </Typography>
      )}
      <Typography variant="caption" style={{ display: 'flex' }}>
        You can use this URL to connect to your agent, using the&nbsp;
        <Typography
          variant="caption"
          component="a"
          href="https://github.com/stratumn/js-indigocore/tree/master/packages/agent-client-js"
        >
          Stratumn Javascript Agent Client
        </Typography>
        &nbsp;for instance.
      </Typography>
      <PrettyDivider />
      <Button
        variant="raised"
        color="primary"
        onClick={() => {
          if (url) {
            fetchAgent(name, url);
          }
        }}
      >
        Refresh
      </Button>
      &nbsp;
      <Button variant="raised" color="primary" component={NavLink} to="/">
        Add a new agent
      </Button>
    </div>
  );
};

AgentInfoPage.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  fetchAgent: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    circular: PropTypes.string.isRequired
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  const name = ownProps.match.params.agent;
  let url = '';
  let status = '';
  if (state.agents[name]) {
    ({ url, status } = state.agents[name]);
  }

  return {
    name,
    url,
    status
  };
}

export default withStyles(progressStyle)(
  withRouter(connect(mapStateToProps, { fetchAgent: getAgent })(AgentInfoPage))
);
