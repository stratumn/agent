import co from 'co';

const makeLoop = (condition, body, firstArg) =>
  function* loop() {
    let arg = firstArg;
    while (condition(arg)) {
      arg = yield body(arg);
    }
    return arg;
  };

export default (condition, body, firstArg = null) =>
  co(makeLoop(condition, body, firstArg));
