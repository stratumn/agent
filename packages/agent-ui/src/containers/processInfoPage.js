import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const ProcessInfoPage = ({ process }) => <div>{process.name}</div>;

ProcessInfoPage.propTypes = {
  process: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export function mapStateToProps(state, ownProps) {
  const { match: { params: { agent, process } } } = ownProps;
  const selectedAgent = state.agents[agent];
  let selectedProcess;
  if (selectedAgent && selectedAgent.processes) {
    selectedProcess = selectedAgent.processes[process];
  }

  return {
    process: selectedProcess
  };
}

export default withRouter(connect(mapStateToProps)(ProcessInfoPage));
