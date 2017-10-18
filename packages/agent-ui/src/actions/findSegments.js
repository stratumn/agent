import { getAgent } from 'stratumn-agent-client';
import { findSegmentsSuccess, findSegmentsFailure } from './';

export default function(url, processName, options) {
  return dispatch =>
    getAgent(url)
      .then(agent => {
        const proc = agent.getProcess(processName);
        return proc.findSegments(options);
      })
      .then(res => dispatch(findSegmentsSuccess(res)))
      .catch(err => dispatch(findSegmentsFailure(err)));
}
