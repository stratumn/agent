# react-mapexplorer

A react component used to display a Map Explorer from chainscript.

[![npm](https://img.shields.io/npm/v/@stratumn/react-mapexplorer.svg)](https://www.npmjs.com/package/@stratumn/react-mapexplorer)

## Installation

```bash
npm install @stratumn/react-mapexplorer --save
```

### Local Development

Now you're ready to run a local version of rollup that will watch your `src/` component and automatically recompile it into `dist/` whenever you make changes.

We'll also be running our `example/` create-react-app that's linked to the local version of your `react-mapexplorer` module.

```bash
# run example to start developing your new component against
npm link # the link commands are important for local development
npm install # disregard any warnings about missing peer dependencies
npm start # runs rollup with watch flag

# (in another tab, run the example create-react-app)
cd example
npm link @stratumn/react-mapexplorer
npm install
npm start # runs create-react-app hot-reload dev server
```

Now, anytime you make a change to your component in `src/` or to the example application's `example/src`, `create-react-app` will live-reload your local dev server so you can iterate on your component in real-time.

## License

Copyright 2017 Stratumn SAS. All rights reserved.

Unless otherwise noted, the source files are distributed under the Apache
License 2.0 found in the LICENSE file.
