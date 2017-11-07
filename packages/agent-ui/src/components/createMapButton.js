import React from 'react';
import PropTypes from 'prop-types';

const CreateMapButton = ({ agent, process, openDialog }) => (
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

export default CreateMapButton;
