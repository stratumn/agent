import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

export default {
  sourcemap: true,
  input: 'src/index.js',
  name: 'StratumnAgentClient',
  plugins: [
    babel(
      Object.assign(
        {
          include: ['src/**']
        },
        babelrc()
      )
    ),
    json(),
    builtins(),
    nodeResolve({
      jsnext: true,
      browser: true,
      preferBuiltins: true
    }),
    commonjs({
      namedExports: {
        'node_modules/tweetnacl/nacl-fast.js': ['sign'],
        'node_modules/qs/lib/index.js': ['stringify'],
        'node_modules/jmespath/jmespath.js': ['search'],
        '../utils/lib/index.js': ['promiseWhile']
      }
    })
  ],
  output: {
    format: 'umd',
    file: 'dist/stratumn-agent-client.js'
  }
};
