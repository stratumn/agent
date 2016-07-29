export default function parseIfJson(object) {
  if (typeof(object) !== 'object') {
    object = JSON.parse(object);
  }
  return object;
}
