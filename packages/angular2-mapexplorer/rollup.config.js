import typescript from 'rollup-plugin-typescript';
import rollupNG2 from './rollup-plugin-ng2';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

export default {
  input: 'src/ng2-map-explorer.module.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  sourcemap: true,
  plugins: [typescript(), rollupNG2()],
  external: external,
  name: 'Angular2MapExplorer'
};
