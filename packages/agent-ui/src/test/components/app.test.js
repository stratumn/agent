import { createReactDOM } from '../../store';

describe('<App />', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    createReactDOM(div);
  });
});
