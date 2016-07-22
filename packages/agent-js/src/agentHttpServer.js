import express from 'express';
import storeHttpClient from './storeHttpClient';
import agent from './agent';

/**
 * Creates an HTTP server for an agent.
 * @param {object} transitions - the transition function
 * @returns {express.Server} an express server
 */
export default function agentHttpServer(transitions) {
  const app = express();
  const storeClient = storeHttpClient('http://store:5000');
  const instance = agent(transitions, storeClient);

  app.get('/', (req, res, next) => {
    instance
      .getInfo(req.params.hash)
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

  return app;
}
