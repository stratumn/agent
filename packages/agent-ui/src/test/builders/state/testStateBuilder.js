import * as statusTypes from '../../../constants/status';

/**
 * This data builder class allows tests to build state objects that look like
 * what the redux state will contain.
 */
export default class {
  constructor() {
    this.agents = {};
    this.key = null;
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
    this.notifications = [];
  }

  withAgent(name, agent) {
    this.agents[name] = agent;
    return this;
  }

  withKey(key) {
    this.key = key;
    return this;
  }

  withSelectedMapExplorerSegment(linkHash, processName) {
    this.mapExplorer = { linkHash, processName };
    return this;
  }

  withAppendedSegment() {
    this.appendSegment.request = {
      status: statusTypes.LOADED
    };
    return this;
  }

  withNotifications(notifs) {
    this.notifications.push(...notifs);
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

  withSegment(segment) {
    if (!this.segments.details) {
      this.segments.details = [];
    }
    this.segments.details.push(segment);
    return this;
  }

  build() {
    return {
      agents: this.agents,
      key: this.key,
      maps: this.maps,
      segments: this.segments,
      mapExplorer: this.mapExplorer,
      appendSegment: this.appendSegment,
      selectRefs: this.selectRefs,
      notifications: this.notifications
    };
  }
}
