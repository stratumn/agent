# MapExplorer Core

[![build status](https://travis-ci.org/stratumn/mapexplorer-core.svg?branch=master)](https://travis-ci.org/stratumn/mapexplorer-core.svg?branch=master)

Core library for building Map Explorer components

## Installation

### Browser

```html
<!-- Polyfill for browser compatibility -->
<script src="https://libs.stratumn.com/babel-polyfill.min.js"></script>
<!-- Actual Library -->
<script src="https://libs.stratumn.com/mapexplorer-core.min.js"></script>
```

If you want a specific version, include `https://libs.stratumn.com/mapexplorer-core-{version}.min.js` instead (for instance `https://libs.stratumn.com/mapexplorer-core-0.4.1.min.js`).


### Node.js

```
$ npm install mapexplorer-core
```

```javascript
var MapexplorerCore = require('mapexplorer-core');
```

### Bower

```
$ bower install mapexplorer-core
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
