/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
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
