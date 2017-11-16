import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';

export const ActionArgumentFields = ({ args, valueChanged }) => {
  const valueFields = [...Array(args.length)];

  for (let i = 0; i < args.length; i += 1) {
    const argName = args[i];
    valueFields[i] = (
      <TextField
        key={argName}
        label={argName}
        onChange={e => {
          valueChanged(i, e.target.value);
        }}
        type="text"
        fullWidth
      />
    );
  }

  return valueFields;
};

ActionArgumentFields.propTypes = {
  args: PropTypes.arrayOf(PropTypes.string).isRequired,
  valueChanged: PropTypes.func.isRequired
};

export default ActionArgumentFields;
