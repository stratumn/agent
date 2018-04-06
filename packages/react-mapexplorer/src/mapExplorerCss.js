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

  const segmentPrimaryColor = '#293047';
  const segmentSecondaryColor = '#040406';
  const segmentTextColor = 'white';
  const segmentTextFont = '"RationalTWText-SemiBold", "Roboto Mono", monospace';

  const selectedSegmentPrimaryColor = '#2be4a6';
  const selectedSegmentSecondaryColor = '#13966a';

  const foreignSegmentPrimaryColor = '#CD5C5C';
  const foreignSegmentSecondaryColor = '#8B0000';
  const linkTextColor = '#6E6E6E';
  const linkColor = '#CCC';
  const refLinkColor = '#000';

  return {
    color: 'white',
    '-webkit-font-smoothing': 'antialiased',

    'h1, h2, h4, li, a': {
      fontFamily: 'Gibson-SemiBold, Montserrat, sans-serif'
    },

    '#triangle': {
      fill: linkColor
    },

    '#reverseTriangle': {
      fill: refLinkColor
    },

    '#blackTriangle': {
      fill: 'black'
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
      color: '#2BE4A6',
      borderBottom: `2px solid #2BE4A6`
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
      fill: linkTextColor
    },

    '.link': {
      fill: 'none',
      stroke: linkColor,
      strokeWidth: 5,
      markerEnd: 'url("#triangle")'
    },

    '.link.references, .link.referencedBy': {
      stroke: refLinkColor
    },

    '.link.references': {
      markerStart: 'url("#reverseTriangle")'
    },

    '.link.referencedBy': {
      markerEnd: 'url("#blackTriangle")'
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
      strokeWidth: 8,
      stroke: 'black',
      cursor: 'pointer',
      markerEnd: 'url("#blackTriangle")',
      markerStart: 'none'
    },

    'text#linkLabelRef': {
      cursor: 'pointer',
      fontFamily: segmentTextFont,
      fill: 'white'
    },

    'rect.refLinkBox': {
      cursor: 'pointer',
      fill: foreignSegmentSecondaryColor
    },

    '.evidence': {
      display: 'flex'
    },

    '.pem': {
      whiteSpace: 'pre-line'
    }
  };
}

export function getStyles() {
  return {
    title: {
      background: '#040406',
      padding: '10px 100px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    titleh2: {
      fontWeight: '300',
      fontFamily: 'Gibson-Light, Montserrat, sans-serif'
    },

    body: {
      background: '#293047',
      padding: '0 100px',
      maxHeight: '400px',
      overflowY: 'scroll',
      display: 'flex',
      flexDirection: 'row'
    },

    close: {
      color: 'white',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    }
  };
}
