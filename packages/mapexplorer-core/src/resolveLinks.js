import merge from 'deepmerge';
import { loadLink } from 'stratumn-sdk';

export default function resolveLinks(segments) {
  return Promise.all(segments.map(segment => {
    if (!segment.link.state) {
      return loadLink(segment).then(res => merge(res, segment));
    }
    return Promise.resolve(segment);
  }));
}
