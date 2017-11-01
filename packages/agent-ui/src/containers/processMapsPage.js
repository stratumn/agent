import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getMapIds } from '../actions';
import { statusTypes } from '../reducers';

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
    const { maps: { status, mapIds, error } } = this.props;
    switch (status) {
      case statusTypes.LOADING:
        return <div>loading...</div>;
      case statusTypes.FAILED:
        return <div>{`failed to load: ${error}`}</div>;
      case statusTypes.LOADED:
        return (
          <div>
            process maps:
            {mapIds.map(id => <div key={id}>{id}</div>)}
          </div>
        );
      default:
        return <div>process maps</div>;
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
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  console.log('ProcessMapsPage state', state);
  console.log('ProcessMapsPage ownProps', ownProps);
  const { match: { params: { agent, process } } } = ownProps;
  const { maps } = state;
  return { agent, process, maps };
}

export default withRouter(
  connect(mapStateToProps, { fetchMapIds: getMapIds })(ProcessMapsPage)
);
