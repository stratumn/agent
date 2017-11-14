import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as statusTypes from '../constants/status';

import {
  createMap as createMapAction,
  closeCreateMapDialogAndClear
} from '../actions';

export const CreateMapDialog = ({
  show,
  args,
  error,
  closeDialog,
  createMap
}) => {
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

  const initArgs = [...Array(args.length)];
  const initArgsWidgets = [...Array(args.length)];
  for (let i = 0; i < args.length; i += 1) {
    initArgsWidgets[i] = (
      <input
        key={args[i]}
        placeholder={args[i]}
        ref={node => {
          initArgs[i] = node;
        }}
      />
    );
  }

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
            createMap(...initArgs.map(arg => arg.value.trim()));
          }}
        >
          {initArgsWidgets}
          <button type="submit">Create</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

CreateMapDialog.defaultProps = {
  args: [],
  error: ''
};
CreateMapDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  args: PropTypes.arrayOf(PropTypes.string.isRequired),
  error: PropTypes.string,
  createMap: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired
};

export function mapStateToProps({ createMap }) {
  const show = !!(createMap && createMap.dialog && createMap.dialog.show);

  if (!show) return { show };

  if (
    createMap.request &&
    createMap.request.error &&
    createMap.request.status === statusTypes.FAILED
  ) {
    return {
      show,
      error: createMap.request.error.toString()
    };
  }

  return {
    show,
    args: createMap.dialog.args
  };
}

export default connect(mapStateToProps, {
  closeDialog: closeCreateMapDialogAndClear,
  createMap: createMapAction
})(CreateMapDialog);
