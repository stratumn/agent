import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import { removeRef, clearRefs, openSelectRefsDialog } from '../actions';

import { shortHash } from '../utils/hashUtils';

import styles from '../styles/refChipList';

export const RefChipList = ({
  refs,
  classes,
  openDialog,
  deleteRef,
  deleteAllRefs,
  withOpenButton
}) => (
  <div className={classes.row}>
    {refs && refs.length > 0 ? (
      refs.map(ref => {
        const { linkHash } = ref;
        return (
          <Chip
            label={shortHash(linkHash)}
            key={linkHash}
            className={classes.chip}
            onDelete={() => deleteRef(ref)}
          />
        );
      })
    ) : (
      <Typography className={classes.emptyText} variant="subheading">
        Add segments as refs...
      </Typography>
    )}
    {withOpenButton && (
      <IconButton onClick={() => openDialog()}>
        <AddIcon />
      </IconButton>
    )}
    <div className={classes.spacer} />
    <IconButton onClick={() => deleteAllRefs()}>
      <DeleteIcon />
    </IconButton>
  </div>
);

RefChipList.propTypes = {
  classes: PropTypes.shape({
    row: PropTypes.string.isRequired,
    chip: PropTypes.string.isRequired
  }).isRequired,
  deleteRef: PropTypes.func.isRequired,
  deleteAllRefs: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  withOpenButton: PropTypes.bool,
  /* eslint-disable react/forbid-prop-types */
  refs: PropTypes.array.isRequired
  /* eslint-enable react/forbid-prop-types */
};

RefChipList.defaultProps = {
  withOpenButton: true
};

function mapStateToProps(state) {
  const { selectRefs: { refs } } = state;
  return { refs };
}

export default withStyles(styles)(
  connect(mapStateToProps, {
    deleteRef: removeRef,
    deleteAllRefs: clearRefs,
    openDialog: openSelectRefsDialog
  })(RefChipList)
);
