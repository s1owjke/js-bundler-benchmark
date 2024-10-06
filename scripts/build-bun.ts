import fse from 'fs-extra';
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
      appBuild: './builds/build-bun',
    };

    await fse.emptydir(buildPaths.appBuild);

    const startTime = Date.now();

    await Bun.build({
      entrypoints: [buildPaths.appEntrypoint],
      outdir: buildPaths.appBuild,
      naming: '[name].[ext]',
      minify: true,
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    });

    console.log(getMetrics(startTime, buildPaths.appBuild));
    process.exit(0);
  } catch (error) {
    console.error(errorToString(error));
    process.exit(1);
  }
})();
