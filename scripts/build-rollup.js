import path from 'path';
import fse from 'fs-extra';
import { rollup } from 'rollup';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import swc from 'rollup-plugin-swc3';
import terser from '@rollup/plugin-terser';
import { getArguments, getMetrics } from './utils.js';

const SUPPORTED_PRESETS = {
  babel: 'babel',
  esbuild: 'esbuild',
  swc: 'swc',
};

const resolvePlugins = (preset) => {
  switch (preset) {
    case SUPPORTED_PRESETS.babel:
      return [
        babel({
          babelHelpers: 'bundled',
          exclude: /node_modules/,
          extensions: ['.jsx', '.ts', '.tsx'],
          presets: [['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
        }),
        terser({
          format: {
            comments: false,
          },
        }),
      ];
    case SUPPORTED_PRESETS.esbuild:
      return [
        esbuild({
          exclude: /node_modules/,
          minify: true,
          target: ['es2015'],
          jsx: 'automatic',
        }),
      ];
    case SUPPORTED_PRESETS.swc:
      return [
        swc({
          exclude: /node_modules/,
          minify: true,
          jsc: {
            target: 'es2015',
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        }),
      ];
  }
};

(async () => {
  try {
    const { project, preset = SUPPORTED_PRESETS.babel, entrypoint = 'src/index.tsx' } = getArguments();

    if (!project || !fse.pathExistsSync(`./projects/${project}`)) {
      throw new Error('Invalid project');
    } else if (!Object.values(SUPPORTED_PRESETS).includes(preset)) {
      throw new Error('Unsupported preset');
    } else if (!fse.pathExistsSync(`./projects/${project}/${entrypoint}`)) {
      throw new Error(`Invalid entrypoint ${entrypoint}`);
    }

    const buildPaths = {
      appEntrypoint: `./projects/${project}/${entrypoint}`,
      appBuild: './builds/build-rollup',
    };

    await fse.emptydir(buildPaths.appBuild);

    const startTime = Date.now();

    const bundler = await rollup({
      input: buildPaths.appEntrypoint,
      output: {
        file: path.join(buildPaths.appBuild, 'index.js'),
        format: 'commonjs',
      },
      plugins: [
        commonjs({
          include: /node_modules/,
          extensions: ['.js'],
        }),
        resolve({
          preferBuiltins: true,
          browser: true,
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
        ...resolvePlugins(preset),
        replace({
          preventAssignment: true,
          values: {
            'process.env.NODE_ENV': JSON.stringify('production'),
          },
        }),
      ],
      onwarn: () => {},
    });

    await bundler.write({ dir: buildPaths.appBuild });

    console.log(getMetrics(startTime, buildPaths.appBuild));
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
