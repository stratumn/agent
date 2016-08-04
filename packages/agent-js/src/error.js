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
        res.status(err.status).end(err.message);
      }

      return;
    }

    console.error(`${req.originalUrl}: ${err.stack}`);

    if (res.locals.renderErrorAsLink) {
      res.status(500).json({ link: {}, meta: { errorMessage: 'internal server error' } });
    } else {
      res.status(500).end('internal server error');
    }
  };
}
