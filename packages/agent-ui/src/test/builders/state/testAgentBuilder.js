/**
 * This data builder class allows tests to build agent objects that look like
 * what the redux state will contain.
 */
export default class {
  constructor() {
    this.status = '';
    this.url = '';
    this.error = null;
    this.processes = {};
  }

  withStatus(status) {
    this.status = status;
    return this;
  }

  withUrl(url) {
    this.url = url;
    return this;
  }

  withError(error) {
    this.error = error;
    return this;
  }

  withProcess(process) {
    this.processes[process.name] = process;
    return this;
  }

  build() {
    return {
      status: this.status,
      url: this.url,
      error: this.error,
      processes: this.processes
    };
  }
}
