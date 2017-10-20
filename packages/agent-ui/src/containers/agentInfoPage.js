import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

export const AgentInfoPage = ({ name, url }) => (
  <div>
    <p>{name}</p>
    <p>{url}</p>
    <NavLink to="/">Add a new agent</NavLink>
  </div>
);

AgentInfoPage.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
  console.log('AgentInfoPage state', state);
  console.log('AgentInfoPage ownProps', ownProps);
  const name = ownProps.match.params.agent;
  let url = '';
  if (state.agents[name]) {
    ({ url } = state.agents[name]);
  }

  return {
    name,
    url
  };
}

export default withRouter(connect(mapStateToProps)(AgentInfoPage));
