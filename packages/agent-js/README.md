# Stratumn agent for NodeJS [ALPHA - incompatible with production]

This NodeJS module exposes functions to create Stratumn agents using Javascript.

[![Build Status](https://travis-ci.org/stratumn/agent-js.svg?branch=master)](https://travis-ci.org/stratumn/agent-js)
[![codecov](https://codecov.io/gh/stratumn/agent-js/branch/master/graph/badge.svg)](https://codecov.io/gh/stratumn/agent-js)
[![Build Status](https://david-dm.org/stratumn/agent-js.svg)](https://david-dm.org/stratumn/agent-js)

Copyright 2017 Stratumn SAS

Unless otherwise noted, the Stratumn Agent Javascript Library source files are distributed under the Mozilla Public License 2.0 found in the LICENSE file.

## Creating an HTTP server for an agent

```javascript
var express = require('express');
var Agent = require('stratumn-agent');
var plugins = Agent.plugins;

// Load actions.
// Assumes your actions are in ./lib/actions.
var actions = require('./lib/actions');

// Create an HTTP store client to save segments.
// Assumes an HTTP store server is available on env.STRATUMN_STORE_URL or http://store:5000.
var storeHttpClient = Agent.storeHttpClient(process.env.STRATUMN_STORE_URL || 'http://store:5000');

// Create an HTTP fossilizer client to fossilize segments.
// Assumes an HTTP fossilizer server is available on env.STRATUMN_FOSSILIZER_URL or http://fossilizer:6000.
var fossilizerHttpClient = Agent.fossilizerHttpClient(process.env.STRATUMN_FOSSILIZER_URL || 'http://fossilizer:6000');

// Create an agent from the actions, the store client, and the fossilizer client.
var agent = Agent.create(actions, storeHttpClient, fossilizerHttpClient, {
  agentUrl: 'http://localhost:3000',               // the agent needs to know its root URL,
  salt: process.env.STRATUMN_SALT || Math.random() // change to a unique salt
  plugins: [plugins.localTime]                     // pick any plugins from src/plugins or develop your own - order matters
});

// Creates an HTTP server for the agent with CORS enabled.
var agentHttpServer = Agent.httpServer(agent, { cors: {} });

// Create the Express server.
var app = express();

app.disable('x-powered-by');

// Mount agent on the root path of the server.
app.use('/', agentHttpServer);

// Start the server.
app.listen(3000, function() {
  console.log('Listening on :' + this.address().port);
});
```

## Advanced usage

- `create` creates an agent instance.
- `storeHttpClient` creates an instance to work with stores via HTTP.
- `fossilizerHttpClient` creates an instance to work with fossilizers via HTTP.
- `httpServer` creates an HTTP server for an agent.

## Plugins

An agent plugin enriches the content of a segment. It may implement four methods:

- `willCreate(link)`
is called right before a transition function from the agent's actions. It takes the existing link as an argument. It should be updated in-place.

- `didCreateLink(link)`
is called whenever a link has been created by a transition function. It takes the new link as an argument. It should be updated in-place.

- `didCreateSegment(segment)`
is called whenever a new segment has been computed from a new link. It take the new segment as an argument. It should be updated in-place. At this point the `linkHash` has already been computed so the `link` part should *not* be updated. Should it be the case sanity checks on the segment would fail.

- `filterSegment(segment)`
is called when segments are retrieved by the agent from the underlying storage. It should return `true` if the plugins accepts the segment, `false` otherwise.
Filters are applied sequentially in the reverse order they are defined.

All methods are optional. They can either be synchronous or return a Promise.

### Available plugins:

- `actionArgs`: Saves the action and its arguments in link meta information.
- `agentUrl`: Saves in segment meta the URL that can be used to retrieve a segment.
- `encryptedState`: Encrypts the state before the segment is saved. Filters out segment that cannot be decrypted.
- `localTime`: Saves the local timestamp in the link meta information.
- `signedState`: Signs the state before the segment is saved. Filters out segments whose signature is invalid.
- `stateHash`: Computes and adds the hash of the state in meta.
