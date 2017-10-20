import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import { getAgent } from '../actions';

export const AgentsPage = ({ fetchAgent }) => {
  let agentName;
  let agentUrl;

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!agentName.value.trim() || !agentUrl.value.trim()) {
            return;
          }
          fetchAgent(agentName.value, agentUrl.value);
          agentName.value = '';
          agentUrl.value = '';
        }}
      >
        <input
          placeholder="Agent name"
          ref={node => {
            agentName = node;
          }}
        />
        <br />
        <input
          placeholder="Agent url"
          ref={node => {
            agentUrl = node;
          }}
        />
        <br />
        <button type="submit">Add Agent</button>
      </form>
      <NavLink to="/local">/local</NavLink>
      <br />
      <NavLink to="/local/goods">/local/goods</NavLink>
    </div>
  );
};

AgentsPage.propTypes = {
  fetchAgent: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  console.log('AgentsPage state', state);
  console.log('AgentsPage ownProps', ownProps);
  return {};
}

export default withRouter(
  connect(mapStateToProps, {
    fetchAgent: getAgent
  })(AgentsPage)
);
