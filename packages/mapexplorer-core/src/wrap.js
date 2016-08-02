export default function wrap(arrayOrObject) {
  if (arrayOrObject instanceof Array) {
    return arrayOrObject;
  }
  return [arrayOrObject];
}
