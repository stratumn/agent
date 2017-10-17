import { getAgent } from 'stratumn-agent-client';
import { getMapIdsSuccess, getMapIdsFailure } from './';

export default function(url, processName) {
  return dispatch =>
    getAgent(url)
      .then(agent => {
        const proc = agent.processes[processName];
        if (!proc) {
          throw new Error(`No process named ${processName}`);
        } else {
          return proc.getMapIds();
        }
      })
      .then(mapIds => dispatch(getMapIdsSuccess(mapIds)))
      .catch(err => dispatch(getMapIdsFailure(err)));
}
