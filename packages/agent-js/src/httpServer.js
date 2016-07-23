import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import agent from './agent';
import error from './error';
import parseArgs from './parseArgs';

/**
 * Creates an HTTP server for an agent.
 * @param {object} transitions - the transition function
 * @param {StoreClient} storeClient - the store client
 * @param {object} [opts] - options
 * @param {object} [opts.cors] - CORS options
 * @returns {express.Server} an express server
 */
export default function httpServer(transitions, storeClient, opts = {}) {
  const app = express();
  const instance = agent(transitions, storeClient);

  app.disable('x-powered-by');

  app.use(bodyParser.json({ type: () => true, strict: false }));

  if (opts.cors) {
    const corsMiddleware = cors(opts.cors.opts);
    app.use(corsMiddleware);
    app.options('*', corsMiddleware);
  }

  app.get('/', (req, res, next) => {
    instance
      .getInfo(req.params.hash)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post('/segments', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    instance
      .createMap(...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post('/segments/:hash/:action', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    instance
      .createLink(req.params.hash, req.params.action, ...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/segments/:hash', (req, res, next) => {
    instance
      .getSegment(req.params.hash)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/segments', (req, res, next) => {
    instance
      .findSegments(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/maps', (req, res, next) => {
    instance
      .getMapIds(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.post('/maps', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    instance
      .createMap(...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.post('/links/:hash/:action', (req, res, next) => {
    /*eslint-disable*/
    res.locals.renderErrorAsLink = true;
    /*eslint-enable*/

    instance
      .createLink(req.params.hash, req.params.action, ...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.get('/links/:hash', (req, res, next) => {
    instance
      .getSegment(req.params.hash)
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.get('/links', (req, res, next) => {
    instance
      .findSegments(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  // Legacy
  app.get('/branches/:hash', (req, res, next) => {
    /*eslint-disable*/
    req.query.prevLinkHash = req.params.hash;
    /*eslint-enable*/

    instance
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
