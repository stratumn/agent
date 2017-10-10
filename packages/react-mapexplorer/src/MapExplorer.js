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
import { ChainTreeBuilder } from 'mapexplorer-core';
import { getStyles, getRules } from './mapExplorerCss';
import BitcoinEvidence from './BitcoinEvidence';
import radium from 'radium';
const Style = radium.Style;

class MapExplorer extends Component {
  constructor(props) {
    super(props);
    this.evidenceComponent = props.evidenceComponent;
    if (!this.evidenceComponent) {
      this.evidenceComponent = BitcoinEvidence;
    }

    this.state = {
      segment: null,
      content: 'state'
    };
    this.handleSegmentClick = this.handleSegmentClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  handleSegmentClick(d, onHide, element) {
    this.onHide = onHide;
    const segment = d.data;
    this.setState({ segment });

    const onSelectSegment = this.props.onSelectSegment;
    if (onSelectSegment) {
      onSelectSegment(this.state.segment, element);
    }
  }

  handleClose() {
    this.setState({ segment: null });
    this.onHide();
    const onSelectSegment = this.props.onSelectSegment;
    if (onSelectSegment) {
      onSelectSegment(null);
    }
  }

  handleShow(part) {
    return () => {
      this.setState({ content: part });
    };
  }

  componentDidMount() {
    this.state.builder = new ChainTreeBuilder(this.element);

    this.state.builder.build({
      id: this.props.mapId,
      agentUrl: this.props.agentUrl,
      chainscript: this.props.chainscript,
      process: this.props.process
    }, Object.assign({}, {
      onclick: this.handleSegmentClick,
      onTag: () => { }
    }, this.props.options));
  }

  render() {
    const styles = getStyles();
    const rules = getRules();
    let segmentContainer;
    const segment = this.state.segment;

    if (segment) {
      let segmentContent;
      switch (this.state.content) {
        case 'state':
          segmentContent = (
            <pre>{JSON.stringify(segment.link.state, undefined, 2)}</pre>
          );
          break;
        case 'link':
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
              <p>{segment.link.meta.action}
                ({(segment.link.meta.arguments || []).map(
                  (arg) => JSON.stringify(arg, undefined, 2)
                ).join(', ')})</p>
            </div>
          );
          break;
        case 'evidence':
          segmentContent = (
            <this.evidenceComponent evidence={segment.meta.evidence} />
          );
          break;
        case 'json':
          segmentContent = (
            <pre>{JSON.stringify(segment, undefined, 2)}</pre>
          );
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

            <a onClick={this.handleClose} style={styles.close}>
              &#10005;
            </a>
          </div>
          <div style={styles.body}>
            <div className="menu">
              <ul>
                <li className={(this.state.content === 'state' ? 'active' : '')}
                  onClick={this.handleShow('state')}>State</li>
                <li className={(this.state.content === 'link' ? 'active' : '')}
                  onClick={this.handleShow('link')}>Link</li>
                <li className={(this.state.content === 'evidence' ? 'active' : '')}
                  onClick={this.handleShow('evidence')}>Evidence</li>
                <li className={(this.state.content === 'json' ? 'active' : '')}
                  onClick={this.handleShow('json')}>JSON</li>
              </ul>
            </div>
            <div style={styles.content}>
              {segmentContent}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="react-mapexplorer" ref={(element) => { this.element = element; }}>
        <Style
          scopeSelector=".react-mapexplorer"
          rules={rules}
        />
        {segmentContainer}
        <svg>
          <marker id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth"
            markerWidth="4" markerHeight="3" orient="auto" style={styles.triangle}>
            <path fill="#CCCCCC" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </svg>
      </div>
    );
  }
}

MapExplorer.propTypes = {
  agentUrl: React.PropTypes.string,
  process: React.PropTypes.string,
  chainscript: React.PropTypes.string,
  evidenceComponent: React.PropTypes.func,
  mapId: React.PropTypes.string,
  onSelectSegment: React.PropTypes.func,
  options: React.PropTypes.object,
};

export default radium(MapExplorer);
