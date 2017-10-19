import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Drawer from 'material-ui/Drawer';
import { MenuItem } from 'material-ui/Menu';

const ActiveMenuItem = ({ to, item }) => (
  <NavLink to={to} activeStyle={{ fontWeight: 'bold' }}>
    <MenuItem>{item}</MenuItem>
  </NavLink>
);

ActiveMenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired
};

const DetailMenu = ({ processName, params }) => {
  const { agent, process } = params;
  if (process === processName) {
    return (
      <div>
        <ActiveMenuItem to={`/${agent}/${process}/maps`} item="maps" />
        <ActiveMenuItem to={`/${agent}/${process}/segments`} item="segments" />
      </div>
    );
  }
  return null;
};

DetailMenu.propTypes = {
  processName: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
};

const ProcessMenu = ({ name, info, params }) => {
  const { agent } = params;
  if (info && agent === name) {
    const { processes } = info;
    return Object.keys(processes).map(p => (
      <div key={p}>
        <ActiveMenuItem to={`/${agent}/${p}`} item={p} />
        <DetailMenu processName={p} params={params} />
      </div>
    ));
  }
  return null;
};

ProcessMenu.propTypes = {
  name: PropTypes.string.isRequired,
  info: PropTypes.object,
  params: PropTypes.object.isRequired
};

const AgentMenu = ({ agent, params }) => {
  const { name, info } = agent;
  return (
    <div>
      <ActiveMenuItem to={`/${name}`} item={name} />
      <ProcessMenu name={name} info={info} params={params} />
    </div>
  );
};

AgentMenu.propTypes = {
  agent: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
};

const LeftDrawer = ({ agents, params }) => {
  const menuItems = Object.keys(agents).map(name => (
    <AgentMenu key={name} agent={agents[name]} params={params} />
  ));

  return <Drawer type="permanent">{menuItems}</Drawer>;
};

LeftDrawer.propTypes = {
  agents: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
};

const mapStateToProps = ({ agents }, { match }) => {
  const { params } = match;
  return { agents, params };
};

export default withRouter(connect(mapStateToProps)(LeftDrawer));
