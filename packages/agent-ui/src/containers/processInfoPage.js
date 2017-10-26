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

const renderStore = store => (
  <div>
    <p>{store.name}</p>
    <br />
    <p>{store.version}</p>
    <br />
    <p>{store.commit}</p>
    <br />
    <p>{store.description}</p>
    <br />
  </div>
);

const renderFossilizer = fossilizer => (
  <div>
    <p>{fossilizer.name}</p>
    <br />
    <p>{fossilizer.version}</p>
    <br />
    <p>{fossilizer.commit}</p>
    <br />
    <p>{fossilizer.description}</p>
    <br />
    <p>{fossilizer.blockchain}</p>
    <br />
  </div>
);

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
        {process.store && renderStore(process.store)}
      </div>
      <div>
        <h3>Fossilizers</h3>
        {process.fossilizers.map(f => renderFossilizer(f))}
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
