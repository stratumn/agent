# Stratumn SDK for Javascript

## Installation

### Browser

```html
<!-- Polyfill for browser compatibility -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.5.0/polyfill.min.js"></script>
<!-- Actual Stratumn SDK -->
<script src="https://d3tl9uzqhxq1a1.cloudfront.net/stratumn-sdk.min.js"></script>
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
