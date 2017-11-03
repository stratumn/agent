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
const linkTextFont = 'Gibson-Regular, Montserrat, sans-serif';

export function getRules() {
  const brandPrimary = '#EC714A';
  const segmentPrimaryColor = '#7BC0D2';
  const segmentSecondaryColor = '#459FB7';
  const segmentTextColor = 'white';
  const segmentTextFont = '"RationalTWText-SemiBold", "Roboto Mono", monospace';

  const selectedSegmentPrimaryColor = '#3E3E3E';
  const selectedSegmentSecondaryColor = '#2E2E2E';

  const foreignSegmentPrimaryColor = '#CD5C5C';
  const foreignSegmentSecondaryColor = '#8B0000';
  const textPathColor = '#6E6E6E';
  const linkColor = '#CCC';

  return {
    color: 'white',

    'h1, h2, h4, li, a': {
      fontFamily: 'Gibson-SemiBold, Montserrat, sans-serif'
    },

    h1: {
      marginTop: 0,
      fontWeight: 600,
      fontSize: '11px',
      color: '#CCCCCC',
      textTransform: 'uppercase'
    },

    h2: {
      marginBottom: 0,
      fontWeight: 300,
      fontSize: '18px',
      color: '#FFFFFF',
      textTransform: 'none'
    },

    h4: {
      fontWeight: '600',
      fontSize: '11px',
      color: '#ADADAD',
      textTransform: 'uppercase',
      marginBottom: 0
    },

    ul: {
      paddingLeft: 0,
      paddingRight: '5px',
      listStyle: 'none'
    },

    'li.active': {
      color: brandPrimary,
      borderBottom: `2px solid ${brandPrimary}`
    },

    li: {
      cursor: 'pointer',
      fontSize: '15px',
      color: '#CCCCCC',
      margin: '20px 0',
      width: '100px',
      outline: 0,
      marginBottom: 15,
      fontFamily: linkTextFont
    },

    p: {
      fontFamily: 'RationalTWText-Light, "Roboto Mono", monospace',
      fontSize: '14px',
      color: 'white',
      marginTop: 0
    },

    a: {
      fontSize: '15px',
      color: brandPrimary,
      display: 'block',
      cursor: 'pointer'
    },

    '.node': {
      cursor: 'pointer'
    },

    '.node polygon': {
      fill: segmentPrimaryColor
    },

    '.node text': {
      fontFamily: segmentTextFont,
      fontSize: 14,
      fill: segmentTextColor
    },

    '.node rect': {
      fill: segmentSecondaryColor
    },

    '.textpath': {
      fontFamily: linkTextFont,
      fontSize: 14,
      fill: textPathColor
    },

    '.link': {
      fill: 'none',
      stroke: linkColor,
      strokeWidth: 5,
      markerEnd: 'url("#triangle")'
    },

    '.node.selected polygon': {
      fill: selectedSegmentPrimaryColor
    },

    '.node.selected rect': {
      fill: selectedSegmentSecondaryColor
    },

    '.node.childRef polygon': {
      fill: foreignSegmentPrimaryColor
    },

    '.node.childRef rect': {
      fill: foreignSegmentSecondaryColor
    },

    '.node.ref polygon': {
      fill: foreignSegmentPrimaryColor
    },

    '.node.ref rect': {
      fill: foreignSegmentSecondaryColor
    },

    '#ref-link': {
      strokeWidth: 8
    },

    '#ref-link:hover': {
      stroke: 'black',
      cursor: 'pointer',
      strokeWidth: 10,
      markerEnd: 'url("#blackTriangle")'
    },

    'text#linkLabelRef': {
      cursor: 'pointer',
      fontFamily: segmentTextFont,
      fill: 'white'
    },

    'rect.refLinkBox': {
      cursor: 'pointer',
      fill: foreignSegmentSecondaryColor
    }
  };
}

export function getStyles() {
  return {
    triangle: {
      // get the svg that contains the arrow out of the flow
      position: 'absolute',
      pointerEvents: 'none'
    },

    title: {
      background: '#2E2E2E',
      padding: '10px 100px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    titleh2: {
      fontWeight: '100',
      fontFamily: linkTextFont
    },

    body: {
      background: '#3E3E3E',
      padding: '0 100px',
      maxHeight: '400px',
      overflowY: 'scroll',
      display: 'flex',
      flexDirection: 'row'
    },

    content: {
      overflowY: 'scroll'
    },

    close: {
      color: 'white'
    }
  };
}
