import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { openCreateMapDialog } from '../actions';

export const CreateMapButton = ({ agent, process, openDialog }) => (
  <div style={{ display: 'inline-block', position: 'absolute', right: 0 }}>
    <button
      onClick={e => {
        e.preventDefault();
        openDialog(agent, process);
      }}
    >
      Create
    </button>
  </div>
);

CreateMapButton.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  openDialog: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  const { match: { params: { agent, process } } } = ownProps;
  return {
    agent,
    process
  };
}

export default withRouter(
  connect(mapStateToProps, { openDialog: openCreateMapDialog })(CreateMapButton)
);
