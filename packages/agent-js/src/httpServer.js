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

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import error from './error';
import parseArgs from './parseArgs';
import memorystore from './memoryStore';

/**
 * Creates an HTTP server for an agent.
 * @param {Agent} agent - the agent instance returned by Agent.create()
 * @param {object} [opts] - options
 * @param {object} [opts.cors] - CORS options
 * @param {object} [opts.salt] - salt used for callback URLs
 * @returns {express.Server} - an express server
 */
export default function httpServer(agent, opts = {}) {
  function loadProcess(req, res, next) {
    const process = agent.getProcess(req.params.process);
    res.locals.process = process;
    next();
  }

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

  app.get('/processes', (req, res, next) => {
    try {
      const processes = agent.getAllProcesses(req.query);
      res.json(processes);
    } catch (err) {
      next(err);
    }
  });

  /**
   * This API allows dynamic upload of new processes to a running agent.
   * This is obviously very dangerous as it accepts any javascript code.
   * A strict access control mechanism should be setup to restrict access to this API.
   */
  app.post('/:process/add', (req, res, next) => {
    try {
      if (!req.body.script) {
        return res.status(400).json({ error: 'missing script' });
      }

      let exported;
      try {
        const processModule = new module.constructor();
        /* eslint-disable no-underscore-dangle */
        processModule._compile(
          Buffer.from(req.body.script, 'base64').toString(),
          '' // this parameter is actually required (undefined isn't accepted)
        );
        /* eslint-enable no-underscore-dangle */
        exported = processModule.exports;
      } catch (err) {
        return res.status(400).json({ error: 'invalid script' });
      }

      if (exported.name !== req.params.process) {
        return res.status(400).json({
          error:
            "Process name from url doesn't match process name from the script"
        });
      }

      if (!exported.init || typeof exported.init !== 'function') {
        return res.status(400).json({
          error: 'missing init function'
        });
      }

      agent.addProcess(exported.name, exported, memorystore(), null);

      return res.json(agent.getAllProcesses());
    } catch (err) {
      return next(err);
    }
  });

  app.get('/:process/remove', (req, res, next) => {
    try {
      const processes = agent.removeProcess(req.params.process);
      res.json(processes);
    } catch (err) {
      next(err);
    }
  });

  app.post('/:process/segments', loadProcess, (req, res, next) => {
    res.locals.renderErrorAsLink = true;

    res.locals.process
      .createMap(...parseArgs(req.body))
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post(
    '/:process/segments/:linkHash/:action',
    loadProcess,
    (req, res, next) => {
      res.locals.renderErrorAsLink = true;

      res.locals.process
        .createSegment(
          req.params.linkHash,
          req.params.action,
          ...parseArgs(req.body)
        )
        .then(res.json.bind(res))
        .catch(next);
    }
  );

  app.get('/:process/segments/:linkHash', loadProcess, (req, res, next) => {
    res.locals.process
      .getSegment(req.params.linkHash)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/:process/segments', loadProcess, (req, res, next) => {
    res.locals.process
      .findSegments(req.query)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.post('/:process/evidence/:linkHash', loadProcess, (req, res, next) => {
    res.locals.process
      .insertEvidence(req.params.linkHash, req.body, req.query.secret)
      .then(res.json.bind(res))
      .catch(next);
  });

  app.get('/:process/maps', loadProcess, (req, res, next) => {
    res.locals.process
      .getMapIds(req.query)
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
