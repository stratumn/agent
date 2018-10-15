# ChainScript Validator

Library for validating chainscript objects client-side.

[![npm](https://img.shields.io/npm/v/@stratumn/cs-validator.svg)](https://www.npmjs.com/package/@stratumn/cs-validator)

## Installation

### Browser

```html
<!-- Polyfill for browser compatibility -->
<script src="https://libs.stratumn.com/babel-polyfill.min.js"></script>
<!-- Actual Library -->
<script src="https://libs.stratumn.com/cs-validator.js"></script>
```

If you want a specific version, include `https://libs.stratumn.com/cs-validator{version}.js` instead (for instance `https://libs.stratumn.com/cs-validator-0.1.0.js`).

### Node.js

```bash
npm install @stratumn/cs-validator
```

```javascript
var StratumnCsValidator = require('@stratumn/cs-validator');

// or using es6
import { MapValidator, SegmentValidator } from '@stratumn/cs-validator';
```

## Usage

### Validate a chainscript segment

```javascript
new StratumnCsValidator.MapValidator(JSON.parse(chainscript)).validate()
```

Returns a Promise that resolves to an error object such as:

```javascript
{
      linkHash: [Promise, ...],
      stateHash: [Promise, ...],
      merklePath: [Promise, ...],
      fossil: [Promise, ...]
}
```

Each promise, in each array of each category resolves to an error string if an inconsistency has been detected. It resolves to null otherwise.

Errors can be retrieved with (for instance):

```javascript
Promise.all(errors.linkHash).
  then(err => err.filter(Boolean));
```

## Development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Test:

```bash
npm test
```

The integration tests use a build version of the library. Make sure you've run `npm run build` if you want your changes to be taken into account.
