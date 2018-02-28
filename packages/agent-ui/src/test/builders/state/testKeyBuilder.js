/**
 * This data builder class allows tests to build process objects that look like
 * what the redux state will contain.
 */
export default class {
  constructor(key = {}) {
    this.type = key.type;
    this.secret = key.secret;
    this.public = key.public;
    this.status = key.status;
  }

  withType(type) {
    this.type = type;
    return this;
  }

  withPublic(pub) {
    this.public = pub;
    return this;
  }

  withSecret(secret) {
    this.secret = secret;
    return this;
  }

  withStatus(status) {
    this.status = status;
    return this;
  }

  build() {
    return {
      type: this.type,
      secret: this.secret,
      public: this.public,
      status: this.status
    };
  }
}
