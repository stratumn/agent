import express from 'express';
import bodyParser from 'body-parser';
import agent from './agent';
import error from './error';

/**
 * Creates an HTTP server for an agent.
 * @param {object} transitions - the transition function
 * @param {StoreClient} storeClient - the store client
 * @returns {express.Server} an express server
 */
export default function agentHttpServer(transitions, storeClient) {
  const app = express();
  const instance = agent(transitions, storeClient);

  app.use(bodyParser.json({ type: () => true, strict: false }));

  app.get('/', (req, res, next) => {
    instance
      .getInfo(req.params.hash)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post('/maps', (req, res, next) => {
    /*eslint-disable*/
    const args = req.body
      ? Array.isArray(req.body)
      ? req.body
      : [req.body]
      : [];
    /*eslint-enable*/

    instance
      .createMap(args)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/links/:hash', (req, res, next) => {
    instance
      .getSegment(req.params.hash)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post('/links/:hash/:action', (req, res, next) => {
    /*eslint-disable*/
    const args = req.body
      ? Array.isArray(req.body)
      ? req.body
      : [req.body]
      : [];
    /*eslint-enable*/

    instance
      .createLink(req.params.hash, req.params.action, ...args)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/links', (req, res, next) => {
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

  app.use(error);

  return app;
}
