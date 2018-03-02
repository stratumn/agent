import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropzone from 'react-dropzone';

import { withStyles } from 'material-ui/styles';
import VpnKey from 'material-ui-icons/VpnKey';
import Card, { CardHeader } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import styles from '../styles/keyManager';

class KeyManager extends Component {
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
    const { userKey, classes } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <Dropzone
          onDrop={accepted => this.onDrop(accepted)}
          accept="application/json"
          multiple={false}
        >
          <Typography variant="subheading" align="center">
            Drag and drop you key file here (json file)
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
              action={<Button onClick={this.props.deleteKey}>Remove</Button>}
              title={userKey.public}
              subheader={`${userKey.type} public key`}
            />
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
  userKey: PropTypes.shape({
    type: PropTypes.string,
    public: PropTypes.string,
    secret: PropTypes.instanceOf(Uint8Array)
  }),
  addKey: PropTypes.func.isRequired,
  deleteKey: PropTypes.func.isRequired
};
export default withStyles(styles)(KeyManager);
