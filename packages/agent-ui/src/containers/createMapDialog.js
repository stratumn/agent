import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as statusTypes from '../constants/status';

// import {
//   createMap as createMapAction,
//   closeCreateMapDialogAndClear
// } from '../actions/createMap';

export const CreateMapDialog = ({ show, error, closeDialog, createMap }) => {
  if (!show) {
    return null;
  }

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 50
  };

  const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: 5,
    maxWidth: 500,
    minHeight: 300,
    margin: '0 auto',
    padding: 30
  };

  let mapTitle;

  return (
    <div className="backdrop" style={backdropStyle}>
      <div className="modal" style={modalStyle}>
        <div>
          Create map
          <button
            onClick={e => {
              e.preventDefault();
              closeDialog();
            }}
          >
            X
          </button>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!mapTitle.value.trim()) {
              return;
            }
            createMap(mapTitle.value.trim());
          }}
        >
          <input
            placeholder="title"
            ref={node => {
              mapTitle = node;
            }}
          />
          <button type="submit">Create</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

CreateMapDialog.defaultProps = {
  error: ''
};
CreateMapDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  error: PropTypes.string,
  createMap: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
  const show = !!(
    state.createMap &&
    state.createMap.dialog &&
    state.createMap.dialog.show
  );

  if (
    show &&
    state.createMap.request &&
    state.createMap.request.error &&
    state.createMap.request.status === statusTypes.FAILED
  ) {
    return {
      show,
      error: state.createMap.request.error.toString()
    };
  }

  return {
    show
  };
}

export default connect(mapStateToProps, {
  closeDialog: () => {},
  createMap: () => {}
})(CreateMapDialog);
