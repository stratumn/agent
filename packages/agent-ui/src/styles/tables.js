import { grey, red } from 'material-ui/colors';

export default theme => ({
  tableFilter: {
    padding: theme.spacing.unit,
    height: 80,
    backgroundColor: grey[200]
  },
  tableRowError: {
    color: red[500]
  }
});
