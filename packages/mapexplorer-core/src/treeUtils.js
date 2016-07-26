export function makeLink(source, target, margin = 0) {
  const finalTarget = target || source;
  const targetX = finalTarget.x;
  const targetY = finalTarget.y - margin;
  return `M${source.y},${source.x}
    C${(source.y + targetY) / 2},${source.x} ${(source.y + targetY) / 2},
    ${targetX} ${targetY},${targetX}`;
}

export function finalLink(d, margin) {
  return makeLink(d.source, d.target, margin);
}

export function translate(x, y) {
  return `translate(${y}, ${x})`;
}

export function stashPositions(nodes) {
  // Stash the old positions for transition.
  nodes.forEach(d => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
