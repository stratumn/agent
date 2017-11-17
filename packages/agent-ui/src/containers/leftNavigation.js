import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import layout from '../styles/layout';

import logo from '../images/logo.png';
import * as statusTypes from '../constants/status';

const AgentNavigationLink = ({ text, to, margin }) => (
  <ListItem button component={NavLink} to={to}>
    <ListItemText primary={text} style={{ marginLeft: margin }} />
  </ListItem>
);

AgentNavigationLink.defaultProps = {
  margin: '0'
};
AgentNavigationLink.propTypes = {
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  margin: PropTypes.string
};

const AgentNavigationLinks = ({ agents, agent, process }) => (
  <List>
    <ListSubheader
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1em'
      }}
    >
      <Avatar alt="Icon" src={logo} />
      <Button component={NavLink} to="/">
        INDIGO AGENT UI
      </Button>
    </ListSubheader>
    {agents.map(a => (
      <div key={a.name} id={a.name}>
        <AgentNavigationLink text={a.name} to={`/${a.name}`} />
        <Collapse
          in={!!(agent && a.name === agent)}
          transitionDuration="auto"
          unmountOnExit
        >
          <List disablePadding>
            {a.processes.map(p => (
              <div key={p}>
                <AgentNavigationLink
                  text={p}
                  to={`/${a.name}/${p}`}
                  margin="1em"
                />
                <Collapse
                  in={!!(process && p === process)}
                  transitionDuration="auto"
                  unmountOnExit
                >
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
      </div>
    ))}
  </List>
);

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

const IndigoExternalLinks = () => (
  <List
    style={{
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <ListItem
      style={{
        marginTop: 'auto'
      }}
      button
      component="a"
      href="https://indigoframework.com"
    >
      <ListItemText primary="Documentation" />
    </ListItem>
    <ListItem
      button
      component="a"
      href="https://github.com/stratumn/agent-ui/issues/new"
    >
      <ListItemText primary="Report issue" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="©2017 Stratumn SAS" />
    </ListItem>
  </List>
);

export const LeftNavigation = ({ agents, agent, process, classes }) => {
  const agentsProps = { agents, agent, process };
  return (
    <Drawer
      type="permanent"
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
