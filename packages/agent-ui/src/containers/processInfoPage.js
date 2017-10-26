import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const formatAction = (name, args) => {
  let action = `${name}(`;
  const argsCount = (args || []).length;
  for (let i = 0; i < argsCount; i += 1) {
    action += args[i];
    if (i !== argsCount - 1) {
      action += ', ';
    }
  }
  action += ')';
  return action;
};

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
      <div>
        <h1>Agent name: {agent}</h1>
      </div>
      <div>
        <h2>Process name: {process.name}</h2>
      </div>
      <div>
        <h3>Actions</h3>
        <ul>
          {Object.keys(process.actions || []).map(a => (
            <li key={a}>{formatAction(a, process.actions[a].args)}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Store</h3>
        {process.store && (
          <p>
            {process.store.name}
            <br />
          </p>
        )}
        {process.store && (
          <p>
            {process.store.version}
            <br />
          </p>
        )}
        {process.store && (
          <p>
            {process.store.commit}
            <br />
          </p>
        )}
        {process.store && (
          <p>
            {process.store.description}
            <br />
          </p>
        )}
      </div>
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
