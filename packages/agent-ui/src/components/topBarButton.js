import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Add from 'material-ui-icons/Add';

import buttonStyles from '../styles/buttons';

export const TopBarButton = ({ openDialog, text, classes }) => (
  <Button className={classes.topBarButton} onClick={() => openDialog()}>
    <Add style={{ color: 'gray' }} />
    {text}
  </Button>
);

TopBarButton.propTypes = {
  text: PropTypes.string.isRequired,
  openDialog: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    topBarButton: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(buttonStyles)(TopBarButton);
