/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * An express middleware that handles errors.
 * @returns {function} an express middleware.
 */
export default function error() {
  /*eslint-disable*/
  return (err, req, res, next) => {
  /*eslint-enable*/
    if (err.status && err.status !== 500) {
      console.error(`${req.originalUrl}: ${err.stack}`);

      if (res.locals.renderErrorAsLink) {
        res.status(err.status).json({ link: {}, meta: { errorMessage: err.message } });
      } else {
        res.status(err.status).json({ status: err.status, error: err.message });
      }

      return;
    }

    console.error(`${req.originalUrl}: ${err.stack}`);

    if (res.locals.renderErrorAsLink) {
      res.status(500).json({ link: {}, meta: { errorMessage: 'internal server error' } });
    } else {
      res.status(500).json({ status: 500, error: 'internal server error' });
    }
  };
}
