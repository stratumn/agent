import makeQueryString from './makeQueryString';
import { get } from './request';

export default function getMapIds(agent, opts = {}) {
  return get(`${agent.url}/maps${makeQueryString(opts)}`)
    .then(res => res.body);
}
