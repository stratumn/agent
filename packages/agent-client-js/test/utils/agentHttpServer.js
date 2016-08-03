import { memoryStore, create, httpServer } from 'stratumn-agent';

// Test actions
const actions = {

  init(title) {
    if (!title) {
      this.reject('a title is required');
      return;
    }

    this.state.title = title;
    this.state.messages = [];
    this.state.updatedAt = Date.now();
    this.meta.priority = 0;

    this.append();
  },

  addMessage(message, author) {
    if (!message) {
      this.reject('a message is required');
      return;
    }

    if (!author) {
      this.reject('an author is required');
      return;
    }

    this.state.messages.push({ message, author });
    this.state.updatedAt = Date.now();
    this.meta.priority++;

    this.append();
  },

  addTag(tag) {
    if (!tag) {
      this.reject('a tag is required');
      return;
    }

    this.meta.tags = this.meta.tags || [];
    this.meta.tags.push(tag);
    this.state.updatedAt = Date.now();
    this.meta.priority++;

    this.append();
  }
};

export default function agentHttpServer(port) {
  return new Promise(resolve => {
    const agent = create(actions, memoryStore(), null, { agentUrl: `http://localhost:${port}` });
    const server = httpServer(agent).listen(port, () => {
      const close = () => new Promise(done => server.close(done));
      resolve(close);
    });
  });
}
