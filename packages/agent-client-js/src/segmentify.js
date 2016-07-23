import request from 'superagent';

export default function segmentify(agent, obj) {
  Object
    .keys(agent.agentInfo.functions)
    .filter(key => ['init', 'catchAll'].indexOf(key) < 0)
    .forEach(key => {
      /*eslint-disable*/
      obj[key] = (...args) =>
        new Promise((resolve, reject) => {
          const url = `${agent.url}/segments/${obj.meta.linkHash}/${key}`;
          /*eslint-enable*/

          return request
            .post(url)
            .send(args)
            .end((err, res) => {
              const error = err || (res.body.meta && res.body.meta.errorMessage);
              if (error) {
                reject(error);
                return;
              }

              resolve(segmentify(agent, res.body));
            });
        });
    });

  /*eslint-disable*/
  obj.getPrev = () => {
    /*eslint-enable*/
    if (obj.link.meta.prevLinkHash) {
      return agent.getSegment(obj.link.meta.prevLinkHash);
    }

    return Promise.resolve(null);
  };

  return obj;
}
