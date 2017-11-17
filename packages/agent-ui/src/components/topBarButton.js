import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import TypoGraphy from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import buttonStyles from '../styles/buttons';

export const TopBarButton = ({ openDialog, text, classes }) => (
  <Button
    raised
    color="contrast"
    className={classes.topBarButton}
    onClick={e => {
      e.preventDefault();
      openDialog();
    }}
  >
    <TypoGraphy type="title">{text}</TypoGraphy>
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
