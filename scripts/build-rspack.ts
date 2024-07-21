import path from 'path';
import fse from 'fs-extra';
import { rspack, Compiler } from '@rspack/core';
import { errorToString, getArguments, getMetrics } from './utils';

const performBuild = (compiler: Compiler) => {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      return resolve(stats);
    });
  });
};

(async () => {
  try {
    const { project, preset, entrypoint = 'src/index.tsx' } = getArguments();

    if (!project || !fse.pathExistsSync(`./projects/${project}`)) {
      throw new Error('Invalid project');
    } else if (preset) {
      throw new Error("Presets aren't supported");
    } else if (!fse.pathExistsSync(`./projects/${project}/${entrypoint}`)) {
      throw new Error(`Invalid entrypoint ${entrypoint}`);
    }

    const buildPaths = {
      appEntrypoint: `./projects/${project}/${entrypoint}`,
      appBuild: './builds/build-rspack',
    };

    await fse.emptydir(buildPaths.appBuild);

    const startTime = Date.now();

    const compiler = rspack({
      mode: 'production',
      entry: {
        index: buildPaths.appEntrypoint,
      },
      output: {
        path: path.resolve(buildPaths.appBuild),
        filename: '[name].js',
      },
      resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            loader: 'builtin:swc-loader',
            options: {
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
            },
          },
        ],
      },
      optimization: {
        minimize: true,
        minimizer: [new rspack.SwcJsMinimizerRspackPlugin()],
      },
    });

    await performBuild(compiler);

    console.log(getMetrics(startTime, buildPaths.appBuild));
    process.exit(0);
  } catch (error) {
    console.error(errorToString(error));
    process.exit(1);
  }
})();
