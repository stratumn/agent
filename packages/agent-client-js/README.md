# Agent client for Javascript

[![npm](https://img.shields.io/npm/v/@indigoframework/client.svg)](https://www.npmjs.com/package/@indigoframework/client)

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
$ npm install @indigoframework/client
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

Returns a promise that resolves with an agent client targetting the agent server available at `url`.

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

### AgentClient#getAgent(obj)

Returns a promise that resolves with an agent client targetting the agent object created previously.

```javascript
const agentObj = create();
AgentClient
  .getAgent(agentObj)
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

### Agent#getProcesses()

Returns the list of all processes.

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(agent => agent.getProcesses())
  .then(processes => {
    processes.forEach(element => {
      console.log(`agent.getProcesses(): ${element.name} => ${element}`);
    }, this);
  }))
  .catch(function(err) {
    // Handle errors
  });
```

### Agent#getProcess(name)

Returns the named process described in agent.

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.getProcess('first_process');
    console.log(`agent.getProcess(): ${process.name}`);
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

    // you could also have added references to the first segment:
    // return process.withRefs('abc123').createMap('A new map, with references');
  })
  .then(function(segment) {
    console.log(segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```
### Process#withKey(...args)

Attach a key to a process. This is needed whenever one wants to send signatures when creating a map or appending a segment.

```javascript
// the secret key must be stored in a secure location
const key = {
  type: 'ed25519' // the signature scheme, 'ed25519' is currently the only option
  secret: 'YOURBASE64ENCODEDPRIVATEKEY' // a 64-bytes private key encoded in base64 
}

AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    return process
      .withKey(key)
      .sign()
      .createMap('A new map');

    // you could also have added references to the first segment:
    // return process.withKey(key).sign({refs: true}).withRefs('abc123').createMap('A new map, with references');
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

Returns a promise that resolves with existing segments and other info related to pagination.

Available options are:

- `offset`: offset of first returned segments
- `limit`: limit number of returned segments, if -1 load all segments
- `batchSize`: size of each batch when loading all segments (default 20)
- `mapIds`: return segments with specified map ID
- `prevLinkHash`: return segments with specified previous link hash
- `linkHashes`: return segments that match one of the linkHashes (array)
- `tags`: return segments that contain all the tags (array)

```javascript
AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    return process.findSegments({ tags: ['tag1', 'tag2'], offset: 20, limit: 10 });
  })
  .then(function(results) {
    console.log(results.segments);
    console.log(results.hasMore);
    console.log(results.offset);
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
    // you can also add references to a new segment
    return segment.withRefs('acee2427').addMessage('Hello, World, with References!');
  })
  .then(function(segment) {
    // you can also add signatures to a new segment
    // calling sign() without argument will create a signature of the prevLinkHash, references, the action and its inputs.
    // a key is needed to create a signature, it should be attached to the process, the current segment or any previous one (see example below).
    return segment.withKey(someKey).sign().addMessage('Hello, World, with Signatures!');
  })
  .then(function(segment) {
    console.log(segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Segment#:sign(key)

Specifies the properties of the segment that should be signed

```javascript
// the secret key must be stored in a secure location
const key = {
  type: 'ed25519' // the signature scheme, 'ed25519' is currently the only option
  secret: 'YOURBASE64ENCODEDPRIVATEKEY' // a 64-bytes private key encoded in base64 
}

AgentClient
  .getAgent('http://localhost:3000')
  .then(function(agent) {
    const process = agent.processes.firstProcess;
    // attach a key to the process to be able to send signatures
    return process
      .withKey(key)
      .getSegment('aee5427');
  })
  .then(function(segment) {
    // you can specify which properties you wish to sign (prevLinkHash, action, inputs, references). By default, all 4 are signed when calling sign() without argument.
    // Here we don't have to call withKey() on the segment since the key is alredy attached to the process.
    return segment.sign({prevLinkHash: true, inputs: true}).addMessage('Hello, World!');
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
$ npm run build
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
