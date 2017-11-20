import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import progressStyle from '../styles/progress';

import { getMapIds } from '../actions';
import * as statusTypes from '../constants/status';
import { MapsList } from '../components';

export class ProcessMapsPage extends Component {
  componentDidMount() {
    const { agent, process, fetchMapIds } = this.props;
    fetchMapIds(agent, process);
  }

  componentWillReceiveProps(nextProps) {
    const { agent, process, fetchMapIds } = nextProps;
    const { agent: thisAgent, process: thisProcess } = this.props;
    if (agent !== thisAgent || process !== thisProcess) {
      fetchMapIds(agent, process);
    }
  }

  render() {
    const {
      maps: { status, mapIds, error },
      agent,
      process,
      classes
    } = this.props;
    switch (status) {
      case statusTypes.FAILED:
        return (
          <Typography type="subheading">{`failed to load: ${error}`}</Typography>
        );
      case statusTypes.LOADED:
        return <MapsList agent={agent} process={process} mapIds={mapIds} />;
      default:
        return <CircularProgress className={classes.circular} />;
    }
  }
}

ProcessMapsPage.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  fetchMapIds: PropTypes.func.isRequired,
  maps: PropTypes.shape({
    status: PropTypes.string,
    error: PropTypes.string,
    mapIds: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  classes: PropTypes.shape({
    circular: PropTypes.string
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  const { match: { params: { agent, process } } } = ownProps;
  const { maps } = state;
  return { agent, process, maps };
}

export default withStyles(progressStyle)(
  withRouter(
    connect(mapStateToProps, { fetchMapIds: getMapIds })(ProcessMapsPage)
  )
);
