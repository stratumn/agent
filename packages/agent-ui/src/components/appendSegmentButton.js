import React from 'react';
import PropTypes from 'prop-types';

const AppendSegmentButton = ({ agent, process, id: mapId, openDialog }) => (
  <div style={{ display: 'inline-block', position: 'absolute', right: 0 }}>
    <button
      onClick={e => {
        e.preventDefault();
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
  id: PropTypes.string.isRequired,
  openDialog: PropTypes.func.isRequired
};

export default AppendSegmentButton;
