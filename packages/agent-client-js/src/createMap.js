import segmentify from './segmentify';
import { post } from './request';

export default function createMap(agent, ...args) {
  return post(`${agent.url}/segments`, args)
    .then(res => segmentify(agent, res.body));
}
