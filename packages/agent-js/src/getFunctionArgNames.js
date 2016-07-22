// http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

/**
 * Returns the argument name of a function.
 * @param {function} func - the function
 * @returns {string[]} the argument names of the function
 */
export default function getFunctionArgNames(func) {
  const funcStr = func.toString().replace(STRIP_COMMENTS, '');

  const result = funcStr
    .slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')'))
    .match(ARGUMENT_NAMES);

  return result || [];
}
