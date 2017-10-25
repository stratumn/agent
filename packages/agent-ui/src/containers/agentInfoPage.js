import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import { getAgent } from '../actions';

export const AgentInfoPage = ({ name, url, status, fetchAgent }) => (
  <div>
    <p>{name}</p>
    <p>{url}</p>
    {status !== 'LOADED' && (
      <div className="error">There was an issue loading your agent</div>
    )}
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
  status: PropTypes.string.isRequired,
  fetchAgent: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  const name = ownProps.match.params.agent;
  let url = '';
  let status = '';
  if (state.agents[name]) {
    ({ url, status } = state.agents[name]);
  }

  return {
    name,
    url,
    status
  };
}

export default withRouter(
  connect(mapStateToProps, { fetchAgent: getAgent })(AgentInfoPage)
);
