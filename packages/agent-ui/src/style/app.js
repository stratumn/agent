/**
 * Contains some styles that are shared in the app.
 * Styles that are specific to a component should be kept inside the component itself.
 */

import PropTypes from 'prop-types';

export const drawerWidth = 240;
export const appBarHeight = 64;

// It's handy to export default props here so that tests don't complain
export const styleDefaultProps = {
  appBar: '',
  leftDrawer: '',
  content: '',
  divider: ''
};

export const stylePropTypes = PropTypes.shape({
  appBar: PropTypes.string.isRequired,
  leftDrawer: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  divider: PropTypes.string.isRequired
});

export default theme => ({
  appBar: {
    position: 'absolute',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  leftDrawer: {
    width: drawerWidth
  },
  content: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    width: `calc(100% - ${drawerWidth}px)`,
    height: `calc(100% - ${appBarHeight}px)`,
    marginLeft: drawerWidth,
    marginTop: appBarHeight
  },
  divider: {
    marginBottom: theme.spacing.unit
  }
});
