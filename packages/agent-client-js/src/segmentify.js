import deprecated from './deprecated';
import getBranches from './getBranches';
import { post } from './request';

export default function segmentify(agent, obj) {
  Object
    .keys(agent.agentInfo.actions)
    .filter(key => ['init'].indexOf(key) < 0)
    .forEach(key => {
      /*eslint-disable*/
      obj[key] = (...args) =>
        post(`${agent.url}/segments/${obj.meta.linkHash}/${key}`, args)
          .then(res => segmentify(agent, res.body))
    });

  /*eslint-disable*/
  obj.getPrev = () => {
    /*eslint-enable*/
    if (obj.link.meta.prevLinkHash) {
      return agent.getSegment(obj.link.meta.prevLinkHash);
    }

    return Promise.resolve(null);
  };

  // Deprecated.
  /*eslint-disable*/
  obj.load = () => {
    /*eslint-enable*/
    deprecated('segment#load()');
    return Promise.resolve(segmentify(agent, {
      link: JSON.parse(JSON.stringify(obj.link)),
      meta: JSON.parse(JSON.stringify(obj.meta))
    }));
  };

  // Deprecated.
  /*eslint-disable*/
  obj.getBranches = (...args) => {
    /*eslint-enable*/
    return getBranches(agent, obj.meta.linkHash, ...args);
  };

  return obj;
}
