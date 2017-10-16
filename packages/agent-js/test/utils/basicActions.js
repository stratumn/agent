export default {
  init(a, b, c) {
    this.append({ a, b, c });
  },
  action(d) {
    this.state.d = d;
    this.append();
  }
};
