import { REHYDRATE } from 'redux-persist';
import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

const extractProcess = process => ({
  name: process.name,
  actions: process.processInfo.actions,
  store: process.storeInfo ? process.storeInfo.adapter : {},
  fossilizers: (process.fossilizersInfo || []).map(f => f.adapter)
});

const extractProcesses = agent => {
  const processes = {};

  const processNames = Object.keys(agent.processes);
  for (let i = 0; i < processNames.length; i += 1) {
    const processName = processNames[i];
    processes[processName] = extractProcess(agent.processes[processName]);
  }

  return processes;
};

export default function(state = {}, action) {
  const agentName = action.name;
  let agentUrl = action.url;

  // We want to keep the url stored when we triggered the load action
  if (!agentUrl && state[agentName]) {
    agentUrl = state[agentName].url;
  }

  switch (action.type) {
    case actionTypes.AGENT_INFO_REQUEST:
      return {
        ...state,
        [agentName]: {
          status: statusTypes.LOADING,
          url: action.url,
          processes: {}
        }
      };
    case actionTypes.AGENT_INFO_FAILURE:
      return {
        ...state,
        [agentName]: {
          status: statusTypes.FAILED,
          url: agentUrl,
          error: action.error
        }
      };
    case actionTypes.AGENT_INFO_SUCCESS:
      return {
        ...state,
        [agentName]: {
          status: statusTypes.LOADED,
          url: agentUrl,
          processes: extractProcesses(action.agent)
        }
      };
    case actionTypes.AGENT_INFO_DELETE: {
      const { [agentName]: thisAgent, ...otherAgents } = state;
      return { ...otherAgents };
    }
    case REHYDRATE: {
      if (!action.payload) return state;

      const { payload: { agents } } = action;
      return Object.keys(agents).reduce((newState, a) => {
        const { [a]: { url } } = agents;
        return { ...newState, [a]: { url, status: statusTypes.STALE } };
      }, {});
    }
    default:
      return state;
  }
}
