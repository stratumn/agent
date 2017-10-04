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

import ChainTree from './ChainTree';
import compactHash from './compactHash';
import resolveLinks from './resolveLinks';
import wrap from './wrap';
import parseIfJson from './parseIfJson';
import tagsSet from './tagsSet';
import { getAgent } from 'stratumn-agent-client';

export const defaultOptions = {
  withArgs: false,
  duration: 750,
  verticalSpacing: 1.2,
  polygonSize: { width: 78, height: 91 },
  getBoxSize() {
    const self = this;
    return { width: self.polygonSize.width, height: 25 };
  },
  getArrowLength() {
    return this.polygonSize.width;
  },
  getSegmentText(node) {
    return compactHash(node.data.meta.linkHash);
  },
  getLinkText(node) {
    return node.target.data.link.meta.action +
      (this.withArgs ? `(${node.target.data.link.meta.arguments.join(', ')})` : '');
  },
  onclick() {},
  onTag() {}
};

export default class ChainTreeBuilder {
  constructor(element) {
    this.chainTree = new ChainTree(element);
  }

  build(map, options) {
    this.onTag = options.onTag;
    if (map.id && map.applicationUrl) {
      return this._load(map).then(segments => this._display(segments, options));
    } else if (map.chainscript && map.chainscript.length) {
      try {
        return resolveLinks(wrap(parseIfJson(map.chainscript)))
          .then(segments => this._display(segments, options));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.resolve();
  }

  _display(segments, options) {
    this.chainTree.display(segments, Object.assign({}, defaultOptions, options));
    this._notifyTags(segments);
    return segments;
  }

  _notifyTags(chainscript) {
    tagsSet(chainscript).forEach(this.onTag);
  }

  _load(map) {
    return getAgent(map.applicationUrl)
      .then(app => app.findSegments({ mapId: map.id, limit: -1 }))
      .catch(res => console.log(res));
  }
}
