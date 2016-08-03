import getFunctionArgNames from './getFunctionArgNames';

/**
 * Returns information about an agent's actions.
 * @param {object} actions - the action functions
 * @returns {object} information about the agent
 */
export default function getActionsInfo(actions) {
  const funcNames = Object.keys(actions).filter(key =>
    typeof actions[key] === 'function'
  );

  const functions = {};

  funcNames.forEach(name => {
    functions[name] = { args: getFunctionArgNames(actions[name]) };
  });

  if (!functions.init) {
    functions.init = { args: [] };
  }

  return functions;
}
