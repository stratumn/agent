/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ChainTreeBuilder } from 'mapexplorer-core';
import radium from 'radium';
import { getStyles, getRules } from './mapExplorerCss';
import BitcoinEvidence from './BitcoinEvidence';
import DummyEvidence from './DummyEvidence';
import TMPopEvidence from './TMPopEvidence';

const { Style } = radium;

const evidencesContent = {
  display: 'flex',
  flexDirection: 'row'
};

const evidenceStyle = {
  paddingRight: '3rem'
};

function renderEvidence(evidence) {
  return (
    <div style={evidenceStyle} key={evidence.provider}>
      {
        {
          dummy: <DummyEvidence evidence={evidence} />,
          bcbatch: <BitcoinEvidence evidence={evidence} />,
          TMPop: <TMPopEvidence evidence={evidence} />
        }[evidence.backend]
      }
    </div>
  );
}

class MapExplorer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      segment: null,
      content: 'State'
    };
    this.handleSegmentClick = this.handleSegmentClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  componentDidMount() {
    this.state.builder = new ChainTreeBuilder(this.element);
    this.state.builder.build(
      {
        id: this.props.mapId,
        agentUrl: this.props.agentUrl,
        chainscript: this.props.chainscript,
        process: this.props.process
      },
      Object.assign(
        {},
        {
          onclick: this.handleSegmentClick,
          onTag: () => {}
        },
        this.props.options
      )
    );
  }

  handleSegmentClick(d, onHide, element) {
    this.onHide = onHide;
    const segment = d.data;
    this.setState({ segment });

    const { onSelectSegment } = this.props;
    if (onSelectSegment) {
      onSelectSegment(this.state.segment, element);
    }
  }

  handleClose() {
    this.setState({ segment: null });
    this.onHide();
    const { onSelectSegment } = this.props;
    if (onSelectSegment) {
      onSelectSegment(null);
    }
  }

  handleShow(part) {
    return () => {
      this.setState({ content: part });
    };
  }

  render() {
    const styles = getStyles();
    const rules = getRules();
    let segmentContainer;
    const { segment } = this.state;

    if (segment) {
      let segmentContent;
      switch (this.state.content) {
        case 'State':
          segmentContent = (
            <pre>{JSON.stringify(segment.link.state, undefined, 2)}</pre>
          );
          break;
        case 'Link':
          segmentContent = (
            <div className="link">
              <h4>Map ID</h4>
              <p>{segment.link.meta.mapId}</p>

              <h4>Agent Hash</h4>
              <p>{segment.link.meta.agentHash}</p>

              <h4>State Hash</h4>
              <p>{segment.link.meta.stateHash}</p>

              <h4>Previous Link hash</h4>
              <p>{segment.link.meta.prevLinkHash}</p>

              <h4>Action</h4>
              <p>
                {segment.link.meta.action}
                ({(segment.link.meta.arguments || [])
                  .map(arg => JSON.stringify(arg, undefined, 2))
                  .join(', ')})
              </p>
            </div>
          );
          break;
        case 'Evidence':
          segmentContent = (
            <div style={evidencesContent}>
              {(segment.meta.evidences || []).map(e => renderEvidence(e))}
            </div>
          );
          break;
        case 'JSON':
          segmentContent = <pre>{JSON.stringify(segment, undefined, 2)}</pre>;
          break;
        default:
          throw new Error(`Unexpected content ${this.state.content}`);
      }

      segmentContainer = (
        <div className="segment-container" style={styles.segment}>
          <div className="title" style={styles.title}>
            <div>
              <h1>Segment</h1>
              <h2 style={styles.titleh2}>{segment.meta.linkHash}</h2>
            </div>

            <button
              onClick={this.handleClose}
              style={styles.close}
              onKeyDown={this.handleClose}
            >
              &#10005;
            </button>
          </div>
          <div style={styles.body}>
            <div className="menu">
              <ul>
                {['State', 'Link', 'Evidence', 'JSON'].map(item => (
                  <li
                    className={this.state.content === item ? 'active' : ''}
                    onClick={this.handleShow(item)}
                    onKeyDown={this.handleShow(item)}
                    role="presentation"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={styles.content}>{segmentContent}</div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="react-mapexplorer"
        ref={element => {
          this.element = element;
        }}
      >
        <Style scopeSelector=".react-mapexplorer" rules={rules} />
        {segmentContainer}
        <svg width="0">
          <marker
            id="triangle"
            viewBox="0 0 10 10"
            refX="0"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="3"
            orient="auto"
            style={styles.triangle}
          >
            <path fill="#CCCCCC" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker
            id="blackTriangle"
            viewBox="0 0 10 10"
            refX="0"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="3"
            orient="auto"
            style={styles.triangle}
          >
            <path fill="black" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </svg>
      </div>
    );
  }
}

MapExplorer.propTypes = {
  agentUrl: PropTypes.string,
  process: PropTypes.string,
  chainscript: PropTypes.string,
  mapId: PropTypes.string,
  onSelectSegment: PropTypes.func,
  options: PropTypes.shape({})
};

MapExplorer.defaultProps = {
  agentUrl: '',
  process: '',
  chainscript: '',
  mapId: '',
  onSelectSegment: () => {},
  options: {}
};

export default radium(MapExplorer);
