import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { NavLink, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Drawer from 'material-ui/Drawer';
import { MenuItem } from 'material-ui/Menu';

const ActiveMenuItem = ({ to, item }) => (
  <NavLink to={to} activeStyle={{ fontWeight: 'bold' }}>
    <MenuItem>{item}</MenuItem>
  </NavLink>
);

ActiveMenuItem.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  item: PropTypes.string.isRequired
};

const ActiveSubMenuItem = ({ match }) => (
  <div>
    <ActiveMenuItem item="maps" match={match} />
    <ActiveMenuItem item="segments" match={match} />
  </div>
);

ActiveSubMenuItem.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  }).isRequired
};

const DetailMenu = ({ processName, params }) => {
  console.log('render detailmenu');
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

const ProcessMenu = ({ name, info, params }) => {
  console.log('render processmenu');
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

const AgentMenu = ({ agent, params }) => {
  console.log('render agentmenu');
  const { name, info } = agent;
  return (
    <div>
      <ActiveMenuItem to={`/${name}`} item={name} />
      <ProcessMenu name={name} info={info} params={params} />
    </div>
  );
};

const LeftDrawer = ({ agents, params }) => {
  console.log('render leftdrawer');
  const menuItems = Object.keys(agents).map(name => (
    <AgentMenu key={name} agent={agents[name]} params={params} />
  ));

  return <Drawer type="permanent">{menuItems}</Drawer>;
};

LeftDrawer.propTypes = {
  processes: PropTypes.arrayOf(PropTypes.string).isRequired,
  match: ReactRouterPropTypes.match.isRequired
};

const mapStateToProps = ({ agents }, { match }) => {
  console.log('mapStateToProps', agents);
  const { params } = match;
  return { agents, params };
};

export default withRouter(connect(mapStateToProps)(LeftDrawer));
