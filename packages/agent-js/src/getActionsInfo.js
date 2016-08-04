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
