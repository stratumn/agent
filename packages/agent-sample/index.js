import express from 'express';
import Agent from 'stratumn-agent';

import messageBoard from './lib/actions-message';
import warehouseTracker from './lib/actions-warehouse';

const { plugins } = Agent;

// Create an HTTP store client to save segments.
// Assumes an HTTP store server is available on env.STRATUMN_STORE_URL or http://store:5000.
const storeHttpClient = Agent.storeHttpClient(
  process.env.STRATUMN_STORE_URL || 'http://store:5000'
);

// Create an agent.
const agentUrl = process.env.STRATUMN_AGENT_URL || 'http://localhost:3000';
const agent = Agent.create({
  agentUrl: agentUrl
});

// Adds all processes from a name, its actions, the store client, and the fossilizer client.
// As many processes as one needs can be added.
// A different storeHttpClient and fossilizerHttpClient may be used.
agent.addProcess('message', messageBoard, storeHttpClient, null, {
  // plugins you want to use
  plugins: [plugins.agentUrl(agentUrl), plugins.actionArgs, plugins.stateHash]
});

agent.addProcess('warehouse', warehouseTracker, storeHttpClient, null, {
  // plugins you want to use
  plugins: [plugins.agentUrl(agentUrl), plugins.actionArgs, plugins.stateHash]
});

// Creates an HTTP server for the agent with CORS enabled.
const agentHttpServer = Agent.httpServer(agent, { cors: {} });

// Create the Express server.
const app = express();

app.disable('x-powered-by');

// Mount agent on the root path of the server.
app.use('/', agentHttpServer);

// Create server by binding app and websocket connection
const server = Agent.websocketServer(app, storeHttpClient);

// Start the server.
server.listen(3000, () => {
  console.log(`Listening on ${agentUrl}`);
});