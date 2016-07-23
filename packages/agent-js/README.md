# Stratumn agent for NodeJS

This NodeJS module exposes functions to create Stratumn agents using Javascript.

## Creating an HTTP server for an agent

```javascript
var express = require('express');
var Agent = require('stratumn-agent');

// Load transition functions.
// Assumes your transition functions are in ./lib/transitions.
var transitions = require('./lib/transitions');

// Create an HTTP store client to save segments.
// Assumes an HTTP store server is available on env.STRATUMN_STORE_URL or http://store:5000.
var storeHttpClient = Agent.storeHttpClient(process.env.STRATUMN_STORE_URL || 'http://store:5000');

// Create an agent from the transition functions and the store client.
var agent = Agent.create(transitions, storeHttpClient);

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
- `httpServer` creates an HTTP server for an agent.
