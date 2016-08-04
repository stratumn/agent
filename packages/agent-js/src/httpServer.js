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

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import error from './error';
import parseArgs from './parseArgs';

/**
 * Creates an HTTP server for an agent.
 * @param {Agent} agent - the agent instance
 * @param {object} [opts] - options
 * @param {object} [opts.cors] - CORS options
 * @param {object} [opts.salt] - salt used for callback URLs
 * @returns {express.Server} an express server
 */
export default function httpServer(agent, opts = {}) {
  const app = express();

  app.disable('x-powered-by');

  app.use(bodyParser.json({ type: () => true, strict: false }));

  if (opts.cors) {
    const corsMiddleware = cors(opts.cors.opts);
    app.use(corsMiddleware);
    app.options('*', corsMiddleware);
  }

  app.get('/', (req, res, next) => {
    agent
      .getInfo()
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post('/segments', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    agent
      .createMap(...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post('/segments/:linkHash/:action', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    agent
      .createSegment(req.params.linkHash, req.params.action, ...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/segments/:linkHash', (req, res, next) => {
    agent
      .getSegment(req.params.linkHash)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/segments', (req, res, next) => {
    agent
      .findSegments(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post('/evidence/:linkHash', (req, res, next) => {
    agent
      .insertEvidence(req.params.linkHash, req.body, req.query.secret)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/maps', (req, res, next) => {
    agent
      .getMapIds(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.post('/maps', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    agent
      .createMap(...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.post('/links/:linkHash/:action', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    agent
      .createSegment(req.params.linkHash, req.params.action, ...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.get('/links/:linkHash', (req, res, next) => {
    agent
      .getSegment(req.params.linkHash)
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.get('/links', (req, res, next) => {
    agent
      .findSegments(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.get('/maps/:id', (req, res, next) => {
    /*eslint-disable*/
    req.query.mapId = req.params.id;
    /*eslint-enable*/

    agent
      .findSegments(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.get('/branches/:linkHash', (req, res, next) => {
    /*eslint-disable*/
    req.query.prevLinkHash = req.params.linkHash;
    /*eslint-enable*/

    agent
      .findSegments(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
  });

  app.use(error());

  return app;
}
