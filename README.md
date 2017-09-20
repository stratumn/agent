[![Logo](logo.png)](https://indigoframework.com)

# Indigo

[Stratumn](https://stratumn.com)'s javascript libraries to create Indigo applications and networks.

[![build status](https://travis-ci.org/stratumn/indigo-js.svg?branch=master)](https://travis-ci.org/stratumn/indigo-js)
[![codecov](https://codecov.io/gh/stratumn/indigo-js/branch/master/graph/badge.svg)](https://codecov.io/gh/stratumn/indigo-js)

---

This repository contains javascript libraries to build [Proof of Process Networks](https://proofofprocess.org) using the [Indigo Framework](https://indigoframework.com).

To get started, visit the [Indigo Framework website](https://indigoframework.com) and download the [SDK](https://indigoframework.com/documentation/v0.0.8-dev/getting-started/install.html).

---

## Development

This multi-package repository (monorepo) is managed by [Lerna](https://github.com/lerna/lerna) to streamline development and testing of cross libraries changes. Make sure you've read Lerna documentation before starting.

Install dependencies:

```
npm install -g lerna
lerna bootstrap
```

Run tests:

```
lerna run test
```

Publish dependencies:

```
lerna publish
```

