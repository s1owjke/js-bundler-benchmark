# JS Bundler Benchmark

Performance benchmark for most popular javascript bundlers in various configurations

- [esbuild](https://esbuild.github.io/)
- [parcel](https://parceljs.org/) (babel + terser)
- [rollup](https://rollupjs.org/) (babel + terser, esbuild, swc)
- [rspack](https://rspack.dev/) (swc)
- [vite](https://vitejs.dev/) (esbuild)
- [webpack](https://webpack.js.org/) (babel + terser, esbuild, swc)

Available test projects (all of them based on React):

- empty project
- project containing five big libraries
- all components from Material UI
- synthetic test with 5000 small components

## Results

All tests were done on 2023 MacBook Pro 12-core M2 Pro with 32gb of RAM, Mac OS 11.5.2 and Node 20.9.0, production build, no cache, configs are as close as possible

![Build time in sec](images/build-time-in-sec.png "Build time in sec")

Time in sec (average time for 5 runs)

|                             | **react-empty** | **react-libraries** | **react-mui** | **react-synthetic** |
|-----------------------------| --------------- | ------------------- | ------------- | ------------------- |
| **Esbuild**                 | 0.025           | 0.086               | 0.097         | 0.371               |
| **Parcel: babel + terser**  | 1.075           | 4.146               | 2.790         | 17.396              |
| **Rollup: babel + terser**  | 1.337           | 5.516               | 4.285         | 14.419              |
| **Rollup: esbuild**         | 0.758           | 2.280               | 2.608         | 6.001               |
| **Rollup: swc**             | 0.808           | 2.992               | 2.968         | 5.809               |
| **Rspack**                  | 0.109           | 0.649               | 0.352         | 3.464               |
| **Vite**                    | 0.463           | 2.126               | 1.631         | 6.287               |
| **Webpack: babel + terser** | 0.969           | 5.068               | 2.787         | 8.951               |
| **Webpack: esbuild**        | 0.337           | 1.469               | 1.149         | 3.269               |
| **Webpack: swc**            | 0.377           | 1.848               | 1.319         | 3.463               |

Bundle size in KiB

|                             | **react-empty** | **react-libraries** | **react-mui** | **react-synthetic** |
|-----------------------------| --------------- | ------------------- | ------------- | ------------------- |
| **Esbuild**                 | 164.89          | 1307.66             | 666.31        | 1008.77             |
| **Parcel: babel + terser**  | 169.95          | 1435.18             | 719.28        | 1169.15             |
| **Rollup: babel + terser**  | 158.20          | 1288.17             | 618.09        | 787.13              |
| **Rollup: esbuild**         | 163.90          | 1306.80             | 670.02        | 816.89              |
| **Rollup: swc**             | 157.32          | 1272.01             | 612.17        | 791.13              |
| **Rspack**                  | 167.21          | 1448.15             | 780.15        | 1637.96             |
| **Vite**                    | 160.40          | 1301.38             | 624.26        | 833.02              |
| **Webpack: babel + terser** | 158.58          | 1531.55             | 624.99        | 868.74              |
| **Webpack: esbuild**        | 163.74          | 1686.67             | 646.32        | 888.71              |
| **Webpack: swc**            | 160.60          | 1527.33             | 627.58        | 875.74              |

Bundle size after gzip in KiB

|                             | **react-empty** | **react-libraries** | **react-mui** | **react-synthetic** |
|-----------------------------| --------------- | ------------------- | ------------- | ------------------- |
| **Esbuild**                 | 54.87           | 382.66              | 198.44        | 132.23              |
| **Parcel: babel + terser**  | 55.16           | 387.85              | 201.28        | 87.32               |
| **Rollup: babel + terser**  | 52.98           | 368.17              | 181.60        | 67.54               |
| **Rollup: esbuild**         | 54.81           | 383.57              | 201.60        | 84.35               |
| **Rollup: swc**             | 52.53           | 365.00              | 180.93        | 66.97               |
| **Rspack**                  | 54.45           | 391.42              | 207.35        | 140.92              |
| **Vite**                    | 53.50           | 381.24              | 187.90        | 82.94               |
| **Webpack: babel + terser** | 53.04           | 423.12              | 183.86        | 84.55               |
| **Webpack: esbuild**        | 55.12           | 460.51              | 194.42        | 86.09               |
| **Webpack: swc**            | 53.63           | 423.99              | 185.15        | 92.34               |

## How to run it

First you must install the npm dependencies (don't forget to install them for each project), after that you can use following commands

- `npm run build:esbuild`
- `npm run build:parcel`
- `npm run build:rollup`
- `npm run build:rspack`
- `npm run build:vite`
- `npm run build:webpack`

Common options

- `--project <string>` project from `./projects` directory
- `--entrypoint <string>` project entry point, default `src/index.tsx`

Rollup and Webpack support various presets

- `--preset <babel|esbuild|swc>` preset used for bundling, default `babel`

Examples

```shell
npm run build:esbuild -- --project react-empty --entrypoint src/index.tsx
npm run build:webpack -- --project react-empty --preset swc --entrypoint src/index.tsx
```

Don't forget to add `--` after npm script to [pass arguments](https://docs.npmjs.com/cli/v6/commands/npm-run-script#description)
