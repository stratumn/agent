import co from 'co';

const makeLoop = (condition, body) =>
  function* loop() {
    while (condition()) yield body();
  };

export default (condition, body) => co(makeLoop(condition, body));
