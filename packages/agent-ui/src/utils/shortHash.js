export default function(hash) {
  return hash.length > 12
    ? `${hash.substr(0, 8)}..${hash.substr(hash.length - 2)}`
    : hash;
}
