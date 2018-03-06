import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import progressStyle from '../styles/progress';

import { getSegment } from '../actions';
import * as statusTypes from '../constants/status';

export class SegmentPage extends Component {
  componentDidMount() {
    const { agent, process, linkHash, getSegmentIfNeeded } = this.props;
    getSegmentIfNeeded(agent, process, linkHash);
  }

  componentWillReceiveProps(nextProps) {
    const { agent, process, linkHash, getSegmentIfNeeded } = nextProps;
    getSegmentIfNeeded(agent, process, linkHash);
  }

  render() {
    const { status, error, segment, classes } = this.props;
    if (status === statusTypes.LOADING) {
      return <CircularProgress className={classes.circular} />;
    }

    if (error) {
      return (
        <Typography type="subheading" className="error">
          {error}
        </Typography>
      );
    }

    if (!segment) {
      return (
        <Typography type="subheading" className="error">
          Could not find segment
        </Typography>
      );
    }

    const stateHash = () => {
      if (segment.link.meta.stateHash) {
        return (
          <div>
            <Typography type="headline">State hash</Typography>
            <Typography type="subheading" paragraph>
              {segment.link.meta.stateHash}
            </Typography>
          </div>
        );
      }
      return null;
    };
    return (
      <div style={{ padding: '1em' }}>
        <Typography type="headline">Link hash</Typography>
        <Typography type="subheading" paragraph>
          {segment.meta.linkHash}
        </Typography>
        <Typography type="headline">Map ID</Typography>
        <Typography type="subheading" paragraph>
          {segment.link.meta.mapId}
        </Typography>
        <Typography type="headline">Process</Typography>
        <Typography type="subheading" paragraph>
          {segment.link.meta.process}
        </Typography>
        {stateHash()}
        <Typography type="headline">Action</Typography>
        <Typography type="subheading" paragraph>
          {segment.link.meta.action}
        </Typography>
        <Typography type="headline">Raw JSON</Typography>
        <Typography type="body2">
          <pre>
            <code>{JSON.stringify(segment, null, 2)}</code>
          </pre>
        </Typography>
      </div>
    );
  }
}

SegmentPage.defaultProps = {
  status: '',
  error: '',
  segment: undefined
};

SegmentPage.propTypes = {
  getSegmentIfNeeded: PropTypes.func.isRequired,
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  linkHash: PropTypes.string.isRequired,
  status: PropTypes.string,
  error: PropTypes.string,
  segment: PropTypes.shape({
    meta: PropTypes.shape({
      linkHash: PropTypes.string.isRequired
    })
  }),
  classes: PropTypes.shape({
    circular: PropTypes.string.isRequired
  }).isRequired
};

export function mapStateToProps(state, ownProps) {
  const { match: { params: { agent, process, id: linkHash } } } = ownProps;
  const props = {
    agent,
    process,
    linkHash
  };

  if (!state.segment) {
    return props;
  }

  const { status, error, details } = state.segment;
  props.status = status;
  props.error = error;
  props.segment = details;
  return props;
}

export default withStyles(progressStyle)(
  withRouter(
    connect(mapStateToProps, { getSegmentIfNeeded: getSegment })(SegmentPage)
  )
);
