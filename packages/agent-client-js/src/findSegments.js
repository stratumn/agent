import segmentify from './segmentify';
import makeQueryString from './makeQueryString';
import { get } from './request';

export default function findSegments(agent, opts = {}) {
  return get(`${agent.url}/segments${makeQueryString(opts)}`)
    .then(res => res.body.map(obj => segmentify(agent, obj)));
}
