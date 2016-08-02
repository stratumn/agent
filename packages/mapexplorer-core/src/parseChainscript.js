import { stratify } from 'd3-hierarchy';

export default function parseChainscript(chainscript) {
  return stratify()
      .id(d => d.meta.linkHash)
      .parentId(d => d.link.meta.prevLinkHash)(chainscript);
}
