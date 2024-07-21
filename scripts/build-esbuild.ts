import fse from 'fs-extra';
import { build } from 'esbuild';
import { errorToString, getArguments, getMetrics } from './utils';

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
      appBuild: './builds/build-esbuild',
    };

    await fse.emptydir(buildPaths.appBuild);

    const startTime = Date.now();

    await build({
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
  } catch (error) {
    console.error(errorToString(error));
    process.exit(1);
  }
})();
