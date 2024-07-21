import path from 'path';
import fse from 'fs-extra';
import { webpack, Compiler } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { errorToString, getArguments, getMetrics } from './utils';

const SUPPORTED_PRESETS = {
  babel: 'babel',
  esbuild: 'esbuild',
  swc: 'swc',
} as const;

type SupportedPreset = keyof typeof SUPPORTED_PRESETS;

const isSupportedPreset = (preset: unknown): preset is SupportedPreset => {
  return typeof preset === 'string' && Object.values<string>(SUPPORTED_PRESETS).includes(preset);
};

const resolveBundler = (preset: SupportedPreset) => {
  switch (preset) {
    case SUPPORTED_PRESETS.babel:
      return {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
        },
      };
    case SUPPORTED_PRESETS.esbuild:
      return {
        loader: 'esbuild-loader',
        options: {
          target: ['es2015'],
          jsx: 'automatic',
        },
      };
    case SUPPORTED_PRESETS.swc:
      return {
        loader: 'swc-loader',
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
      };
  }
};

const resolveTerserConfig = (preset: SupportedPreset) => {
  switch (preset) {
    case SUPPORTED_PRESETS.babel:
      return {
        minify: TerserPlugin.terserMinify,
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      };
    case SUPPORTED_PRESETS.esbuild:
      return {
        minify: TerserPlugin.esbuildMinify,
      };
    case SUPPORTED_PRESETS.swc:
      return {
        minify: TerserPlugin.swcMinify,
      };
  }
};

const performBuild = (compiler: Compiler) => {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats && stats.hasErrors()) {
        return reject(new Error(`Build failed with errors`));
      }

      return resolve(stats);
    });
  });
};

(async () => {
  try {
    const { project, preset = SUPPORTED_PRESETS.babel, entrypoint = 'src/index.tsx' } = getArguments();

    if (!project || !fse.pathExistsSync(`./projects/${project}`)) {
      throw new Error('Invalid project');
    } else if (!isSupportedPreset(preset)) {
      throw new Error('Unsupported preset');
    } else if (!fse.pathExistsSync(`./projects/${project}/${entrypoint}`)) {
      throw new Error(`Invalid entrypoint ${entrypoint}`);
    }

    const buildPaths = {
      appEntrypoint: `./projects/${project}/${entrypoint}`,
      appBuild: './builds/build-webpack',
    };

    await fse.emptydir(buildPaths.appBuild);

    const startTime = Date.now();

    const bundler = webpack({
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
            use: resolveBundler(preset),
          },
        ],
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(resolveTerserConfig(preset))],
      },
    });

    await performBuild(bundler);

    console.log(getMetrics(startTime, buildPaths.appBuild));
    process.exit(0);
  } catch (error) {
    console.error(errorToString(error));
    process.exit(1);
  }
})();
