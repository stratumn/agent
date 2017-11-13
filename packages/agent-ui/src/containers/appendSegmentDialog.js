import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as statusTypes from '../constants/status';

import { closeAppendSegmentDialogAndClear } from '../actions';

export const AppendSegmentDialog = ({ show, error, closeDialog }) => {
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

  return (
    <div className="backdrop" style={backdropStyle}>
      <div className="modal" style={modalStyle}>
        <div>
          Append segment
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
          }}
        >
          <button type="submit">Append</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

AppendSegmentDialog.defaultProps = {
  error: ''
};
AppendSegmentDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  error: PropTypes.string,
  closeDialog: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
  const show = !!(
    state.appendSegment &&
    state.appendSegment.dialog &&
    state.appendSegment.dialog.show
  );

  if (
    show &&
    state.appendSegment.request &&
    state.appendSegment.request.error &&
    state.appendSegment.request.status === statusTypes.FAILED
  ) {
    return {
      show,
      error: state.appendSegment.request.error.toString()
    };
  }

  return {
    show
  };
}

export default connect(mapStateToProps, {
  closeDialog: closeAppendSegmentDialogAndClear
})(AppendSegmentDialog);
