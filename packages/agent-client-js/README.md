# Agent client for Javascript

[![Build Status](https://travis-ci.org/stratumn/agent-client-js.svg?branch=master)](https://travis-ci.org/stratumn/agent-client-js)
[![codecov](https://codecov.io/gh/stratumn/agent-client-js/branch/master/graph/badge.svg)](https://codecov.io/gh/stratumn/agent-client-js/branch/master)
[![Build Status](https://david-dm.org/stratumn/agent-client-js.svg?branch=master)](https://david-dm.org/stratumn/agent-client-js)

## Installation

### Browser

```html
<!-- Polyfill for browser compatibility -->
<script src="https://libs.stratumn.com/babel-polyfill.min.js"></script>
<!-- Actual Stratumn SDK -->
<script src="https://libs.stratumn.com/stratumn-agent-client.min.js"></script>
```

If you want a specific version, include `https://libs.stratumn.com/stratumn-agent-client-{version}.min.js` instead (for instance `https://libs.stratumn.com/stratumn-agent-client-1.0.2.min.js`).

### Node.js

```
$ npm install stratumn-agent-client
```

```javascript
var AgentClient = require('stratumn-agent-client');
```

## Quickstart

```javascript
AgentClient.getAgent('http://localhost:3000')
  .then(function(agent) {
    console.log(agent);
    // { processes: {
    //    firstProcess: {
    //      name: "first",
    //      processInfo: {...}
    //      storeInfo: {...}
    //    },
    //    secondProcess: {
    //      ...
    //    }
    //  }
    // }
    // Create a new map, you can pass arguments to init
    var firstProcess = agent.processes.firstProcess;
    return firstProcess.createMap('My conversation');
  })
  .then(function(segment) {
    // You can call an action like a regular function
    return segment.addMessage('Hello, World');
  })
  .then(function(segment) {
    console.log(segment.link);
    console.log(segment.meta);
  })
  .catch(function(err) {
    // Handle errors
  });
```

## Reference

### AgentClient#getAgent(url)

Returns a promise that resolves with an agent client.

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    console.log(agent);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### AgentClient#fromSegment(rawSegment)

Returns a promise that resolves with the agent and segment from a given raw object.

```javascript
AgentClient
  .fromSegment(someRawSegment)
  .then(function(res) {
    console.log(res.agent);
    console.log(res.segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Process#createMap(...args)

Returns a promise that resolves with a the first segment of a map.

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    return process.createMap('A new map');
  })
  .then(function(segment) {
    console.log(segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Process#getSegment(linkHash)

Returns a promise that resolves with an existing segment.

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    return process.getSegment('aee5427');
  })
  .then(function(segment) {
    console.log(segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Process#findSegments(opts)

Returns a promise that resolves with existing segments.

Available options are:

- `offset`: offset of first returned segments
- `limit`: limit number of returned segments, if -1 load all segments
- `batchSize`: size of each batch when loading all segments (default 20)
- `mapIds`: return segments with specified map ID
- `prevLinkHash`: return segments with specified previous link hash
- `tags`: return segments that contains all the tags (array)

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    return process.findSegments({ tags: ['tag1', 'tag2'], offset: 20, limit: 10 });
  })
  .then(function(segments) {
    console.log(segments);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Process#getMapIds(opts)

Returns a promise that resolves with existing map IDs.

Available options are:

- `offset`: offset of first returned map ID
- `limit`: limit number of returned map ID

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    return process.getMapIds({ offset: 20, limit: 10 });
  })
  .then(function(mapIDs) {
    console.log(mapIDs);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Segment#getPrev()

Returns a promise that resolves with the previous segment.

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    return process.getSegment('aee5427');
  })
  .then(function(segment) {
    return segment.getPrev();
  })
  .then(function(segment) {
    console.log(segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Segment#:actionName(...args)

Executes an action and returns a promise that resolves with a new segment.

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    return process.getSegment('aee5427');
  })
  .then(function(segment) {
    return segment.addMessage('Hello, World!');
  })
  .then(function(segment) {
    console.log(segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```

## Development

Install dependencies:

```
$ npm install
```

Build:

```
$ npm run build:all
```

Test:

```
$ npm test
```

Test coverage:

```
$ npm run test:cov
$ open coverage/lcov-report/index.html
```

Lint:

```
$ npm run lint
```

Lint and test:

```
$ npm run check
```

Bump version:

```
$ npm version major|minor|patch
```

Publish:

```
$ npm publish
```
