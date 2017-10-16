# angular-mapexplorer

AngularJS directive to display a chainscript map.

[![npm](https://img.shields.io/npm/v/angular-mapexplorer.svg)](https://www.npmjs.com/package/angular-mapexplorer)

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




