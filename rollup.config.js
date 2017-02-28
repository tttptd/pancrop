import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'scripts/app.js',
    dest: 'bundle/app.min.js',
    format: 'iife',
    // sourceMap: 'inline',
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        uglify(),
    ],
};
