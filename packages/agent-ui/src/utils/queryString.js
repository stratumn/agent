import qs from 'qs';

export const stringify = s => qs.stringify(s, { arrayFormat: 'brackets' });

export const parse = o => qs.parse(o, { ignoreQueryPrefix: true });
