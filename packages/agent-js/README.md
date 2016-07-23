# Stratumn agent for NodeJS

This NodeJS module exposes functions to create Stratumn agents using Javascript.

## Creating an HTTP server for an agent

```javascript
var express = require('express');
var agent = require('stratumn-agent-js');

// Assumes your transition functions are in ./lib/transitions.
var transitions = require('./lib/transitions');

// The server is an Express server.
var app = express();

// Create an HTTP store client to save segments.
// Assumes an HTTP store server is available on env.STRATUMN_STORE_URL or http://store:5000.
var storeHttpClient = agent.storeHttpClient(process.env.STRATUMN_STORE_URL || 'http://store:5000');

app.disable('x-powered-by');

// Create an agent HTTP server from the transition functions and the store client.
var agentHttpServer = agent.httpServer(transitions, storeHttpClient);

// Mount agent on the root path of the server.
app.use('/', agentHttpServer);

// Start the server.
app.listen(3000, function() {
  console.log('Listening on :' + this.address().port);
});
```

## Advanced usage

- `httpServer` creates an HTTP server for an agent.
- `storeHttpClient` creates an instance to work with stores via HTTP.
- `agent` creates an instance to work directly with an agent without a server.
