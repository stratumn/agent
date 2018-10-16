# Stratumn Agent Sample

This project contains a sample [agent](https://github.com/stratumn/agent/tree/master/packages/agent)
It can be used to test Stratumn p2p networks without coding anything yourself.

## Docker images

This project provides two docker images:

- Dockerfile uses the latest dependencies published on npm
- Dockerfile.local uses the latest code (and can be used to experiment with local code changes)

## Configuration

You can use environment variables to configure your agent:

- STRATUMN_STORE_URL should contain the url of the store (usually <http://store:5000>)
- STRATUMN_AGENT_URL should contain the url of the agent (usually <http://localhost:3000>)
- If you want to use fossilizers, STRATUMN_FOSSILIZERS_URLS should contain a comma-separated list of fossilizer urls
