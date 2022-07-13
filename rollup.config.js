// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
export default {
  input: 'wwwroot/main.js',
  output: {
    file: 'wwwroot/bundle.js',
    format: 'es',
  },
  plugins: [
    // Resolve bare module specifiers to relative paths
    resolve(),
  ],
};
