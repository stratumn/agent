import request from 'superagent';
import mocker from 'superagent-mocker';
import fossilizerHttpClient from '../src/fossilizerHttpClient';
import mockFossilizerHttpServer from './utils/mockFossilizerHttpServer';

mockFossilizerHttpServer(mocker(request));

describe('FossilizerHttpClient', () => {
  describe('#getInfo()', () => {
    it('resolves with the fossilizer info', () =>
      fossilizerHttpClient('http://localhost')
        .getInfo()
        .then(body => body.should.deepEqual({ name: 'mock' }))
    );
  });

  describe('#fossilize()', () => {
    it('resolves with the response', () =>
      fossilizerHttpClient('http://localhost')
        .fossilize('Hello, World!', 'http://localhost:3333')
        .then(body => body.should.deepEqual({
          data: 'Hello, World!',
          callbackUrl: 'http://localhost:3333'
        }))
    );
  });
});
