import qs from 'qs';
import { matchPath } from 'react-router-dom';

export const stringify = s => qs.stringify(s, { arrayFormat: 'brackets' });

export const parse = o => qs.parse(o, { ignoreQueryPrefix: true });

/**
 * Returns an object containing agent and process keys
 * from a uri.
 * @param {string} uri 
 */
export const parseAgentAndProcess = uri => {
  const checkUri = uri[0] === '/' ? uri : `/${uri}`;
  const match = matchPath(checkUri, { path: '/:agent/:process' });
  if (!match || !match.params) {
    return {
      agent: undefined,
      process: undefined
    };
  }
  return match.params;
};
