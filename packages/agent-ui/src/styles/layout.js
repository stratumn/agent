const drawerWidth = 240;

export default theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  rootIcon: {
    color: 'white',
    margin: 0
  },
  appFrame: {
    position: 'absolute',
    display: 'flex',
    width: 'calc(100% - 8px)'
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawerPaper: {
    height: '100%',
    width: drawerWidth,
    backgroundColor: theme.palette.primary.dark,
    justifyContent: 'space-between'
  },
  content: {
    width: '100%',
    height: 'calc(100% - 56px)',
    marginTop: 56,
    marginLeft: drawerWidth - 10,
    padding: '1rem'
  },
  primary: {
    color: 'white'
  }
});
