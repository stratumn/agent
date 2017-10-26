import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const ProcessInfoPage = ({ agent, process }) => {
  if (!process) {
    return (
      <div className="error">
        This process does not exist. Try reloading the agent.
      </div>
    );
  }

  return (
    <div>
      <div>Agent name: {agent}</div>
      <div>Process name: {process.name}</div>
    </div>
  );
};

ProcessInfoPage.defaultProps = {
  process: null
};
ProcessInfoPage.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};

export function mapStateToProps(state, ownProps) {
  const { match: { params: { agent, process } } } = ownProps;
  const selectedAgent = state.agents[agent];
  let selectedProcess;
  if (selectedAgent && selectedAgent.processes) {
    selectedProcess = selectedAgent.processes[process];
  }

  return {
    agent,
    process: selectedProcess
  };
}

export default withRouter(connect(mapStateToProps)(ProcessInfoPage));
