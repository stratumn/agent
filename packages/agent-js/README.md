# Stratumn agent for NodeJS [ALPHA - incompatible with production]

This NodeJS module exposes functions to create Stratumn agents using Javascript.

[![Build Status](https://travis-ci.org/stratumn/agent-js.svg?branch=master)](https://travis-ci.org/stratumn/agent-js)
[![Build Status](https://david-dm.org/stratumn/agent-js.svg)](https://david-dm.org/stratumn/agent-js) 

Unless otherwise noted, the Stratumn Agent Javascript Library source files are distributed under the GNU GPLv3 found in the LICENSE file.

## Creating an HTTP server for an agent

```javascript
var express = require('express');
var Agent = require('stratumn-agent');

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
