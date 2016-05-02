import getApplication from '../src/getApplication';

describe('#linkify', () => {

  let first;

  beforeEach(() =>
    getApplication('sdk-test')
      .then(app =>
        app.getLink('9e16cda1745402d887ba89ccad3dc4bf9aafa86427aab2ca19bf42beb9d108ff')
      )
      .then(r => { first = r; })
  );

  it('adds functions for agent methods', () =>
    first
      .addMessage('Hello, World!')
      .then(res => {
        res.link.state.messages[0].content.should.be.exactly('Hello, World!');
        res.link.state.messages[0].author.should.be.exactly('Anonymous');
      })
  );

  describe('it adds a function to get the previous link', () => {

    it('resolves with null if first link', () =>
      first
        .getPrev()
        .then(res => {
          (res === null).should.be.exactly(true);
        })
    );

    it('resolves with the previous link if not the first link', () =>
      first
        .addMessage('Hello, World!')
        .then(res => res.getPrev())
        .then(res => {
          res.link.state.messages.length.should.be.exactly(0);
        })
    );

  });

  describe('it adds a function to load the full link', () => {

    it('resolve with a full link', () =>
      first
        .load()
        .then(res => {
          res.link.state.title.should.be.exactly('test');
        })
    );

  });

  describe('it adds a function to get the branches', () => {

    it('resolve with a full link', () =>
      first
        .getBranches(['test'])
        .then(res => {
          res.length.should.be.exactly(1);
        })
    );

  });

});
