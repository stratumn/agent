import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ProcessInfoPage extends Component {
  static propTypes = {
    process: PropTypes.shape({
      name: PropTypes.string,
    }),
  };

  render() {
    const { process } = this.props;
    return (
      <div>
        {!process.name && <p>Loading...</p>}
        {process.name && (
          <div>
            <h1>{process.name}</h1>
            <ActionsSection actions={process.processInfo.actions} />
            <hr />
            <StoreSection storeAdapter={process.storeInfo.adapter} />
            <hr />
            <FossilizersSection fossilizers={process.fossilizersInfo} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ agents }, { match }) => {
  const { agent, process } = match.params;
  const { info } = agents[agent];
  let processInfo = {};
  if (info && info.processes) {
    processInfo = info.processes[process];
  }
  return { process: processInfo };
};

export const StoreSection = ({ storeAdapter }) => (
  <div>
    <h3>Store</h3>
    <p>
      <small>
        A store is responsible for saving your data. There are different
        adapters available depending on your needs.
      </small>
    </p>
    <h4>Store adapter name</h4>
    <samp>{storeAdapter.name}</samp>
    <h4>Store adapter version</h4>
    <samp>{storeAdapter.version}</samp>
    <h4>Store adapter commit</h4>
    <samp>{storeAdapter.commit}</samp>
    <h4>Store adapter description</h4>
    <samp>{storeAdapter.description}</samp>
  </div>
);

StoreSection.propTypes = {
  storeAdapter: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
    commit: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

function formatActionSignature(action, args) {
  let signature = `${action}(`;
  for (let i = 0; args && i < args.length; i += 1) {
    signature += args[i];
    if (i < args.length - 1) {
      signature += ", ";
    }
  }
  signature += ")";
  return signature;
}

export const ActionsSection = ({ actions }) => (
  <div>
    <h3>Actions</h3>
    <ul>
      {Object.keys(actions).map(action => (
        <li key={action}>
          <samp>{formatActionSignature(action, actions[action].args)}</samp>
        </li>
      ))}
    </ul>
    <p>
      <small>
        These are the procedures that define how segments are added to your
        maps.
      </small>
    </p>
  </div>
);

ActionsSection.defaultProps = {
  actions: {},
};
ActionsSection.propTypes = {
  actions: PropTypes.objectOf(
    PropTypes.shape({
      args: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

export const FossilizersSection = ({ fossilizers }) => (
  <div>
    <h3>Fossilizer</h3>
    <p>
      <small>
        A fossilizer adds the steps of your workflow to a timeline, such as a
        Blockchain or a trusted timestamping authority.
      </small>
    </p>
    {fossilizers.length === 0 && (
      <p>Your agent is not connected to fossilizers.</p>
    )}
    {fossilizers.length > 0 && (
      <ul>
        {fossilizers.map(fossilizer => (
          <li key={fossilizer.adapter.name}>
            <h4>
              Fossilizer:
              <samp>{fossilizer.adapter.name}</samp>
            </h4>
            <h4>
              Adapter version:
              <samp>{fossilizer.adapter.version}</samp>
            </h4>
            <h4>
              Adapter commit:
              <samp>{fossilizer.adapter.commit}</samp>
            </h4>
            <h4>
              Adapter description:
              <samp>{fossilizer.adapter.description}</samp>
            </h4>
            <h4>
              Adapter blockchain
              <samp>{fossilizer.adapter.blockchain}</samp>
            </h4>
          </li>
        ))}
      </ul>
    )}
  </div>
);

FossilizersSection.defaultProps = {
  fossilizers: [],
};
FossilizersSection.propTypes = {
  fossilizers: PropTypes.arrayOf(
    PropTypes.shape({
      adapter: {
        name: PropTypes.string,
        version: PropTypes.string,
        commit: PropTypes.string,
        description: PropTypes.string,
        blockchain: PropTypes.string,
      },
    }),
  ),
};

export default connect(mapStateToProps)(ProcessInfoPage);
