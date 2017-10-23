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
 * @param {object} [opts.enableProcessUpload] - allow clients to upload new processes to a running agent
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

  app.get('/', (req, res) => {
    agent.getInfo().then(res.json.bind(res));
  });

  app.get('/processes', (req, res) => {
    const processes = agent.getAllProcesses(req.query);
    res.json(processes);
  });

  /**
   * This API allows dynamic upload of new processes to a running agent.
   * This is obviously very dangerous as it accepts any javascript code,
   * which is why it's disabled by default.
   * If you choose to enable it, a strict access control mechanism should be 
   * setup to restrict access to this API.
   */
  if (opts.enableProcessUpload) {
    app.post('/:process/upload', (req, res) => {
      const err = new Error();
      err.status = 400;

      if (!req.body.script) {
        err.message = 'missing script';
        throw err;
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
      } catch (e) {
        err.message = 'invalid script';
        throw err;
      }

      if (!exported.init || typeof exported.init !== 'function') {
        err.message = 'missing init function';
        throw err;
      }

      agent.addProcess(req.params.process, exported, memorystore(), null);

      res.json(agent.getAllProcesses());
    });
  }

  app.get('/:process/remove', (req, res) => {
    const processes = agent.removeProcess(req.params.process);
    res.json(processes);
  });

  app.post('/:process/segments', loadProcess, (req, res) => {
    res.locals.renderErrorAsLink = true;

    res.locals.process
      .createMap(...parseArgs(req.body))
      .then(res.json.bind(res));
  });

  app.post('/:process/segments/:linkHash/:action', loadProcess, (req, res) => {
    res.locals.renderErrorAsLink = true;

    res.locals.process
      .createSegment(
        req.params.linkHash,
        req.params.action,
        ...parseArgs(req.body)
      )
      .then(res.json.bind(res));
  });

  app.get('/:process/segments/:linkHash', loadProcess, (req, res) => {
    res.locals.process.getSegment(req.params.linkHash).then(res.json.bind(res));
  });

  app.get('/:process/segments', loadProcess, (req, res) => {
    res.locals.process.findSegments(req.query).then(res.json.bind(res));
  });

  app.post('/:process/evidence/:linkHash', loadProcess, (req, res) => {
    res.locals.process
      .insertEvidence(req.params.linkHash, req.body, req.query.secret)
      .then(res.json.bind(res));
  });

  app.get('/:process/maps', loadProcess, (req, res) => {
    res.locals.process.getMapIds(req.query).then(res.json.bind(res));
  });

  app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
  });

  app.use(error());

  return app;
}
