/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

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
