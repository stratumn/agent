import d3 from 'd3';

export default function parseChainscript(chainscript) {
  return d3.stratify()
      .id(d => d.meta.linkHash)
      .parentId(d => d.link.meta.prevLinkHash)(chainscript);
}
