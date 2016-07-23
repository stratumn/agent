# Stratumn SDK for Javascript

## Installation

### Browser

```html
<!-- Polyfill for browser compatibility -->
<script src="https://libs.stratumn.com/babel-polyfill.min.js"></script>
<!-- Actual Stratumn SDK -->
<script src="https://libs.stratumn.com/stratumn-sdk.min.js"></script>
```

If you want a specific version, include `https://libs.stratumn.com/stratumn-sdk-{version}.min.js` instead (for instance `https://libs.stratumn.com/stratumn-sdk-0.4.1.min.js`).

### Node.js

```
$ npm install stratumn-sdk
```

```javascript
var StratumnSDK = require('stratumn-sdk');
```

## Quickstart

```javascript
StratumnSDK.getAgent('http://localhost:5000')
  .then(function(agent) {
    console.log(agent);
    // Create a new map, you can pass arguments to init
    return agent.createMap('My conversation');
  })
  .then(function(segment) {
    // You can call a transition function like a regular function
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

### StratumnSDK#getAgent(url)

Returns a promise that resolves with an agent client.

```javascript
StratumnSDK
  .getAgent('http://localhost:5000')
  .then(function(agent) {
    console.log(agent);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Agent#createMap(...args)

Returns a promise that resolves with a the first segment of a map.

```javascript
StratumnSDK
  .getAgent('quickstart')
  .then(function(agent) {
    return agent.createMap('A new map');
  })
  .then(function(segment) {
    console.log(segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Agent#getSegment(linkHash)

Returns a promise that resolves with an existing segment.

```javascript
StratumnSDK
  .getAgent('quickstart')
  .then(function(agent) {
    return app.getSegment('aee5427');
  })
  .then(function(segment) {
    console.log(segment);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Agent#findSegments(opts)

Returns a promise that resolves with existing segments.

Available options are:

- `offset`: offset of first returned segments
- `limit`: limit number of returned segments
- `mapId`: return segments with specified map ID
- `prevLinkHash`: return segments with specified previous link hash
- `tags`: return segments that contains all the tags (array)

```javascript
StratumnSDK
  .getAgent('quickstart')
  .then(function(agent) {
    return agent.findSegments({ tags: ['tag1', 'tag2'], offset: 20, limit: 10 });
  })
  .then(function(segments) {
    console.log(segments);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Agent#getMapIds(opts)

Returns a promise that resolves with existing map IDs.

Available options are:

- `offset`: offset of first returned map ID
- `limit`: limit number of returned map ID

```javascript
StratumnSDK
  .getAgent('quickstart')
  .then(function(agent) {
    return agent.findSegments({ offset: 20, limit: 10 });
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
StratumnSDK
  .getAgent('quickstart')
  .then(function(agent) {
    return agent.getSegment('aee5427');
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

### Segment#:transitionFunction(...args)

Executes a transition function and returns a promise that resolves with a new segment.

```javascript
StratumnSDK
  .getAgent('quickstart')
  .then(function(agent) {
    return agent.getSegment('aee5427');
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
