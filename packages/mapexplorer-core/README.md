# MapExplorer Core

[![npm](https://img.shields.io/npm/v/@stratumn/mapexplorer-core.svg)](https://www.npmjs.com/package/@stratumn/mapexplorer-core)

Core library for building Map Explorer components.

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

```bash
npm install @stratumn/mapexplorer-core
```

```javascript
var MapexplorerCore = require('@stratumn/mapexplorer-core');

// or using es6
import {
  ChainTreeBuilder,
  defaultOptions,
  ChainTree,
  MerklePathTree,
  compactHash,
  parseChainscript
} from '@stratumn/mapexplorer-core'
```

## Usage

### Display a map explorer

```javascript
const builder = new MapexplorerCore.ChainTreeBuilder(element);

// with an agent URL and a mapId
builder.build({
  id: myMapId,
  agentUrl: myAgentUrl,
  process: myProcess
}, options);

// with a chainscript (JSON string of array or segment as POJO)
builder.build({
  chainscript: myChainscript
}), options;
```

#### Available options

##### withArgs

```javascript
Default: false
```

Display action arguments on the paths between segments.

##### duration

```javascript
Default: 750
```

Transition duration

##### verticalSpacing

```javascript
Default: 1.4
```

Vertical space factor between segment polygon

##### polygonSize

```javascript
Default:
    {
        width: 78,
        height: 91
    }
```

Object with width and height properties that gives the size (in pixels) of the polygon representing
a segment.

##### getArrowLength()

```javascript
Default: () => this.polygonSize.width
```

Function that returns the length (in pixels) of the transition arrow.

#### box

```javascript
Default:
    () => return {
        width: this.polygonSize.width,
        height: 25
    }
```

Function that return an object with width and height properties that gives the size (in pixels) of the box containing the
segment text.

##### getSegmentText(node)

```javascript
Default:  node => compactHash(node.data.meta.linkHash)
```

Function that returns the text displayed on a segment.

##### getLinkText(node)

```javascript
Default:
  function(node) {
    return node.target.data.link.meta.action +
        (this.withArgs ? `(${node.target.data.link.meta.inputs.join(', ')})` : '');
  }
```

Function that return the text displayed on a path between segments.

##### onclick(data)

```javascript
Default: noop
```

##### onTag(tag)

```javascript
Default: noop
```

Hook that is called when a segment is tagged

Event handler called when the user clicks on a segment.

### Display a merkle path tree

```javascript
const merklePathTree = new MapexplorerCore.MerklePathTree(element);
merklePathTree.display(merklePath);
```

where `merklePath` looks like:

```json
[
    {
      "left": "14b9468d3b8ca51b45e27ecddc5875a48902a74d1182fed9693c1531dfcfd56c",
      "right": "d15e1460234292852400271530be35cabe822eae5a4ed3376728d5acbbf04f27",
      "parent": "3bfbc00bfe7aa149e17029e8bb08671636c1c1c16aa5addfc307d6c937134620"
    },
    {
      "left": "3bfbc00bfe7aa149e17029e8bb08671636c1c1c16aa5addfc307d6c937134620",
      "right": "9fd68d3335eabcad5777b4c717af6de3c51f4aa0af72c26aaf866cde176c96f1",
      "parent": "8f16bfbe247be6ca881f3d9e462bc154f099298e26cd53662ef7119e1e60a887"
    },
    ...
]
```

## Development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build:all
```

Test:

```bash
npm test
```

The integration tests use a build version of the library. Make sure you've run `npm run build` if you want your changes to be taken into account.

Lint:

```bash
npm run lint
```

Lint and test:

```bash
npm run check
```

Bump version:

```bash
npm version major|minor|patch
```

Publish:

```bash
npm publish
```
