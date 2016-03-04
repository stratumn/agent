# Stratumn SDK for Javascript

## Installation

### Browser

```html
<!-- Polyfill for browser compatibility -->
<script src="https://libs.stratumn.com/babel-polyfill.min.js"></script>
<!-- Actual Stratumn SDK -->
<script src="https://libs.stratumn.com/stratumn-sdk.min.js"></script>
```

### Node.js

```
$ npm install stratumn-sdk
```

```javascript
var StratumnSDK = require('stratumn-sdk');
```

## Quickstart

```javascript
StratumnSDK.getApplication('quickstart')
  .then(function(app) {
    console.log(app);
    // Create a new chain, you can pass arguments to init
    return app.createChain('My message chain');
  })
  .then(function(res) {
    // You can call a transition function like a regular function
    return res.addMessage('Hello, World');
  })
  .then(function(res) {
    console.log(res.link);
    console.log(res.meta);
  })
  .catch(function(err) {
    // Handle errors
  });
```

## Reference

### StratumnSDK#getApplication(appName)

Returns a promise that resolves with an application.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    console.log(app.id);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Application#createChain(...args)

Returns a promise that resolves with a new chain.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    return app.createChain('A new chain');
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Application#getLink(hash)

Returns a promise that resolves with an existing link.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    return app.getLink('aee5427');
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Application#getChain(chainId, tags)

Returns a promise that resolves with the meta data of the links in a chain,
optionally filters by tags.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    return app.getChain('56ef33', ['tag1', 'tag2']);
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Application#getBranches(linkHash, tags)

Returns a promise that resolves with the meta data of the links whose previous hashes
are the given hash, optionally filters by tags.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    return app.getBranches('abcdef', ['tag1', 'tag2']);
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Link#getPrev()

Returns a promise that resolves with the previous link of a link.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    return app.getLink('aee5427');
  })
  .then(function(res) {
    return res.getPrev();
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Link#load()

Returns a promise that resolves with the full link.
Can be useful when you only have the meta data of links.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    return app.getBranches('aee5427');
  })
  .then(function(res) {
    return Promise.all(res.map(function() { return res.load(); }));
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Link#getBranches(tags)

Returns a promise that resolves with the meta data of the links whose previous hashes
are the hash of the link, optionally filters by tags.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    return app.getLink('aee5427');
  })
  .then(function(res) {
    return res.getBranches(['tag1']);
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    // Handle errors
  });
```

### Link#:transitionFunction(...args)

Executes a transition function and returns a promise that resolves with a new link.

```javascript
StratumnSDK
  .getApplication('quickstart')
  .then(function(app) {
    return app.getLink('aee5427');
  })
  .then(function(res) {
    return res.addMessage('Hello, World!');
  })
  .then(function(res) {
    console.log(res);
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
$ npm run test:coverage
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
