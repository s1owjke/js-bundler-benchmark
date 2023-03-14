import fse from 'fs-extra';
import esbuild from 'esbuild';
import { getArguments, getMetrics } from './utils.js';

(async () => {
  try {
    const { project, preset } = getArguments();

    if (preset) {
      throw new Error("Presets aren't supported");
    } else if (!project || !fse.pathExistsSync(`./projects/${project}`)) {
      throw new Error('Invalid project');
    }

    const buildPaths = {
      appEntrypoint: `./projects/${project}/src/index.tsx`,
      appBuild: './builds/build-esbuild',
    };

    await fse.emptydir(buildPaths.appBuild);

    const startTime = Date.now();

    await esbuild.build({
      entryPoints: [buildPaths.appEntrypoint],
      outdir: buildPaths.appBuild,
      entryNames: '[name]',
      bundle: true,
      minify: true,
      target: ['es2015'],
      jsx: 'automatic',
    });

    console.log(getMetrics(startTime, buildPaths.appBuild));
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
