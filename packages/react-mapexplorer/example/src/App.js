import React, { Component } from 'react';

import { MapExplorer, DummyEvidence } from 'react-mapexplorer';

export default class App extends Component {
  render() {
    return (
      <div>
        <MapExplorer
          agentUrl="http://localhost:3000"
          mapId="17b1b775-a745-4c19-ae86-04272dc1fa3e"
          evidenceComponent={DummyEvidence}
          process="blah"
        />
      </div>
    );
  }
}
