import ChainTree from './ChainTree';
import compactHash from './compactHash';
import resolveLinks from './resolveLinks';
import wrap from './wrap';
import parseIfJson from './parseIfJson';
import tagsSet from './tagsSet';
import StratumnSDK from 'stratumn-sdk';

const defaultOptions = {
  withArgs: false,
  duration: 750,
  verticalSpacing: 1.2,
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
    if (map.id && map.application) {
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
    this.chainTree.display(segments, { ...defaultOptions, ...options });
    this._notifyTags(segments);
    return segments;
  }

  _notifyTags(chainscript) {
    tagsSet(chainscript).forEach(this.onTag);
  }

  _load(map) {
    return StratumnSDK.getApplication(map.application)
      .then(app => app.getMap(map.id))
      .then(res => Promise.all(res.map(link => link.load())))
      .catch(res => console.log(res));
  }
}
