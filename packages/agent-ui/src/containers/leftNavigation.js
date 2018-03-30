import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import List, {
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon
} from 'material-ui/List';
import ExpandMore from 'material-ui-icons/ExpandMore';
import { Assignment, Cloud } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';
import layout from '../styles/layout';

import logo from '../images/logo.png';
import * as statusTypes from '../constants/status';

let AgentNavigationLink = ({ text, to, classes, margin, icon, expandMore }) => {
  let lic;
  if (icon) {
    lic = <ListItemIcon>{icon}</ListItemIcon>;
  }
  return (
    <ListItem button component={NavLink} to={to} style={{ marginLeft: margin }}>
      {lic}
      <ListItemText primary={text} classes={{ primary: classes.primary }} />
      {expandMore && <ExpandMore classes={{ root: classes.rootIcon }} />}
    </ListItem>
  );
};

AgentNavigationLink.defaultProps = {
  icon: null,
  margin: '0',
  expandMore: false
};

AgentNavigationLink.propTypes = {
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    primary: PropTypes.string.isRequired
  }).isRequired,
  icon: PropTypes.element,
  margin: PropTypes.string,
  expandMore: PropTypes.bool
};

AgentNavigationLink = withStyles(layout)(AgentNavigationLink);

const AgentNavigationLinks = withStyles(
  layout
)(({ agents, agent, process, classes }) => (
  <List>
    <ListSubheader
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1em'
      }}
    >
      <Avatar alt="Icon" src={logo} />
      <Button component={NavLink} to="/" color="secondary">
        INDIGO AGENT UI
      </Button>
    </ListSubheader>
    {agents.map(a => (
      <div key={a.name} id={a.name}>
        <AgentNavigationLink
          text={a.name}
          to={`/${a.name}`}
          icon={<Cloud classes={{ root: classes.rootIcon }} />}
          expandMore={!agent || a.name !== agent}
        />
        <Collapse in={!!(agent && a.name === agent)}>
          <List disablePadding>
            {a.processes.map(p => (
              <div key={p}>
                <AgentNavigationLink
                  text={p}
                  to={`/${a.name}/${p}`}
                  icon={<Assignment classes={{ root: classes.rootIcon }} />}
                  expandMore={!process || p !== process}
                  margin="0.5em"
                />
                <Collapse in={!!(process && p === process)}>
                  <AgentNavigationLink
                    text="maps"
                    to={`/${a.name}/${p}/maps`}
                    margin="1.5em"
                  />
                  <AgentNavigationLink
                    text="segments"
                    to={`/${a.name}/${p}/segments`}
                    margin="1.5em"
                  />
                </Collapse>
              </div>
            ))}
          </List>
        </Collapse>
        <Divider />
      </div>
    ))}
  </List>
));

AgentNavigationLinks.defaultProps = {
  agent: '',
  process: ''
};

AgentNavigationLinks.propTypes = {
  agents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  agent: PropTypes.string,
  process: PropTypes.string
};

let IndigoExternalLinks = ({ classes }) => (
  <List>
    <ListItem button component="a" href="https://indigocore.com">
      <ListItemText
        primary="Documentation"
        classes={{ primary: classes.primary }}
      />
    </ListItem>
    <ListItem
      button
      component="a"
      href="https://github.com/stratumn/js-indigocore/issues/new"
    >
      <ListItemText
        primary="Report issue"
        classes={{ primary: classes.primary }}
      />
    </ListItem>
    <ListItem button>
      <ListItemText
        primary="©2017 Stratumn SAS"
        classes={{ primary: classes.primary }}
      />
    </ListItem>
  </List>
);

IndigoExternalLinks.propTypes = {
  classes: PropTypes.shape({
    primary: PropTypes.string.isRequired
  }).isRequired
};

IndigoExternalLinks = withStyles(layout)(IndigoExternalLinks);

export const LeftNavigation = ({ agents, agent, process, classes }) => {
  const agentsProps = { agents, agent, process };
  return (
    <Drawer
      variant="permanent"
      classes={{ paper: classes.drawerPaper }}
      anchor="left"
    >
      <AgentNavigationLinks {...agentsProps} />
      <IndigoExternalLinks />
    </Drawer>
  );
};

LeftNavigation.defaultProps = AgentNavigationLinks.defaultProps;
LeftNavigation.propTypes = {
  ...AgentNavigationLinks.propTypes,
  classes: PropTypes.shape({
    drawerPaper: PropTypes.string.isRequired
  }).isRequired
};

export function mapStateToProps(state, ownProps) {
  const { pathname } = ownProps.location;
  const pathParts = pathname.split('/');
  const agent = pathParts.length > 1 ? pathParts[1] : '';
  const process = pathParts.length > 2 ? pathParts[2] : '';

  let agents = [];
  if (state.agents) {
    agents = Object.keys(state.agents)
      .filter(
        agentName =>
          state.agents[agentName].status &&
          state.agents[agentName].status === statusTypes.LOADED
      )
      .map(agentName => ({
        name: agentName,
        processes: Object.keys(state.agents[agentName].processes || [])
      }));
  }

  return {
    agents,
    agent,
    process
  };
}

export default withStyles(layout)(
  withRouter(connect(mapStateToProps)(LeftNavigation))
);
