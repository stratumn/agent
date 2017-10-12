import { createReactDOM } from '../store';

it('renders without crashing', () => {
  const div = document.createElement('div');
  createReactDOM(div);
});
