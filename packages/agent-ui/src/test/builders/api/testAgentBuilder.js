/**
 * This data builder class allows tests to build an object that looks like
 * what the stratumn-agent's getAgent API will return.
 */
export default class {
  constructor() {
    this.processes = {};
  }

  withProcess(process) {
    this.processes[process.name] = process;
    return this;
  }

  build() {
    return {
      processes: this.processes
    };
  }
}
