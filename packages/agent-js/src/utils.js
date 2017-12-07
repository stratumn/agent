const base64ToUnicode = str => Buffer.from(str, 'base64').toString('utf8');

const base64ToHex = str => Buffer.from(str, 'base64').toString('hex');

module.exports = {
  base64ToHex,
  base64ToUnicode
};
