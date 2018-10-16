# Stratumn agent for NodeJS

This NodeJS module exposes functions to create Stratumn agents using Javascript.

[![npm](https://img.shields.io/npm/v/@stratumn/agent.svg)](https://www.npmjs.com/package/@stratumn/agent)

Unless otherwise noted, the Stratumn Agent Javascript Library source files are distributed under the Apache License 2.0 found in the LICENSE file.

## Creating an HTTP server for an agent

```javascript
var express = require('express');
var Agent = require('@stratumn/agent');
var plugins = Agent.plugins;

// Load actions.
// Assumes your actions are in ./lib/actions.
var actions = require('./lib/actions');

// Creates an HTTP store client to save segments.
// Assumes an HTTP store server is available on env.STRATUMN_STORE_URL or http://store:5000.
var storeHttpClient = Agent.storeClientFactory.create(Agent.storeHttpClient, process.env.STRATUMN_STORE_URL || 'http://store:5000');

// Creates an HTTP fossilizer client to fossilize segments.
// Assumes an HTTP fossilizer server is available on env.STRATUMN_FOSSILIZER_URL or http://fossilizer:6000.
var fossilizerHttpClient = Agent.fossilizerClientFactory.create(Agent.fossilizerHttpClient, process.env.STRATUMN_FOSSILIZER_URL || 'http://fossilizer:6000');

// Creates an agent
var agent = Agent.create({
    agentUrl: 'http://localhost:3000',               // the agent needs to know its root URL,·
});

// Adds a process from a name, its actions, the store client, and the fossilizer client.
// As many processes as one needs can be added. A different storeHttpClient and fossilizerHttpClient may be used.
agent.addProcess("my_first_process", actions, storeHttpClient, fossilizerHttpClient, {
  plugins: [plugins.localTime]                     // pick any plugins from src/plugins or develop your own - order matters
});

// Creates an HTTP server for the agent with CORS enabled.
var agentHttpServer = Agent.httpServer(agent, { cors: {} });

// Create the Express server.
const app = express();
app.disable('x-powered-by');

// Mount agent on the root path of the server.
app.use('/', agentHttpServer);

// Create server by binding app and websocket connection
const server = Agent.websocketServer(app, storeHttpClient);

// Start the server
server.listen(3000, () => {
  console.log('Listening on ' + server.address().port);
});

// You can also add processes on-the-fly after the server has started listening
agent.addProcess("my_second_process", actions, storeHttpClient, fossilizerHttpClient, {
  plugins: [plugins.localTime]
});
```

The documentation for the HTTP API is available in [doc/swaggerDoc.md](doc/swaggerDoc.md). It uses [OpenAPI ver. 2](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) (fka Swagger). You can also use [doc/swagger.json](doc/swagger.json) with [Swagger UI](https://swagger.io/swagger-ui/) for instance:

```bash
docker run -p 8080:8080 -e SWAGGER_JSON=/opt/swagger.json -v $(pwd)/doc:/opt swaggerapi/swagger-ui
```

## Advanced usage

- `create` creates an agent instance.
- `storeHttpClient` creates an instance to work with stores via HTTP.
- `fossilizerHttpClient` creates an instance to work with fossilizers via HTTP.
- `httpServer` creates an app for the agent
- `websocketServer`bind websocket connection to app and returns server

## Plugins

An agent plugin enriches the content of a segment. It may implement four methods:

- `willCreate(link)` is called right before a transition function from the agent's actions. It takes the existing link as an argument. It should be updated in-place.
- `didCreateLink(link)` is called whenever a link has been created by a transition function. It takes the new link as an argument. It should be updated in-place.
- `filterSegment(segment)` is called when segments are retrieved by the agent from the underlying storage. It should return `true` if the plugins accepts the segment, `false` otherwise.

Filters are applied sequentially in the reverse order they are defined.

All methods are optional. They can either be synchronous or return a Promise.

### Available plugins

- `agentUrl`: Saves in segment meta the URL that can be used to retrieve a segment.
- `encryptedState`: Encrypts the state before the segment is saved. Filters out segment that cannot be decrypted.
- `localTime`: Saves the local timestamp in the link meta information.
- `stateHash`: Computes and adds the hash of the state in meta.

## Development

To regenerate the HTTP API documentation, run:

```bash
npm run swagger:generate
```
