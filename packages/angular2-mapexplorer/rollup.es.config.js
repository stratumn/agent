import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
import rollupNG2 from './rollup-plugin-ng2';
let pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

export default {
  entry: 'src/map-explorer.module.ts',
  dest: pkg['jsnext:main'],
  format: 'es',
  sourceMap: true,
  plugins: [
    typescript(),
    rollupNG2()
  ],
  external: external
}