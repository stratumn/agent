export default function (hash) {
  return `${hash.slice(0, 3)}${hash.slice(hash.length - 3)}`;
}
