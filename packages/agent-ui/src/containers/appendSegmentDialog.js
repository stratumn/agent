import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';

import { ActionArgumentFields } from '../components';
import { RefChipList, SignedAttributes } from './';

import * as statusTypes from '../constants/status';

import {
  appendSegment as appendSegmentAction,
  closeAppendSegmentDialogAndClear,
  selectAppendSegmentAction
} from '../actions';

export const AppendSegmentDialog = ({
  show,
  actions,
  selectedAction,
  valid,
  error,
  appendSegment,
  closeDialog,
  selectAction,
  userKey
}) => {
  if (!show) {
    return null;
  }

  if (!valid) {
    return (
      <Dialog open={show} onClose={() => closeDialog()}>
        <DialogTitle>Append segment</DialogTitle>
        <DialogContent>
          <DialogContentText className="error">{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="default" onClick={() => closeDialog()}>
            Back
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const { args } = actions[selectedAction];
  const appendSegmentArgs = [...Array(args.length)];
  const appendSegmentArgsFields = (
    <ActionArgumentFields
      args={args}
      valueChanged={(index, value) => {
        appendSegmentArgs[index] = value;
      }}
    />
  );

  return (
    <Dialog open={show} onClose={() => closeDialog()}>
      <DialogTitle>Append segment</DialogTitle>
      <DialogContent>
        <Select
          value={selectedAction}
          onChange={e => selectAction(e.target.value)}
          displayEmpty
        >
          {Object.keys(actions).map(a => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </Select>
        {error && (
          <DialogContentText className="error">{error}</DialogContentText>
        )}
        {appendSegmentArgsFields}
        <RefChipList />
        <SignedAttributes userKey={userKey} />
      </DialogContent>
      <DialogActions>
        <Button color="default" onClick={() => closeDialog()}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            appendSegment(...appendSegmentArgs.map(arg => arg && arg.trim()));
          }}
        >
          Append
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AppendSegmentDialog.defaultProps = {
  error: '',
  valid: true,
  actions: {},
  selectedAction: '',
  userKey: null
};
AppendSegmentDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  /* eslint-disable react/forbid-prop-types */
  actions: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
  selectedAction: PropTypes.string,
  valid: PropTypes.bool,
  error: PropTypes.string,
  appendSegment: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  selectAction: PropTypes.func.isRequired,
  userKey: PropTypes.shape({
    type: PropTypes.string,
    public: PropTypes.string,
    pem: PropTypes.string,
    secret: PropTypes.instanceOf(Uint8Array)
  })
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

  if (appendSegment.dialog.error) {
    return {
      show,
      valid: false,
      error: appendSegment.dialog.error
    };
  }

  const { actions, selectedAction, key } = appendSegment.dialog;

  if (
    appendSegment.request &&
    appendSegment.request.error &&
    appendSegment.request.status === statusTypes.FAILED
  ) {
    return {
      show,
      actions,
      selectedAction,
      userKey: key,
      error: appendSegment.request.error.toString()
    };
  }

  return {
    show,
    actions,
    selectedAction,
    userKey: key
  };
}

export default connect(mapStateToProps, {
  appendSegment: appendSegmentAction,
  closeDialog: closeAppendSegmentDialogAndClear,
  selectAction: selectAppendSegmentAction
})(AppendSegmentDialog);
