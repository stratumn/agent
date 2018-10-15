/*
  Copyright 2018 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import storeHttpClient from '../src/storeHttpClient';
import { storeClientFactory } from '../src/clientFactory';

describe('storeClientFactory', () => {
  describe('#getAvailableClients()', () => {
    beforeEach(() => {
      storeClientFactory.clearAvailableClients();
    });

    it('tracks fossilizer clients that are created', () => {
      storeClientFactory.create(storeHttpClient, 'http://fossilizer1:6000');
      storeClientFactory.create(storeHttpClient, 'http://fossilizer2:6001');

      storeClientFactory.getAvailableClients().length.should.be.exactly(2);
      storeClientFactory
        .getAvailableClients()[0]
        .url.should.be.exactly('http://fossilizer1:6000');
      storeClientFactory
        .getAvailableClients()[1]
        .url.should.be.exactly('http://fossilizer2:6001');
    });

    it('does not create duplicate fossilizers for the same url', () => {
      const storeClient1 = storeClientFactory.create(
        storeHttpClient,
        'http://fossilizer:6000'
      );
      const storeClient2 = storeClientFactory.create(
        storeHttpClient,
        'http://fossilizer:6000'
      );

      storeClientFactory.getAvailableClients().length.should.be.exactly(1);
      storeClient1.should.equal(storeClient2);
    });
  });
});
