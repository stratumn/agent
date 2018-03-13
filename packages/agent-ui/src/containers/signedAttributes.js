import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Switch from 'material-ui/Switch';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

import { updateSignedAttributes } from '../actions';

const defaultAttributes = {
  inputs: true,
  prevLinkHash: true,
  action: true,
  refs: true
};
export class SignedAttributes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signed: false
    };
  }

  handleSwitch(value) {
    this.setState({ signed: value });
    if (value) {
      this.props.updateSignedAttributes(
        this.props.attributes || defaultAttributes
      );
    } else {
      this.props.updateSignedAttributes({});
    }
  }

  isKeySet() {
    return this.props.userKey != null && this.props.userKey.status !== 'FAILED';
  }

  render() {
    const { attributes } = this.props;
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
            {Object.keys(attributes).map(attr => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={attributes[attr]}
                    onChange={(event, value) =>
                      this.props.updateSignedAttributes({
                        ...attributes,
                        ...{ [attr]: value }
                      })}
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
  attributes: PropTypes.shape({
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
  attributes: defaultAttributes
};

function mapStateToProps(state, props) {
  return {
    attributes: {
      ...(props.attributes || defaultAttributes),
      ...state.signedAttributes
    }
  };
}

export default withStyles()(
  connect(mapStateToProps, {
    updateSignedAttributes
  })(SignedAttributes)
);
