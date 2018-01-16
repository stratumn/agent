import { expect } from 'chai';
import promiseWhile from './';

describe('promiseWhile', () => {
  it('loops sequentially', () => {
    const arg = {
      index: 0,
      res: []
    };
    const condition = ({ index }) => index < 10;
    const body = ({ index, res }) =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ res: [...res, index], index: index + 1 });
        }, 10);
      });

    return promiseWhile(condition, body, arg).then(({ res }) => {
      expect(res).to.have.lengthOf(10);
    });
  });
});
