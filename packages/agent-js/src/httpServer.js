/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
