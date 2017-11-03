import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const AppendSegmentButton = ({ agent, process, mapId, openDialog }) => (
  <div style={{ display: 'inline-block', position: 'absolute', right: 0 }}>
    <button
      onClick={e => {
        e.preventDefault();
        console.log('clicked!');
        openDialog(agent, process, mapId);
      }}
    >
      Append
    </button>
  </div>
);

AppendSegmentButton.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  mapId: PropTypes.string.isRequired,
  openDialog: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  const { match: { params: { agent, process, id } } } = ownProps;
  return {
    agent,
    process,
    mapId: id
  };
}

export default withRouter(connect(mapStateToProps)(AppendSegmentButton));
