import segmentify from './segmentify';
import { get } from './request';

export default function getSegment(agent, linkHash) {
  return get(`${agent.url}/segments/${linkHash}`)
    .then(res => segmentify(agent, res.body));
}
