import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import TextField from 'material-ui/TextField';

export const ActionArgumentFields = ({ args, valueChanged }) =>
  args.map((arg, index) => (
    <TextField
      key={uuid()}
      label={arg}
      onChange={e => {
        valueChanged(index, e.target.value);
      }}
      type="text"
      fullWidth
    />
  ));

ActionArgumentFields.propTypes = {
  args: PropTypes.arrayOf(PropTypes.string).isRequired,
  valueChanged: PropTypes.func.isRequired
};

export default ActionArgumentFields;
