import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getSegments } from '../actions';
import { statusTypes } from '../reducers';

export class ProcessSegmentsPage extends Component {
  componentDidMount() {
    const { agent, process, fetchSegments } = this.props;
    fetchSegments(agent, process);
  }

  render() {
    const { segments: { status, segments: details, error } } = this.props;
    switch (status) {
      case statusTypes.LOADING:
        return <div>loading...</div>;
      case statusTypes.FAILED:
        return <div>{`failed to load: ${error}`}</div>;
      case statusTypes.LOADED:
        return (
          <div>
            process segments:
            {details.map(id => <div key={id}>{id}</div>)}
          </div>
        );
      default:
        return <div>process segments</div>;
    }
  }
}

ProcessSegmentsPage.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  fetchSegments: PropTypes.func.isRequired,
  segments: PropTypes.shape({
    status: PropTypes.string,
    error: PropTypes.string,
    details: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  console.log('ProcessSegmentsPage state', state);
  console.log('ProcessSegmentsPage ownProps', ownProps);
  const { match: { params: { agent, process } } } = ownProps;
  const { segments } = state;
  return { agent, process, segments };
}

export default withRouter(
  connect(mapStateToProps, { fetchSegments: getSegments })(ProcessSegmentsPage)
);
