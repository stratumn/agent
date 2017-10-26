/**
 * This data builder class allows tests to build state objects that look like
 * what the redux state will contain.
 */
export default class {
  constructor() {
    this.agents = {};
    this.maps = {};
    this.segments = {};
  }

  withAgent(name, agent) {
    this.agents[name] = agent;
    return this;
  }

  build() {
    return {
      agents: this.agents,
      maps: this.maps,
      segments: this.segments
    };
  }
}
