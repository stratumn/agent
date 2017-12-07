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
 * @swagger
 * definitions:
 *   Evidence:
 *     type: object
 *     properties:
 *       state:
 *         type: string
 *         description: Current state of the evidence (Pending or Complete)
 *       backend:
 *         type: string
 *         description: Type of the evidence (Bitcoin, Tendermint, ...)
 *       provider:
 *         type: string
 *         description: Origin of the evidence (Chain, Identifier of the third-party...)
 *       proof:
 *         type: object
 *         description: Actual, objectively verifiable, proof of existence of the Segment
 *
 *   Segment:
 *     type: object
 *     required:
 *       - link
 *       - meta
 *     properties:
 *       link:
 *         type: object
 *         required:
 *           - state
 *           - meta
 *         properties:
 *           state:
 *             type: object
 *             description: Functional variables
 *           meta:
 *             type: object
 *             description: Metadata about the state
 *       meta:
 *         type: object
 *         required:
 *           - linkHash
 *           - evidences
 *         properties:
 *           linkHash:
 *             type: string
 *             description: Identifier of this segment. Computed as the hash of its link.
 *           evidences:
 *             type: array
 *             description: List of evidences that proves the existence of this segment
 *             items:
 *               $ref: '#/definitions/Evidence'
 *
 *
 *   Process:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: Name of the Process
 *       processInfo:
 *         type: object
 *         properties:
 *           actions:
 *             type: object
 *             description: A map of all available actions in this process along with their arguments
 *           pluginsInfo:
 *             type: array
 *             description: List of the plugins that have been activated for this process
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       fossilizersInfo:
 *         type: array
 *         description: Information about the fossilizer that will be used for the segments created by this process
 *         items:
 *           type: object
 *       storeInfo:
 *         description: Information about the store that will be used for the segments created by this process
 *         type: object
 */

