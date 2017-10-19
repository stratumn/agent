/**
 * Contains some styles that are shared in the app.
 * Styles that are specific to a component should be kept inside the component itself.
 */

export const drawerWidth = 240;
export const appBarHeight = 64;

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
