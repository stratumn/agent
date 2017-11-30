import * as statusTypes from '../../../constants/status';

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
    this.appendSegment = {
      dialog: {
        show: false
      },
      request: {}
    };
    this.selectRefs = {
      show: false,
      refs: []
    };
  }

  withAgent(name, agent) {
    this.agents[name] = agent;
    return this;
  }

  withSelectedMapExplorerSegment(linkHash) {
    this.mapExplorer = { linkHash: linkHash };
    return this;
  }

  withAppendedSegment(linkHash) {
    this.appendSegment.request = {
      linkHash,
      status: statusTypes.LOADED
    };
    return this;
  }

  withSelectRefDialog() {
    this.selectRefs.show = true;
    return this;
  }

  withSelectedRef(ref) {
    this.selectRefs.refs.push(ref);
    return this;
  }

  build() {
    return {
      agents: this.agents,
      maps: this.maps,
      segments: this.segments,
      mapExplorer: this.mapExplorer,
      appendSegment: this.appendSegment,
      selectRefs: this.selectRefs
    };
  }
}
