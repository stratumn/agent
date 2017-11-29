import qs from 'qs';
import { matchPath } from 'react-router-dom';

export const stringify = s => qs.stringify(s, { arrayFormat: 'brackets' });

export const parse = o => qs.parse(o, { ignoreQueryPrefix: true });

export const parseAgentAndProcess = uri => {
  const match = matchPath(uri, { path: '/:agent/:process' });
  return match.params;
};
