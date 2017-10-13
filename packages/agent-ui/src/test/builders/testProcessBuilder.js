export class TestProcess {
  constructor(builder) {
    this.name = builder.name;
    this.processInfo = builder.processInfo;
    this.storeInfo = builder.storeInfo;
    this.fossilizersInfo = builder.fossilizersInfo;
  }

  static get Builder() {
    class Builder {
      constructor(name) {
        this.name = name;
        this.processInfo = { actions: {} };
        this.storeInfo = { adapter: {} };
        this.fossilizersInfo = [];
      }

      withAction(name, args) {
        this.processInfo.actions[name] = { args: args };
        return this;
      }

      withStoreAdapter(name, version, commit, description) {
        this.storeInfo.adapter = {
          name: name,
          version: version,
          commit: commit,
          description: description
        };
        return this;
      }

      withFossilizer(name, version, commit, description, blockchain) {
        this.fossilizersInfo.push({
          adapter: {
            name: name,
            version: version,
            commit: commit,
            description: description,
            blockchain: blockchain
          }
        });
        return this;
      }

      build() {
        return new TestProcess(this);
      }
    }

    return Builder;
  }
}
