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
      .getInfo(req.params.hash)
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

  app.post('/segments/:hash/:action', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    agent
      .createLink(req.params.hash, req.params.action, ...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/segments/:hash', (req, res, next) => {
    agent
      .getSegment(req.params.hash)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/segments', (req, res, next) => {
    agent
      .findSegments(req.query)
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
  app.post('/links/:hash/:action', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    agent
      .createLink(req.params.hash, req.params.action, ...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.get('/links/:hash', (req, res, next) => {
    agent
      .getSegment(req.params.hash)
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

  app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
  });

  // Legacy
  app.get('/branches/:hash', (req, res, next) => {
    /*eslint-disable*/
    req.query.prevLinkHash = req.params.hash;
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
