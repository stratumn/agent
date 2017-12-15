export default {
  /**
    * Initialize a message board.
    * @param {string} title - name or identifier of the message board
    */
  init(title) {
    console.log('init called');
    if (!title) {
      return this.reject('a title is required');
    }

    this.state = {
      title: title
    };

    return this.append();
  },

  /**
    * Post a message on the message board.
    * @param {string} author - name of the author
    * @param {string} body - body of the message
    */
  message(author, body) {
    if (!author) {
      return this.reject('an author is required');
    }

    if (!body) {
      return this.reject('a body is required');
    }

    this.state = {
      body: body,
      author: author
    };

    return this.append();
  }
};
