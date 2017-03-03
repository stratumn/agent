# Indigo Explorer

A block explorer for the indigo blockchain.

## Demo & Examples

Live demo: [stratumn.github.io/indigoexplorer](http://Stratumn.github.io/indigoexplorer/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use indigo-explorer is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/indigo-explorer.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install indigo-explorer --save
```


## Usage

Include the react component in your application:

```
var IndigoExplorer = require('indigo-explorer');

// OR with ES6 import
import IndigoExplorer from 'react-mapexplorer';

<IndigoExplorer remote="localhost:46657"/>
```

If your application already uses a router, the indigo explorer can also be "mounted":

```
<Router history={browserHistory}>
	<Route path='/blockexplorer*' mount='/blockexplorer' component={IndigoExplorer} remote="localhost:46657"/>
</Router>
```

Note: the path should always end with * so that subroutes work. Make sure it doesn't conflict with your application.

### Properties

* `remote`: the address used to contact the Indigo Node (mandatory).
* `mount`: the mountpoint for the indigo explorer in your routing scheme (mandatory if included as a route).

## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).

## License

Copyright (c) 2017 Stratumn.

Unless otherwise noted, the source files are distributed under the Mozilla Public
License 2.0 found in the LICENSE file.
