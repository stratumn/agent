import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Typography from 'material-ui/Typography';

import { getAgent, removeAgent } from '../actions';
import { AgentsManager, KeyManager, PrettyDivider } from '../components';
import * as statusTypes from '../constants/status';
import { uploadKey, deleteKey as deleteKeyAction } from '../actions/uploadKey';

export const AgentsPage = ({
  agents,
  userKey,
  fetchAgent,
  deleteAgent,
  addKey,
  deleteKey
}) => (
  <div>
    <div style={{ padding: '1em' }}>
      <Typography type="display1">Agents</Typography>
      <Typography paragraph>
        An agent executes the logic of your processes. A process is defined by a
        set of actions that may be used in the workflow. An instance of a
        process is called a map. It contains the different steps of the process,
        called segments.
      </Typography>
      {(!agents || agents.length === 0) && (
        <Typography>
          It looks like you are not connected to any agent right now. Enter a
          name and an url to connect to an agent. If you are running an agent
          locally, it will usually be on http://localhost:3000
        </Typography>
      )}
      {agents && (
        <AgentsManager
          agents={agents}
          addAgent={fetchAgent}
          deleteAgent={deleteAgent}
        />
      )}
    </div>
    <PrettyDivider />
    <div style={{ padding: '1em' }}>
      <Typography type="display1">Keys</Typography>
      <Typography paragraph>A key allows you to sign segments.</Typography>
      <KeyManager userKey={userKey} addKey={addKey} deleteKey={deleteKey} />
    </div>
  </div>
);

AgentsPage.defaultProps = {
  agents: [],
  userKey: null
};

AgentsPage.propTypes = {
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  userKey: PropTypes.shape({
    type: PropTypes.string,
    public: PropTypes.string,
    secret: PropTypes.instanceOf(Uint8Array)
  }),
  fetchAgent: PropTypes.func.isRequired,
  deleteAgent: PropTypes.func.isRequired,
  addKey: PropTypes.func.isRequired,
  deleteKey: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
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

  return {
    userKey: state.key,
    agents
  };
}

export default withRouter(
  connect(mapStateToProps, {
    fetchAgent: getAgent,
    deleteAgent: removeAgent,
    addKey: uploadKey,
    deleteKey: deleteKeyAction
  })(AgentsPage)
);
