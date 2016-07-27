import fromSegment from './fromSegment';
import deprecated from './deprecated';

export default function loadLink(obj) {
  deprecated('loadLink(obj)', 'fromSegment(obj)');

  return fromSegment(obj)
    .then(({ segment }) => segment);
}
