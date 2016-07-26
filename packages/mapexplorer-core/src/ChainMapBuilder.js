import ChainTree from './ChainTree';
import compactHash from './compactHash';
import resolveLinks from './resolveLinks';
import StratumnSDK from 'stratumn-sdk';

const defaultOptions = {
  withArgs: false,
  getSegmentText(node) {
    return compactHash(node.data.meta.linkHash);
  },
  getLinkText(node) {
    return node.target.data.link.meta.action +
      (this.withArgs ? `(${node.target.data.link.meta.arguments.join(', ')})` : '');
  },
  duration: 750,
  onclick() {}
};

export default class ChainMapBuilder {
  constructor(element, options) {
    this.chainTree = new ChainTree(element, Object.assign({}, defaultOptions, options));
  }

  build(map) {
    if (map.id && map.application) {
      this._load(map).then(chainscript => this.chainTree.display(chainscript));
    } else if (map.chainscript && map.chainscript.length) {
      try {
        resolveLinks(JSON.parse(map.chainscript)).then(res => this.chainTree.display(res));
      } catch (e) {
        console.log(e);
      }
    }
  }

  _load(map) {
    return StratumnSDK.getApplication(map.application)
      .then(app => app.getMap(map.id))
      .then(res => Promise.all(res.map(link => link.load())))
      .catch(res => console.log(res));
  }
}
