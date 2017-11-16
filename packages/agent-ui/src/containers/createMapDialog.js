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

import { ActionArgumentFields } from '../components';

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

  const createMapArgs = [...Array(args.length)];
  const createMapArgsFields = (
    <ActionArgumentFields
      args={args}
      valueChanged={(index, value) => {
        createMapArgs[index] = value;
      }}
    />
  );

  return (
    <Dialog open={show} onRequestClose={() => closeDialog()}>
      <DialogTitle>Create map</DialogTitle>
      <DialogContent>
        {error && (
          <DialogContentText className="error">{error}</DialogContentText>
        )}
        {createMapArgsFields}
      </DialogContent>
      <DialogActions>
        <Button color="default" onClick={() => closeDialog()}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() =>
            createMap(...createMapArgs.map(arg => arg && arg.trim()))}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateMapDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  args: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  error: PropTypes.string.isRequired,
  createMap: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired
};

export function mapStateToProps({ createMap }) {
  let error = '';
  const show = !!(createMap && createMap.dialog && createMap.dialog.show);

  if (!show) return { show, error, args: [] };

  if (
    createMap.request &&
    createMap.request.error &&
    createMap.request.status === statusTypes.FAILED
  ) {
    error = createMap.request.error.toString();
  }

  return {
    show,
    error,
    args: createMap.dialog.args
  };
}

export default connect(mapStateToProps, {
  closeDialog: closeCreateMapDialogAndClear,
  createMap: createMapAction
})(CreateMapDialog);
