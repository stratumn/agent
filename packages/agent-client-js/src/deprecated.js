export default function deprecated(oldFunc, newFunc) {
  if (!newFunc) {
    console.warn(`WARNING: ${oldFunc} is deprecated.`);
  } else {
    console.warn(`WARNING: ${oldFunc} is deprecated. Please use ${newFunc} instead.`);
  }
}
