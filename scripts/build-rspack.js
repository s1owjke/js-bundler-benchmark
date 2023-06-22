import path from 'path';
import fse from 'fs-extra';
import { createCompiler } from '@rspack/core';
import { getArguments, getMetrics } from './utils.js';

const performBuild = (compiler) => {
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
    });

    await performBuild(compiler);

    console.log(getMetrics(startTime, buildPaths.appBuild));
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
