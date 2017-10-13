export class TestState {
  constructor(builder) {
    this.agentInfo = builder.agentInfo;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.agentInfo = { processes: {} };
      }

      withProcess(process) {
        this.agentInfo.processes[process.name] = process;
        return this;
      }

      build() {
        return new TestState(this);
      }
    }

    return Builder;
  }
}
