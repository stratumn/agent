import { getAgent } from 'stratumn-agent-client';
import { findSegmentsSuccess, findSegmentsFailure } from './';

export default function(url, processName, options) {
  return dispatch =>
    getAgent(url)
      .then(agent => {
        const proc = agent.processes[processName];
        if (!proc) {
          throw new Error(`No process named ${processName}`);
        } else {
          return proc.findSegments(options);
        }
      })
      .then(res => dispatch(findSegmentsSuccess(res)))
      .catch(err => dispatch(findSegmentsFailure(err)));
}
