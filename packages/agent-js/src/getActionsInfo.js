/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
