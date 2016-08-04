/*
    Stratumn Agent Javascript Library
    Copyright (C) 2016  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
