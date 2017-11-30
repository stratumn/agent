import sinon from 'sinon';

const lifecycleMethods = [
  'render',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

// This can be used to stub out a connected component that
// you do not need to test in anyway. This prevents you from
// needing to setup a mock store.
export default componentClass => {
  let originalProps = componentClass.propTypes;
  const stubMap = {};

  beforeEach(() => {
    // clear propTypes
    originalProps = componentClass.propTypes;
    componentClass.propTypes = {};
    // stub all of the lifecycle methods
    lifecycleMethods.forEach(method => {
      if (typeof componentClass.prototype[method] !== 'undefined') {
        stubMap[method] = sinon
          .stub(componentClass.prototype, method)
          .returns(null);
      }
    });
  });

  afterEach(() => {
    // restore propTypes
    componentClass.propTypes = originalProps;
    // restore lifecycle methods
    Object.keys(stubMap).forEach(method => {
      stubMap[method].restore();
    });
  });
};
