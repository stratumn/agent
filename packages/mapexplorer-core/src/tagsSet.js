import flatten from './flatten';

export default function tagsSet(chainscript) {
  return new Set(flatten(chainscript.map(segment => segment.link.meta.tags)));
}
