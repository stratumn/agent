import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { parse, stringify } from '../utils/queryString';
import history from '../store/history';

export const SegmentsFilter = ({ pathname, search }) => {
  let { mapIds, tags, prevLinkHash } = parse(search);
  if (typeof mapIds !== 'object') {
    mapIds = undefined;
  }
  if (typeof tags !== 'object') {
    tags = undefined;
  }
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const query = stringify({ mapIds, tags, prevLinkHash });
        const newPath = `${pathname}?${query}`;
        history.push(newPath);
      }}
    >
      <input
        placeholder="Map IDs"
        defaultValue={mapIds && mapIds.join(' ')}
        onChange={e => {
          const tmp = e.target.value.trim();
          mapIds = tmp && tmp.split(' ');
        }}
      />
      <input
        placeholder="Prev link hash"
        defaultValue={prevLinkHash}
        onChange={e => {
          prevLinkHash = e.target.value.trim();
        }}
      />
      <input
        placeholder="Tags"
        defaultValue={tags && tags.join(' ')}
        onChange={e => {
          const tmp = e.target.value.trim();
          tags = tmp && tmp.split(' ');
        }}
      />
      <button type="submit">Filter</button>
      <button
        type="clear"
        onClick={e => {
          e.preventDefault();
          history.push(pathname);
        }}
      >
        Clear
      </button>
    </form>
  );
};

SegmentsFilter.propTypes = {
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired
};

function mapStateToProps(state, { location }) {
  return location;
}

export default withRouter(connect(mapStateToProps)(SegmentsFilter));
