import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropzone from 'react-dropzone';

import { withStyles } from 'material-ui/styles';
import VpnKey from 'material-ui-icons/VpnKey';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import styles from '../styles/keyManager';

export class KeyManager extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onDrop(acceptedFiles) {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.props.addKey(reader.result);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsText(file);
    });
  }

  render() {
    const { userKey, classes, deleteKey } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <Dropzone
          onDrop={accepted => this.onDrop(accepted)}
          accept=".pem"
          multiple={false}
        >
          <Typography
            variant="subheading"
            align="center"
            style={{ padding: '1em' }}
          >
            Drag and drop your private key here. (PEM file)
          </Typography>
          {userKey && userKey.error && userKey.error.message ? (
            <Typography variant="subheading" align="center" color="error">
              {userKey.error.message}
            </Typography>
          ) : null}
        </Dropzone>
        {userKey && userKey.public ? (
          <Card className={classes.card}>
            <CardHeader
              avatar={<VpnKey className={classes.keyIcon} />}
              action={<Button onClick={deleteKey}>Remove</Button>}
              title={userKey.type.replace('PRIVATE', 'PUBLIC')}
            />
            <CardContent>
              <Typography component="p">{userKey.public}</Typography>
            </CardContent>
          </Card>
        ) : null}
      </div>
    );
  }
}

KeyManager.defaultProps = {
  userKey: null
};

KeyManager.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    keyIcon: PropTypes.string.isRequired
  }).isRequired,
  userKey: PropTypes.shape({
    type: PropTypes.string,
    public: PropTypes.string,
    pem: PropTypes.string,
    secret: PropTypes.instanceOf(Uint8Array)
  }),
  addKey: PropTypes.func.isRequired,
  deleteKey: PropTypes.func.isRequired
};
export default withStyles(styles)(KeyManager);
