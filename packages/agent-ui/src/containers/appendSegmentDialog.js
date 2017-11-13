import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as statusTypes from '../constants/status';

import {
  selectAppendSegmentAction,
  closeAppendSegmentDialogAndClear
} from '../actions';

const buildActionInputs = args => {
  const argsValues = [];
  const actionInputs = [];
  for (let i = 0; i < args.length; i += 1) {
    argsValues.push(undefined);
    actionInputs.push(
      <input
        key={args[i]}
        placeholder={args[i]}
        ref={node => {
          argsValues[i] = node;
        }}
      />
    );
  }

  return { valueNodes: argsValues, actionInputs };
};

export const AppendSegmentDialog = ({
  show,
  actions,
  selectedAction,
  error,
  closeDialog,
  selectAction
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

  const { valueNodes, actionInputs } = buildActionInputs(
    actions[selectedAction].args
  );

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
            console.log(valueNodes.map(a => a.value.trim()));
          }}
        >
          <select
            value={selectedAction}
            onChange={e => selectAction(e.target.value)}
          >
            {Object.keys(actions).map(a => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <br />
          {actionInputs}
          <br />
          <button type="submit">Append</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

AppendSegmentDialog.defaultProps = {
  error: '',
  actions: {},
  selectedAction: ''
};
AppendSegmentDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  /* eslint-disable react/forbid-prop-types */
  actions: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
  selectedAction: PropTypes.string,
  error: PropTypes.string,
  closeDialog: PropTypes.func.isRequired,
  selectAction: PropTypes.func.isRequired
};

export function mapStateToProps({ appendSegment }) {
  const show = !!(
    appendSegment &&
    appendSegment.dialog &&
    appendSegment.dialog.show
  );

  if (!show) {
    return {
      show
    };
  }

  if (
    appendSegment.request &&
    appendSegment.request.error &&
    appendSegment.request.status === statusTypes.FAILED
  ) {
    return {
      show,
      error: appendSegment.request.error.toString()
    };
  }

  return {
    show,
    actions: appendSegment.dialog.actions,
    selectedAction: appendSegment.dialog.selectedAction
  };
}

export default connect(mapStateToProps, {
  selectAction: selectAppendSegmentAction,
  closeDialog: closeAppendSegmentDialogAndClear
})(AppendSegmentDialog);
