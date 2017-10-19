import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getMapIds } from '../actions';

class MapsInfoPage extends Component {
  // static propTypes = {
  //   match: ReactRouterPropTypes.match.isRequired,
  //   dispatch: PropTypes.func.isRequired,
  // };
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { process } = match.params;
    dispatch(getMapIds('http://localhost:3000', process));
  }
  // componentWillReceiveProps(nextProps) {
  //   const { dispatch, match } = nextProps;
  //   if (this.props.match.params.agent !== match.params.agent)
  //     dispatch(getMapIds(match.params.agent));
  // }
  render() {
    const { maps } = this.props;
    if (!maps) return <div>loading...</div>;
    return <div>{maps.join('/')}</div>;
  }
}

const mapStateToProps = ({ maps }) => ({ maps });

export default withRouter(connect(mapStateToProps)(MapsInfoPage));
