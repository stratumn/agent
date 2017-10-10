/**
 * Creates a prototype chain.
 * @param {Object[]} propsArray an array of properties for the prototype chain
 * @returns {Object} an object with a prototype chain.
 */
export default function protoChain(...propsArray) {
  let prev = Object.prototype;

  propsArray.forEach(props => {
    function F() {
      Object.keys(props).forEach(key => {
        this[key] = props[key];
      });
    }
    F.prototype = prev;
    prev = new F();
  });

  return prev;
}
