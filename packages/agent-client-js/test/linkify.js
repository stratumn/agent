import getApplication from '../src/getApplication';

describe('#linkify', () => {

  let first;

  beforeEach(() =>
    getApplication('quickstart')
      .then(app =>
        app.getLink('338183e36e024b0f0370e93a1e54d424a584599cac8b08d7abd758eaabd8bcf7')
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

});
