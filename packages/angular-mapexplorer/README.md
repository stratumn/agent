# angular-mapexplorer

AngularJS 1.6 directive to display an Indigo Map Explorer

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

```html
<st-map-explorer chainscript="home.json" refresh="0"></st-map-explorer>
```

or

```html
<st-map-explorer agentUrl="home.agentUrl" map-id="home.mapId" process="home.process" options="{showTagColorConfiguration: true}"></st-map-explorer>
```

### Options

##### showTagColorConfiguration
```
Default: false
```

Display the tag color legend and allow configuration


#### onSegmentShow
```
Default: noop
```

Callback called when a segment content is displayed with the segment in argument

#### onSegmentHide
```
Default: noop
```

Callback called when a segment content is hidden

Plus all options inherited from [MapExplorer Core](https://github.com/stratumn/mapexplorer-core)

## Development

Build and launch demo app:

```
npm run build:demo
node docs/server.js
```

The application will be served at `localhost:3300`
