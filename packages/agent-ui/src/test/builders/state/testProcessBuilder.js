/**
 * This data builder class allows tests to build process objects that look like
 * what the redux state will contain.
 */
export default class {
  constructor(name) {
    this.name = name;
    this.actions = {};
    this.store = {};
    this.fossilizers = [];
  }

  withAction(name, args) {
    this.actions[name] = { args: args };
    return this;
  }

  withStore(name, version, commit, description) {
    this.store = {
      name: name,
      version: version,
      commit: commit,
      description: description
    };
    return this;
  }

  withFossilizer(name, version, commit, description, blockchain) {
    this.fossilizers.push({
      name: name,
      version: version,
      commit: commit,
      description: description,
      blockchain: blockchain
    });
    return this;
  }

  build() {
    return {
      name: this.name,
      actions: this.actions,
      store: this.store,
      fossilizers: this.fossilizers
    };
  }
}
