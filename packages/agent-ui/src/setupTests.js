import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// This is necessary to get rid of the JSS polyfill warnings
import 'css.escape';

configure({ adapter: new Adapter() });
