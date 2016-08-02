export default function mockFossilizerHttpServer(mock) {
  mock.get('http://localhost', () => ({
    status: 200,
    body: { name: 'mock' }
  }));

  mock.post('http://localhost/fossils', req => ({
    status: 200,
    body: req.body
  }));
}
