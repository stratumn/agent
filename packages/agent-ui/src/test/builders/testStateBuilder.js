export default class {
  constructor() {
    this.agentInfo = { processes: {} };
  }

  withProcess(process) {
    this.agentInfo.processes[process.name] = process;
    return this;
  }

  build() {
    return {
      agentInfo: this.agentInfo
    };
  }
}
