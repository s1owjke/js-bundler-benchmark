import path from 'path';
import fse from 'fs-extra';
import { createCompiler, Compiler } from '@rspack/core';
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

    const compiler = createCompiler({
      mode: 'production',
      entry: {
        index: buildPaths.appEntrypoint,
      },
      output: {
        path: path.resolve(buildPaths.appBuild),
        filename: '[name].js',
      },
      target: ['web', 'es2015'],
      builtins: {
        define: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
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
