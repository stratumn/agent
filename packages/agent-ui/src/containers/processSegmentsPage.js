import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { parse, stringify } from '../utils/queryString';
import { getSegments } from '../actions';
import { SegmentsFilter, SegmentsList } from '../components';
import history from '../store/history';

export class ProcessSegmentsPage extends Component {
  componentDidMount() {
    const { agent, process, fetchSegments, filters } = this.props;
    fetchSegments(agent, process, filters);
  }

  componentWillReceiveProps(nextProps) {
    const { agent, process, fetchSegments, search, filters } = nextProps;
    const {
      agent: thisAgent,
      process: thisProcess,
      search: thisSearch
    } = this.props;
    if (
      agent !== thisAgent ||
      process !== thisProcess ||
      search !== thisSearch
    ) {
      fetchSegments(agent, process, filters);
    }
  }

  render() {
    const {
      segments: { status, details, error },
      agent,
      process,
      pathname,
      filters
    } = this.props;

    const submitFilters = f => {
      const query = stringify(f);
      history.push(`${pathname}?${query}`);
    };

    const segmentListProps = {
      agent,
      process,
      status,
      error,
      segments: details
    };

    return (
      <div>
        <SegmentsFilter filters={filters} submitHandler={submitFilters} />
        <SegmentsList {...segmentListProps} />
      </div>
    );
  }
}

ProcessSegmentsPage.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  fetchSegments: PropTypes.func.isRequired,
  segments: PropTypes.shape({
    status: PropTypes.string,
    error: PropTypes.string,
    details: PropTypes.arrayOf(
      PropTypes.shape({
        meta: PropTypes.shape({
          linkHash: PropTypes.string.isRequired
        })
      })
    )
  }).isRequired,
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  filters: PropTypes.object.isRequired
  /* eslint-enable react/forbid-prop-types */
};

function mapStateToProps(state, ownProps) {
  const {
    match: { params: { agent, process } },
    location: { pathname, search }
  } = ownProps;
  const { segments } = state;
  return { agent, process, segments, pathname, search, filters: parse(search) };
}

export default withRouter(
  connect(mapStateToProps, { fetchSegments: getSegments })(ProcessSegmentsPage)
);
