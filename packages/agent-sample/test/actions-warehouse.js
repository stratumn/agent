import Agent from 'stratumn-agent';
import warehouseTracker from '../lib/actions-warehouse';

describe('warehouse tracker', () => {
  let map;

  beforeEach(() => {
    map = Agent.processify(warehouseTracker);
  });

  describe('#init()', () => {
    it('sets the state correctly', () =>
      map.init('area51').then(link => {
        link.state.warehouse.should.be.exactly('area51');
      }));

    it('requires a warehouse', () =>
      map
        .init()
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly('a warehouse is required');
        }));
  });

  describe('#storeItem()', () => {
    it('updates the state correctly', () =>
      map
        .init('area51')
        .then(() => map.storeItem('42', 'important item'))
        .then(link => {
          link.state.items['42'].description.should.be.exactly(
            'important item'
          );
        }));

    it('does not allow duplicate items', () =>
      map
        .init('area51')
        .then(() => map.storeItem('42', 'important item'))
        .then(() => map.storeItem('42', 'is it really important?'))
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly(
            'this item is already inside the warehouse'
          );
        }));
  });

  describe('#enter()', () => {
    it('records employee', () =>
      map
        .init('area51')
        .then(() => map.enter('batman'))
        .then(link => {
          const batmanActivity = link.state.employees.batman;
          batmanActivity.length.should.be.exactly(1);
        }));
  });

  describe('#leave()', () => {
    it('records employee', () =>
      map
        .init('area51')
        .then(() => map.enter('batman'))
        .then(() => map.leave('batman'))
        .then(link => {
          const batmanActivity = link.state.employees.batman;
          batmanActivity.length.should.be.exactly(2);
          batmanActivity[1].activity.should.be.exactly('leave');
        }));
  });
});
