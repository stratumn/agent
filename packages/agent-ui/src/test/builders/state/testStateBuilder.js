/**
 * This data builder class allows tests to build state objects that look like
 * what the redux state will contain.
 */
export default class {
  constructor() {
    this.agents = {};
    this.maps = {};
    this.segments = {};
    this.mapExplorer = {};
  }

  withAgent(name, agent) {
    this.agents[name] = agent;
    return this;
  }

  withSelectedMapExplorerSegment(linkHash) {
    this.mapExplorer = { linkHash: linkHash };
    return this;
  }

  build() {
    return {
      agents: this.agents,
      maps: this.maps,
      segments: this.segments,
      mapExplorer: this.mapExplorer
    };
  }
}
