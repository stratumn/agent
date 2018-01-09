import promiseWhile from '../src/promiseWhile';

describe('promiseWhile', () => {
  it('loops sequentially', () => {
    let index = 0;
    const res = [];
    const condition = () => index < 10;
    const body = () =>
      new Promise(resolve => {
        setTimeout(() => {
          res.push(index);
          index += 1;
          resolve();
        }, 10);
      });

    return promiseWhile(condition, body).then(() => {
      res.length.should.be.eql(10);
    });
  });
});
