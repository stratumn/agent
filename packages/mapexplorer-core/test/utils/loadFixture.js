export default function loadFixture(name) {
  return require(`../fixtures/${name}.json`);
}
