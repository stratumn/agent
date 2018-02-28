import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Switch from 'material-ui/Switch';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

import { updateSignedAttributes } from '../actions';

export class SignedAttributes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signed: false,
      attributes: {
        inputs: true,
        action: true,
        refs: true,
        prevLinkHash: true
      }
    };
  }

  setSignedProperty(attr, value) {
    const attributes = { ...this.state.attributes, [attr]: value };
    this.setState({
      ...this.state,
      attributes
    });
    this.props.updateSignedAttributes(attributes);
  }

  handleSwitch(value) {
    this.setState({ signed: value, attributes: this.state.attributes });
    this.props.updateSignedAttributes(this.state.attributes);
  }

  isKeySet() {
    return this.props.userKey != null && this.props.userKey.status !== 'FAILED';
  }

  render() {
    const { allowedAttributes } = this.props;
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              disabled={!this.isKeySet()}
              checked={this.state.signed}
              onChange={(event, value) => this.handleSwitch(value)}
            />
          }
          label={
            this.isKeySet()
              ? 'Sign'
              : 'You must import a key before signing segments'
          }
        />
        {this.state.signed ? (
          <FormGroup row>
            {Object.keys(allowedAttributes)
              .filter(name => allowedAttributes[name])
              .map(attr => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.attributes[attr]}
                      onChange={(event, value) =>
                        this.setSignedProperty(attr, value)}
                    />
                  }
                  label={attr}
                  key={attr}
                />
              ))}
          </FormGroup>
        ) : null}
      </FormGroup>
    );
  }
}

SignedAttributes.propTypes = {
  updateSignedAttributes: PropTypes.func.isRequired,
  allowedAttributes: PropTypes.shape({
    inputs: PropTypes.bool,
    prevLinkHash: PropTypes.bool,
    action: PropTypes.bool,
    refs: PropTypes.bool
  }),
  userKey: PropTypes.shape({
    type: PropTypes.string,
    status: PropTypes.string,
    public: PropTypes.string,
    secret: PropTypes.instanceOf(Uint8Array)
  })
};

SignedAttributes.defaultProps = {
  userKey: null,
  allowedAttributes: {
    inputs: true,
    prevLinkHash: true,
    action: true,
    refs: true
  }
};

function mapStateToProps(state) {
  return state;
}

export default withStyles()(
  connect(mapStateToProps, {
    updateSignedAttributes
  })(SignedAttributes)
);
