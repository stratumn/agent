import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

export const AgentInfoPage = ({ name, url, fetchAgent }) => (
  <div>
    <p>{name}</p>
    <p>{url}</p>
    <button
      onClick={e => {
        e.preventDefault();
        if (url) {
          fetchAgent(name, url);
        }
      }}
    >
      Refresh
    </button>
    <NavLink to="/">Add a new agent</NavLink>
  </div>
);

AgentInfoPage.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  fetchAgent: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
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
