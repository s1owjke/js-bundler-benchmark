import fse from 'fs-extra';
import { Parcel } from '@parcel/core';
import { getArguments, getMetrics } from './utils.js';

(async () => {
  try {
    const { project, preset, entrypoint = 'src/index.tsx' } = getArguments();

    if (preset) {
      throw new Error('Presets aren\'t supported');
    } else if (!project || !fse.pathExistsSync(`./projects/${project}`)) {
      throw new Error('Invalid project');
    } else if (!fse.pathExistsSync(`./projects/${project}/${entrypoint}`)) {
      throw new Error(`Invalid entrypoint ${entrypoint}`);
    }

    const buildPaths = {
      appEntrypoint: `./projects/${project}/${entrypoint}`,
      appBuild: './builds/build-parcel',
    };

    await fse.emptydir(buildPaths.appBuild);

    const configFiles = {
      [`./projects/${project}/.babelrc`]: {
        compact: true,
      },
      [`./projects/${project}/.parcelrc`]: {
        bundler: '@parcel/bundler-default',
        transformers: {
          '*.{js,jsx,mjs,ts,tsx}': ['@parcel/transformer-babel', '@parcel/transformer-js'],
          'url:*': ['...', '@parcel/transformer-raw'],
        },
        namers: ['@parcel/namer-default'],
        runtimes: ['@parcel/runtime-js'],
        optimizers: {
          '*.{js,mjs,cjs}': ['@parcel/optimizer-terser'],
        },
        packagers: {
          '*.{js,mjs,cjs}': '@parcel/packager-js',
          '*.ts': '@parcel/packager-ts',
          '*': '@parcel/packager-raw',
        },
        compressors: {
          '*': ['@parcel/compressor-raw'],
        },
        resolvers: ['@parcel/resolver-default'],
        reporters: [],
      },
      [`./projects/${project}/.terserrc`]: {
        format: {
          comments: false,
        },
      },
    };

    for await (const [configFile, contents] of Object.entries(configFiles)) {
      await fse.writeJson(configFile, contents, { spaces: 2 })
    }

    const startTime = Date.now();

    const bundler = new Parcel({
      mode: 'production',
      entries: buildPaths.appEntrypoint,
      cacheDir: `./projects/${project}/.parcel-cache`,
      targets: {
        default: {
          distDir: buildPaths.appBuild,
        },
      },
      defaultTargetOptions: {
        shouldOptimize: true,
        shouldScopeHoist: true,
        sourceMaps: false,
      }
    });

    await bundler.run();

    console.log(getMetrics(startTime, buildPaths.appBuild));

    for await (const configFile of Object.keys(configFiles)) {
      await fse.remove(configFile);
    }

    await fse.remove(`./projects/${project}/.parcel-cache`);

    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
