import findSegments from './findSegments';
import deprecated from './deprecated';

export default function getMap(agent, mapId, tags = []) {
  deprecated('getMap(agent, mapId, tags = [])', 'findSegments(agent, filter)');

  return findSegments(agent, { mapId, tags });
}
