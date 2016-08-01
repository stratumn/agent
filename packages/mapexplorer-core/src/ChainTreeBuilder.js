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
  constructor(element, options) {
    this.onTag = options.onTag;
    this.chainTree = new ChainTree(element, { ...defaultOptions, ...options });
  }

  build(map) {
    if (map.id && map.application) {
      return this._load(map)
        .then(segments => {
          this.chainTree.display(segments);
          this._notifyTags(segments);
        });
    } else if (map.chainscript && map.chainscript.length) {
      let chainscript = map.chainscript;
      try {
        return resolveLinks(wrap(parseIfJson(chainscript)))
          .then(segments => {
            this.chainTree.display(segments);
            this._notifyTags(segments);
          });
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.resolve();
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
