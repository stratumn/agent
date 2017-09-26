import { dummyAgent, _agentHttpServer } from './agentHttpServer';

const port = 3333;
const agentUrl = `http://localhost:${port}`;
let agent = dummyAgent(port);
let closeServer;

beforeEach(() => {agent = dummyAgent(port);});
beforeEach(() => _agentHttpServer(agent, port).then(c => { closeServer = c; }));
afterEach(() => {closeServer();});

export default () => ({
  // 'agent object': [agent]
  'agent url': [agentUrl]
});
