# angular-mapexplorer

AngularJS directive to display a chainscript map.

[![npm version](https://badge.fury.io/js/angular-mapexplorer.svg)](https://badge.fury.io/js/angular-mapexplorer)
[![Bower version](https://badge.fury.io/bo/angular-mapexplorer.svg)](https://badge.fury.io/bo/angular-mapexplorer)
[![build status](https://travis-ci.org/stratumn/angular-mapexplorer.svg?branch=master)](https://travis-ci.org/stratumn/angular-mapexplorer.svg?branch=master)

## Demo
http://stratumn.github.io/angular-mapexplorer/

## Install

### Bower

```
$ bower install angular-mapexplorer
```

### npm

```
$ npm install angular-mapexplorer
```

You might also need `tinycolor.js` and `angular-drop`.


## Usage

```
<st-map-explorer chainscript="home.json" refresh="0" name=" 'my-chain-explorer' "></st-map-explorer>
```

or

```
<st-map-explorer application="home.application" map-id="home.mapId" options="{zoomable: true}"></st-map-explorer>
```

### Options

##### zoomable
```
Default: false
```

Make the map zoomable.

##### showTagColorConfiguration
```
Default: false
```

Display the tag color legend and allow configuration




