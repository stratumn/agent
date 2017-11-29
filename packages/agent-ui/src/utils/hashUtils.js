export const shortHash = hash =>
  hash.length > 12
    ? `${hash.substr(0, 8)}..${hash.substr(hash.length - 2)}`
    : hash;

export const validateHash = hash => /^[a-zA-Z0-9]{64}$/.test(hash);
