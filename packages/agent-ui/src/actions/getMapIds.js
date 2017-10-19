import { getAgent } from 'stratumn-agent-client';
import { getMapIdsSuccess, getMapIdsFailure } from './';

export default function(url, processName) {
  return dispatch =>
    getAgent(url)
      .then(agent => {
        console.log(agent);
        const proc = agent.getProcess(processName);
        return proc.getMapIds();
      })
      .then(mapIds => dispatch(getMapIdsSuccess(mapIds)))
      .catch(err => dispatch(getMapIdsFailure(err)));
}
