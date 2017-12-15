import Agent from 'stratumn-agent';
import messageBoard from '../lib/actions-message';

describe('message board', () => {
  let map;

  beforeEach(() => {
    map = Agent.processify(messageBoard);
  });

  describe('#init()', () => {
    it('sets the state correctly', () =>
      map.init('Hello, World!').then(link => {
        link.state.title.should.be.exactly('Hello, World!');
      }));

    it('requires a title', () =>
      map
        .init()
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly('a title is required');
        }));
  });

  describe('#message()', () => {
    it('updates the state correctly', () =>
      map
        .init('Hello, World!')
        .then(() => map.message('Me', 'Hi'))
        .then(link => {
          link.state.should.deepEqual({ body: 'Hi', author: 'Me' });
        }));

    it('requires an author', () =>
      map
        .init('Hello, World!')
        .then(() => map.message())
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly('an author is required');
        }));

    it('requires a body', () =>
      map
        .init('Hello, World!')
        .then(() => map.message('Me'))
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly('a body is required');
        }));
  });
});
