import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import { parse, stringify } from '../utils/queryString';
import { getSegments } from '../actions';
import * as statusTypes from '../constants/status';
import { SegmentsFilter } from '../components';
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
    let segmentsResult;
    switch (status) {
      case statusTypes.LOADING:
        segmentsResult = <div>loading...</div>;
        break;
      case statusTypes.FAILED:
        segmentsResult = <div>{`failed to load: ${error}`}</div>;
        break;
      case statusTypes.LOADED:
        segmentsResult = (
          <div>
            process segments:
            {details.map(id => (
              <div key={id}>
                <NavLink to={`/${agent}/${process}/segments/${id}`}>
                  {id}
                </NavLink>
              </div>
            ))}
          </div>
        );
        break;
      default:
        segmentsResult = <div>process segments</div>;
        break;
    }
    const submitFilters = f => {
      const query = stringify(f);
      history.push(`${pathname}?${query}`);
    };
    return (
      <div>
        <SegmentsFilter filters={filters} submitHandler={submitFilters} />
        {segmentsResult}
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
    details: PropTypes.arrayOf(PropTypes.string)
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
