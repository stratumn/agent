import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import { getSegments, closeSelectRefsDialog, addRef } from '../actions';
import { SegmentsFilter, SegmentsList } from '../components';
import { RefChipList } from './';
import { parseAgentAndProcess } from '../utils/queryString';

export class SelectRefsDialog extends Component {
  constructor(props) {
    super(props);
    this.submitFilters = this.submitFilters.bind(this);
    this.addSegmentAsRef = this.addSegmentAsRef.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Get all the segments if we are opening the dialog
    if (this.props.show === false && nextProps.show === true) {
      this.submitFilters({ process: nextProps.process });
    }
  }

  submitFilters(filters) {
    const { agent, fetchSegments } = this.props;
    // Fetch all available segments
    const process =
      filters.process != null ? filters.process : this.props.process;
    fetchSegments(agent, process, filters);
  }

  addSegmentAsRef(segment) {
    this.props.appendRef({
      process: segment.link.meta.process,
      linkHash: segment.meta.linkHash,
      mapId: segment.link.meta.mapId,
      segment: { link: segment.link, meta: segment.meta }
    });
  }

  render() {
    const {
      segments: { status, details, error },
      agent,
      process,
      processes,
      closeDialog,
      show
    } = this.props;

    if (!show) {
      return null;
    }

    const segmentListProps = {
      agent,
      process,
      status,
      error,
      segments: details,
      handleClick: this.addSegmentAsRef
    };

    return (
      <Dialog maxWidth="md" open={show} onClose={() => closeDialog()}>
        <DialogTitle>Select refs</DialogTitle>
        <DialogContent>
          <RefChipList withOpenButton={false} />
          <SegmentsFilter
            submitHandler={this.submitFilters}
            withProcesses
            processes={processes}
            currentProcess={process}
          />
          <SegmentsList {...segmentListProps} />
        </DialogContent>
        <DialogActions>
          <Button color="default" onClick={() => closeDialog()}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SelectRefsDialog.propTypes = {
  agent: PropTypes.string,
  process: PropTypes.string,
  processes: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchSegments: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  appendRef: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
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
  }).isRequired
};

SelectRefsDialog.defaultProps = {
  agent: '',
  process: ''
};

function mapStateToProps(state, ownProps) {
  const { location: { pathname } } = ownProps;
  const { process, agent } = parseAgentAndProcess(pathname);
  const { segments, selectRefs: { show, refs }, agents } = state;
  const processes = agents[agent]
    ? Object.keys(agents[agent].processes || {})
    : [];
  if (segments.details && refs) {
    segments.details = segments.details.filter(
      s => !refs.find(r => r.linkHash === s.meta.linkHash)
    );
  }
  return { agent, process, segments, show, processes };
}

export default connect(mapStateToProps, {
  fetchSegments: getSegments,
  closeDialog: closeSelectRefsDialog,
  appendRef: addRef
})(SelectRefsDialog);
