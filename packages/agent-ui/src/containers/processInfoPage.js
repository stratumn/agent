import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Typography from 'material-ui/Typography';
import { PrettyDivider } from '../components';

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
    <Typography variant="subheading">
      Store adapter name: {store.name}
    </Typography>
    <Typography variant="subheading">
      Store adapter version: {store.version}
    </Typography>
    <Typography variant="subheading">
      Store adapter commit: {store.commit}
    </Typography>
    <Typography variant="subheading">
      Store adapter description: {store.description}
    </Typography>
  </div>
);

const renderFossilizer = fossilizer => (
  <div key={fossilizer.name}>
    <Typography variant="subheading">
      Fossilizer name: {fossilizer.name}
    </Typography>
    <Typography variant="subheading">
      Fossilizer version: {fossilizer.version}
    </Typography>
    <Typography variant="subheading">
      Fossilizer commit: {fossilizer.commit}
    </Typography>
    <Typography variant="subheading">
      Fossilizer description: {fossilizer.description}
    </Typography>
    {fossilizer.blockchain && (
      <Typography variant="subheading">
        Fossilizer blockchain: {fossilizer.blockchain}
      </Typography>
    )}
    <PrettyDivider />
  </div>
);

export const ProcessInfoPage = ({ agent, process }) => {
  if (!process) {
    return (
      <Typography variant="subheading" className="error">
        This process does not exist. Try reloading the agent.
      </Typography>
    );
  }

  return (
    <div style={{ padding: '1em' }}>
      <Typography variant="display1" paragraph>
        {process.name}
      </Typography>
      <Typography variant="headline">Agent</Typography>
      <Typography variant="subheading">{agent}</Typography>
      <PrettyDivider />
      <Typography variant="headline">Actions</Typography>
      <Typography variant="caption">
        These are the procedures that define how segments are added to your
        maps.
      </Typography>
      <ul>
        {Object.keys(process.actions || []).map(a => (
          <li key={a}>
            <Typography variant="subheading">
              {formatAction(a, process.actions[a].args)}
            </Typography>
          </li>
        ))}
      </ul>
      <PrettyDivider />
      <Typography variant="headline">Store</Typography>
      <Typography variant="caption" paragraph>
        A store is responsible for saving your data. There are different
        adapters available depending on your needs.
      </Typography>
      {process.store && renderStore(process.store)}
      {!process.store && (
        <Typography>Your agent is not connected to a store.</Typography>
      )}
      <PrettyDivider />
      <Typography variant="headline">Fossilizers</Typography>
      <Typography variant="caption" paragraph>
        A fossilizer adds the steps of your workflow to a timeline, such as a
        Blockchain or a trusted timestamping authority.
      </Typography>
      {process.fossilizers && process.fossilizers.map(f => renderFossilizer(f))}
      {(!process.fossilizers || process.fossilizers.length === 0) && (
        <Typography>Your agent is not connected to a fossilizer.</Typography>
      )}
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
