# Ember MapExplorer

[![build status](https://travis-ci.org/stratumn/ember-mapexplorer.svg?branch=master)](https://travis-ci.org/stratumn/ember-mapexplorer?branch=master)

Ember addon that provides map-explorer, a component that displays a Chain Map

## Installation

Install the ember-cli addon in your ember-cli project:

```
$ ember install ember-mapexplorer
```

This should automatically install ember-cli-sass.

If you want to take advantage of default styles you may add:

```
@import 'mapexplorer-core';
@import 'ember-mapexplorer';
```

in your `app/styles/app.scss`.

You can also override default variables.
 
## Usage

With an agent Url and a map ID:
```
{{map-explorer applicationUrl="http://localhost:4000" mapId="57743311d6a22a8f2bd2bec1"}}
```

With a chainscript (a JSON string or the array of segments as a POJO):
```
{{map-explorer chainscript=myChainscript}}
```
 
