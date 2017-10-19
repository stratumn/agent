import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import CodeIcon from 'material-ui-icons/Code';

import { withStyles } from 'material-ui/styles';
import AppStyle from '../style/app';

export const ProcessInfoPage = ({ process, style }) => (
  <div className={style.content}>
    {!process.name && <Typography type="display1">Loading...</Typography>}
    {process.name && (
      <div>
        <Typography type="headline" paragraph>
          {process.name}
        </Typography>
        <ActionsSection actions={process.processInfo.actions} />
        <Divider className={style.divider} />
        <StoreSection storeAdapter={process.storeInfo.adapter} />
        <Divider className={style.divider} />
        <FossilizersSection fossilizers={process.fossilizersInfo} />
      </div>
    )}
  </div>
);

export function mapStateToProps(state, ownProps) {
  const processName = ownProps.match.params.process;
  let process = {};
  if (state.agentInfo) {
    if (state.agentInfo.processes[processName]) {
      process = state.agentInfo.processes[processName];
    }
  }
  return {
    process: process,
    style: ownProps.classes
  };
}

ProcessInfoPage.defaultProps = {
  process: { name: '' },
  style: { content: '', divider: '' }
};
ProcessInfoPage.propTypes = {
  process: PropTypes.shape({
    name: PropTypes.string
  }),
  style: PropTypes.shape({
    content: PropTypes.string.isRequired,
    divider: PropTypes.string.isRequired
  })
};

export const StoreSection = ({ storeAdapter }) => (
  <div>
    <Typography type="title" paragraph>
      Store
    </Typography>
    <Typography paragraph>
      A store is responsible for saving your data. There are different adapters
      available depending on your needs.
    </Typography>
    <Typography type="subheading">Store adapter name</Typography>
    <Typography paragraph>{storeAdapter.name}</Typography>
    <Typography type="subheading">Store adapter version</Typography>
    <Typography paragraph>{storeAdapter.version}</Typography>
    <Typography type="subheading">Store adapter commit</Typography>
    <Typography paragraph>{storeAdapter.commit}</Typography>
    <Typography type="subheading">Store adapter description</Typography>
    <Typography paragraph>{storeAdapter.description}</Typography>
  </div>
);

StoreSection.propTypes = {
  storeAdapter: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
    commit: PropTypes.string,
    description: PropTypes.string
  }).isRequired
};

function formatActionSignature(action, args) {
  let signature = `${action}(`;
  for (let i = 0; args && i < args.length; i += 1) {
    signature += args[i];
    if (i < args.length - 1) {
      signature += ', ';
    }
  }
  signature += ')';
  return signature;
}

export const ActionsSection = ({ actions }) => (
  <div>
    <Typography type="title">Actions</Typography>
    <List>
      {Object.keys(actions).map(action => (
        <ListItem key={action}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText
            primary={formatActionSignature(action, actions[action].args)}
            style={{ fontStyle: 'italic' }}
          />
        </ListItem>
      ))}
    </List>
    <Typography paragraph>
      These are the procedures that define how segments are added to your maps.
    </Typography>
  </div>
);

ActionsSection.defaultProps = {
  actions: {}
};
ActionsSection.propTypes = {
  actions: PropTypes.objectOf(
    PropTypes.shape({
      args: PropTypes.arrayOf(PropTypes.string)
    })
  )
};

export const FossilizersSection = ({ fossilizers }) => (
  <div>
    <Typography type="title" paragraph>
      Fossilizer
    </Typography>
    <Typography paragraph>
      A fossilizer adds the steps of your workflow to a timeline, such as a
      Blockchain or a trusted timestamping authority.
    </Typography>
    {fossilizers.length === 0 && (
      <Typography paragraph>
        Your agent is not connected to fossilizers.
      </Typography>
    )}
    {fossilizers.length > 0 && (
      <List>
        {fossilizers.map(fossilizer => (
          <ListItem key={fossilizer.adapter.name}>
            <Typography type="subheading">
              Fossilizer: {fossilizer.adapter.name}
            </Typography>
            <Typography type="subheading">
              Adapter version: {fossilizer.adapter.version}
            </Typography>
            <Typography type="subheading">
              Adapter commit: {fossilizer.adapter.commit}
            </Typography>
            <Typography type="subheading">
              Adapter description: {fossilizer.adapter.description}
            </Typography>
            <Typography type="subheading">
              Adapter blockchain: {fossilizer.adapter.blockchain}
            </Typography>
          </ListItem>
        ))}
      </List>
    )}
  </div>
);

FossilizersSection.defaultProps = {
  fossilizers: []
};
FossilizersSection.propTypes = {
  fossilizers: PropTypes.arrayOf(
    PropTypes.shape({
      adapter: {
        name: PropTypes.string,
        version: PropTypes.string,
        commit: PropTypes.string,
        description: PropTypes.string,
        blockchain: PropTypes.string
      }
    })
  )
};

export default withStyles(AppStyle)(connect(mapStateToProps)(ProcessInfoPage));
