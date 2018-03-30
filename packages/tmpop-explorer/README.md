# TMPop Explorer

A block explorer for Indigo's Tendermint Store.

[![npm](https://img.shields.io/npm/v/@indigocore/tmpop-explorer.svg)](https://www.npmjs.com/package/@indigocore/tmpop-explorer)

## Installation

```
npm install --save @indigocore/tmpop-explorer
```


## Local Development

You should first run a local version of rollup that will watch your `src/` component and automatically recompile it into `lib/` whenever you make changes.

We'll also be running our `app/` create-react-app that's linked to the local version of your `tmpop-explorer` module.

```bash
yarn link # the link commands are important for local development
yarn start # runs rollup with watch flag

# (in another tab, run the app)
cd app
yarn link @indigocore/tmpop-explorer
yarn
yarn start # runs create-react-app hot-reload dev server
```

Now, anytime you make a change to your component in `src/` or to the application's `app/src`, `create-react-app` will live-reload your local dev server so you can iterate on your component in real-time.


## Installation

The easiest way to use tmpop-explorer is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

```
yarn install @indigocore/tmpop-explorer
```


## Usage

Include the react component in your application:

```
var TMPopExplorer = require('@indigocore/tmpop-explorer');

// OR with ES6 import
import TMPopExplorer from '@indigocore/tmpop-mapexplorer';

<TMPopExplorer remote="localhost:46657"/>
```

If your application already uses a router, the tmpop explorer can also be "mounted":

```
<Router history={browserHistory}>
	<Route path='/blockexplorer*' mount='/blockexplorer' component={TMPopExplorer} remote="localhost:46657"/>
</Router>
```

Note: the path should always end with * so that subroutes work. Make sure it doesn't conflict with your application.

### Properties

* `remote`: the address used to contact the Indigo Node (mandatory).
* `mount`: the mountpoint for the tmpop explorer in your routing scheme (mandatory if included as a route).

## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `lib`, which can be included without the need for any build system.

## License

Copyright 2017 Stratumn SAS. All rights reserved.

Unless otherwise noted, the TMPop Explorer source files are distributed under the Apache License 2.0 found in the LICENSE file.
