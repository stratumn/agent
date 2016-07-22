import getFunctionArgNames from './getFunctionArgNames';

/**
 * Returns information about an agent's transition functions.
 * @param {object} transitions - the transition functions
 * @returns {object} information about the agent
 */
export default function getAgentInfo(transitions) {
  const funcNames = Object.keys(transitions).filter(key =>
    typeof transitions[key] === 'function'
  );

  const functions = {};

  funcNames.forEach(name => {
    functions[name] = { args: getFunctionArgNames(transitions[name]) };
  });

  return { functions };
}
