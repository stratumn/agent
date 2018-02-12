import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import layout from '../styles/layout';

import logo from '../images/logo.png';
import * as statusTypes from '../constants/status';

/* Material UI has a small isue for styling ListItemText so we need that workaround:
 * https://stackoverflow.com/questions/43975839/material-ui-next-styling-text-inside-listitemtext
 */
const WhiteListItemText = ({ text, margin }) => (
  <ListItemText
    disableTypography
    primary={
      <Typography type="subheading" style={{ color: 'white' }}>
        {text}
      </Typography>
    }
    style={{ marginLeft: margin }}
  />
);

WhiteListItemText.defaultProps = {
  margin: '0'
};
WhiteListItemText.propTypes = {
  text: PropTypes.string.isRequired,
  margin: PropTypes.string
};

const AgentNavigationLink = ({ text, to, margin }) => (
  <ListItem button component={NavLink} to={to}>
    <WhiteListItemText text={text} margin={margin} />
  </ListItem>
);

AgentNavigationLink.defaultProps = WhiteListItemText.defaultProps;
AgentNavigationLink.propTypes = {
  ...WhiteListItemText.propTypes,
  to: PropTypes.string.isRequired
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
      <Button component={NavLink} to="/" color="contrast">
        INDIGO AGENT UI
      </Button>
    </ListSubheader>
    {agents.map(a => (
      <div key={a.name} id={a.name}>
        <AgentNavigationLink text={a.name} to={`/${a.name}`} />
        <Collapse in={!!(agent && a.name === agent)}>
          <List disablePadding>
            {a.processes.map(p => (
              <div key={p}>
                <AgentNavigationLink
                  text={p}
                  to={`/${a.name}/${p}`}
                  margin="1em"
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
      <WhiteListItemText text="Documentation" />
    </ListItem>
    <ListItem
      button
      component="a"
      href="https://github.com/stratumn/js-indigocore/issues/new"
    >
      <WhiteListItemText text="Report issue" />
    </ListItem>
    <ListItem button>
      <WhiteListItemText text="©2017 Stratumn SAS" />
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