import express from 'express';
import { wrap } from 'async-middleware';
import bodyParser from 'body-parser';
import cors from 'cors';
import error from './error';
import parseArgs from './parseArgs';
import storeHttpClient from './storeHttpClient';
import fossilizerHttpClient from './fossilizerHttpClient';

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

  /**
   * @swagger
   * /:
   *   get:
   *     description: Displays information about this agent.
   *     responses:
   *       200:
   *         description: Agent Info
   *         schema:
   *           type: object
   *           properties:
   *             processes:
   *               type: object
   *               additionalProperties:
   *                 $ref: '#/definitions/Process'
   *
   */
  app.get('/', (req, res) => agent.getInfo().then(res.json.bind(res)));

  /**
   * @swagger
   * /processes:
   *    get:
   *      description: Returns a list of the processes handled by this agent.
   *      responses:
   *        200:
   *          description: Process list
   *          schema:
   *            type: array
   *            items:
   *              $ref: '#/definitions/Process'
   *
   */
  app.get('/processes', (req, res) =>
    agent.getAllProcesses(req.query).then(res.json.bind(res))
  );

  /**
   * This API allows dynamic upload of new processes to a running agent.
   * This is obviously very dangerous as it accepts any javascript code,
   * which is why it's disabled by default.
   * If you choose to enable it, a strict access control mechanism should be
   * setup to restrict access to this API.
   */
  if (opts.enableProcessUpload) {
    const parseProcessActions = actions => {
      const processActionsModule = new module.constructor();
      /* eslint-disable no-underscore-dangle */
      processActionsModule._compile(
        Buffer.from(actions, 'base64').toString(),
        '' // this parameter is actually required (undefined isn't accepted)
      );
      /* eslint-enable no-underscore-dangle */
      return processActionsModule.exports;
    };

    const validateProcessUpload = req => {
      const err = new Error();
      err.status = 400;

      if (!req.body.actions) {
        err.message = 'missing actions';
        throw err;
      }

      if (!req.body.store || !req.body.store.url) {
        err.message = 'missing store url';
        throw err;
      }

      let processActions;
      try {
        processActions = parseProcessActions(req.body.actions);
      } catch (e) {
        console.error(`upload process: ${e}`);
        err.message = 'invalid actions';
        throw err;
      }

      if (!processActions.init || typeof processActions.init !== 'function') {
        err.message = 'missing init function';
        throw err;
      }

      return processActions;
    };

    const getStore = store => storeHttpClient(store.url);

    const getFossilizers = reqFossilizers => {
      let fossilizers = [];
      if (reqFossilizers) {
        fossilizers = reqFossilizers
          .map(f => {
            if (f.url) {
              return fossilizerHttpClient(f.url);
            }

            console.error('Fossilizer is missing url. Skipping...');
            return null;
          })
          .filter(f => f !== null);
      }

      return fossilizers;
    };

    const getPlugins = reqPlugins => {
      const activePlugins = agent.getActivePlugins();
      if (!activePlugins || !reqPlugins) {
        return [];
      }

      return reqPlugins
        .filter(({ id }) => activePlugins[id])
        .map(({ id }) => activePlugins[id]);
    };

    /**
     * @swagger
     * /{process}/upload:
     *   post:
     *     description: Dynamically uploads a new process to a running agent. This endpoint is only available when the agent is started with `enableProcessUpload` to true.
     *     parameters:
     *       - name: process
     *         in: path
     *         required: true
     *         type: string
     *       - in: body
     *         name: process
     *         required: true
     *         schema:
     *           type: object
     *           properties:
     *             store:
     *               description: Store used to save Segment of this process
     *               type: object
     *               properties:
     *                 url:
     *                   type: string
     *             fossilizers:
     *               description: List of fossilizers that should be used
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   url:
     *                     type: string
     *             plugins:
     *               description: List of plugins that should be used
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *     responses:
     *       200:
     *         description: Process created
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Process'
     *       400:
     *         description: Process already exists or actions are empty
     */
    app.post('/:process/upload', (req, res) => {
      const processActions = validateProcessUpload(req);
      const store = getStore(req.body.store);
      const fossilizers = getFossilizers(req.body.fossilizers);
      const plugins = getPlugins(req.body.plugins);

      agent.addProcess(req.params.process, processActions, store, fossilizers, {
        plugins: plugins
      });
      return agent.getAllProcesses().then(res.json.bind(res));
    });
  }

  /**
   * @swagger
   * /{process}/remove:
   *   get:
   *     description: Removes a process from an agent.
   *     parameters:
   *       - name: process
   *         in: path
   *         description: Name of the process to be removed
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Process removed
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Process'
   *       404:
   *         description: Process not found
   */
  app.get('/:process/remove', (req, res) =>
    agent.removeProcess(req.params.process).then(res.json.bind(res))
  );

  /**
   * @swagger
   * /{process}/segments:
   *   post:
   *     description: Creates a new map for a process.
   *     parameters:
   *       - name: process
   *         in: path
   *         description: Name of the process
   *         required: true
   *         type: string
   *       - in: body
   *         name: arguments
   *         description: Parameters that should be passed on to the init action
   *         schema:
   *           type: object
   *     responses:
   *       200:
   *         description: Map created
   *         schema:
   *           $ref: '#/definitions/Segment'
   *       404:
   *         description: Process not found
   */
  app.post(
    '/:process/segments',
    loadProcess,
    wrap((req, res) => {
      res.locals.renderErrorAsLink = true;

      return res.locals.process
        .createMap(...parseArgs(req.body))
        .then(res.json.bind(res));
    })
  );

  /**
   * @swagger
   * /{process}/segments/{linkHash}/{action}:
   *   post:
   *     description: Creates a new segment in a process.
   *     parameters:
   *       - name: process
   *         in: path
   *         description: Name of the process
   *         required: true
   *         type: string
   *       - name: linkHash
   *         in: path
   *         description: linkHash of the parent of the new Segment
   *         type: string
   *         required: true
   *       - name: action
   *         in: path
   *         description: Name of the action that will be executed
   *         type: string
   *         required: true
   *       - in: body
   *         name: arguments
   *         description: Parameters that should be passed on to the action
   *         schema:
   *           type: object
   *     responses:
   *       200:
   *         description: Segment created
   *         schema:
   *           $ref: '#/definitions/Segment'
   *       403:
   *         description: Action fordidden by a filter
   *       404:
   *         description: Process not found or parent Segment not found
   */
  app.post(
    '/:process/segments/:linkHash/:action',
    loadProcess,
    wrap((req, res) => {
      res.locals.renderErrorAsLink = true;

      return res.locals.process
        .createSegment(
          req.params.linkHash,
          req.params.action,
          ...parseArgs(req.body)
        )
        .then(res.json.bind(res));
    })
  );

  /**
   * @swagger
   * /{process}/segments/{linkHash}:
   *   get:
   *     description: Returns the segment with the given linkHash.
   *     parameters:
   *       - name: process
   *         in: path
   *         description: Name of the process
   *         required: true
   *         type: string
   *       - name: linkHash
   *         in: path
   *         description: linkHash of the parent of the new Segment
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: Segment
   *         schema:
   *           $ref: '#/definitions/Segment'
   *       404:
   *         description: Segment not found or Process not found
   *
   */
  app.get(
    '/:process/segments/:linkHash',
    loadProcess,
    wrap((req, res) =>
      res.locals.process
        .getSegment(req.params.linkHash)
        .then(res.json.bind(res))
    )
  );

  /**
   * @swagger
   * /{process}/segments:
   *   get:
   *     description: Finds the segments that match the given filter.
   *     parameters:
   *       - name: process
   *         in: path
   *         description: Name of the process
   *         required: true
   *         type: string
   *       - name: offset
   *         in: query
   *         description: Offset of first returned segment
   *         type: integer
   *       - name: limit
   *         in: query
   *         description: Limit number of returned segments
   *         type: integer
   *       - name: mapIds
   *         in: query
   *         description: Return segments with specified map ID
   *         type: array
   *         items:
   *           type: string
   *       - name: prevLinkHash
   *         in: query
   *         description: Return segments with specified previous link hash
   *         type: string
   *       - name: tags
   *         in: query
   *         description: Return segments that contain all the tags
   *         type: array
   *         items:
   *           type: string
   *       - name: linkHashes
   *         in: query
   *         description: Return segments that match one of the linkHashes
   *         type: array
   *         items:
   *           type: string
   *     responses:
   *       200:
   *         description: Segments
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Segment'
   *       404:
   *         description: Process not found
   */
  app.get(
    '/:process/segments',
    loadProcess,
    wrap((req, res) =>
      res.locals.process.findSegments(req.query).then(res.json.bind(res))
    )
  );

  /**
   * swagger
   * /{process}/maps:
   *   get:
   *     description: Returns a list of all the Map Ids from the given process.
   *     parameters:
   *       - name: process
   *         in: path
   *         description: Name of the process
   *         required: true
   *         type: string
   *       - name: offset
   *         description: Offset of first returned segment
   *         in: query
   *         type: integer
   *       - name: limit
   *         description: Limit number of returned segments
   *         in: query
   *         type: integer
   *     responses:
   *       200:
   *         description: List of Map IDs
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *       404:
   *         description: Process not found
   */
  app.get(
    '/:process/maps',
    loadProcess,
    wrap((req, res) =>
      res.locals.process.getMapIds(req.query).then(res.json.bind(res))
    )
  );

  app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    return next(err);
  });

  app.use(error());

  return app;
}
